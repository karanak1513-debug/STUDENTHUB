async function runTests() {
  const base = 'http://127.0.0.1:5000';
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health check & SQLite WAL mode
  await test('Health endpoint /api/health (SQLite WAL Mode)', async () => {
    const res = await fetch(`${base}/api/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'healthy') throw new Error(`Unexpected status: ${data.status}`);
    if (!data.database.includes('SQLite')) throw new Error(`Database is not SQLite: ${data.database}`);
  });

  // 2. Security Headers
  await test('Security headers are present', async () => {
    const res = await fetch(`${base}/api/health`);
    const nosniff = res.headers.get('x-content-type-options');
    const xframe = res.headers.get('x-frame-options');
    if (nosniff !== 'nosniff') throw new Error(`Missing X-Content-Type-Options: nosniff`);
    if (xframe !== 'SAMEORIGIN') throw new Error(`Missing X-Frame-Options: SAMEORIGIN`);
  });

  // 3. Task CRUD: Create Task
  let createdTaskId = null;
  await test('POST /api/tasks creates task in SQLite', async () => {
    const res = await fetch(`${base}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Complete Distributed Systems Proof',
        subject: 'CS501',
        due: 'Tomorrow, 5:00 PM',
        priority: 'high',
        tag: 'Assignment',
      }),
    });
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.data || !data.data.id) throw new Error('Task created without ID');
    createdTaskId = data.data.id;
  });

  // 4. Task CRUD: Get by ID
  await test('GET /api/tasks/:id retrieves created task', async () => {
    const res = await fetch(`${base}/api/tasks/${createdTaskId}`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.data.title !== 'Complete Distributed Systems Proof') throw new Error('Task title mismatch');
  });

  // 5. Task CRUD: Toggle Task
  await test('PATCH /api/tasks/:id/toggle toggles task completion', async () => {
    const res = await fetch(`${base}/api/tasks/${createdTaskId}/toggle`, { method: 'PATCH' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.data.completed !== true) throw new Error('Task not marked completed');
  });

  // 6. Task CRUD: Update Task
  await test('PUT /api/tasks/:id updates task details', async () => {
    const res = await fetch(`${base}/api/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Complete Distributed Systems Proof (Revised)',
        priority: 'medium',
      }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.data.title !== 'Complete Distributed Systems Proof (Revised)') throw new Error('Update title failed');
  });

  // 7. Task CRUD: Delete Task
  await test('DELETE /api/tasks/:id removes task', async () => {
    const res = await fetch(`${base}/api/tasks/${createdTaskId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const verifyRes = await fetch(`${base}/api/tasks/${createdTaskId}`);
    if (verifyRes.status !== 404) throw new Error('Deleted task still exists');
  });

  // 8. Notifications CRUD: List notifications
  await test('GET /api/notifications returns notification list', async () => {
    const res = await fetch(`${base}/api/notifications`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.data)) throw new Error('Notifications data is not an array');
  });

  // 9. Notifications CRUD: Create & Mark Read
  let createdNotifId = null;
  await test('POST /api/notifications creates notification & PATCH marks read', async () => {
    const postRes = await fetch(`${base}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Midterm Room Shift',
        message: 'Midterm will now be held in Hall B',
        type: 'blue',
        category: 'academic',
      }),
    });
    if (postRes.status !== 201) throw new Error(`Create notification status ${postRes.status}`);
    const postData = await postRes.json();
    createdNotifId = postData.data.id;

    const patchRes = await fetch(`${base}/api/notifications/${createdNotifId}/read`, { method: 'PATCH' });
    if (!patchRes.ok) throw new Error(`Mark read status ${patchRes.status}`);
    const patchData = await patchRes.json();
    if (patchData.data.read !== true) throw new Error('Notification was not marked read');
  });

  // 10. Focus Sessions: Log Focus Session
  await test('POST /api/routines/focus-sessions logs focus sprint', async () => {
    const res = await fetch(`${base}/api/routines/focus-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'Database Systems Implementation',
        durationMinutes: 30,
        mode: 'focus',
      }),
    });
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.data.duration_minutes) throw new Error('Focus session duration not logged');
  });

  // 11. Dashboard Stats Traceability
  await test('GET /api/dashboard/stats returns authentic metrics with focus minutes', async () => {
    const res = await fetch(`${base}/api/dashboard/stats`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.data.metrics) throw new Error('No metrics returned');
    if (typeof data.data.metrics.studyHoursToday !== 'number') {
      throw new Error('studyHoursToday is not a verified numeric metric');
    }
  });

  // 12. API Assignments
  await test('GET /api/assignments returns assignment list', async () => {
    const res = await fetch(`${base}/api/assignments`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.data)) throw new Error('Assignments is not an array');
  });

  // 13. API Routines & Habits
  await test('GET /api/routines/habits returns habits array', async () => {
    const res = await fetch(`${base}/api/routines/habits`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.data)) throw new Error('Habits is not an array');
  });

  // 14. API Timetable
  await test('GET /api/timetable returns class schedule', async () => {
    const res = await fetch(`${base}/api/timetable`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.data) throw new Error('No timetable returned');
  });

  // 15. API Goals & Milestones
  await test('GET /api/goals/milestones returns milestones', async () => {
    const res = await fetch(`${base}/api/goals/milestones`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.data)) throw new Error('Milestones is not an array');
  });

  // 16. API 404 Handler
  await test('GET /api/invalid-route returns 404 JSON', async () => {
    const res = await fetch(`${base}/api/invalid-route`);
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    const data = await res.json();
    if (data.success !== false) throw new Error('Expected success: false in 404 JSON');
  });

  console.log(`\n========================================`);
  console.log(`TOTAL PASSED: ${passed} | TOTAL FAILED: ${failed}`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runTests();
