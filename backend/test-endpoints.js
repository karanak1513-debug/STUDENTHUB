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

  // 1. Health check
  await test('Health endpoint /api/health', async () => {
    const res = await fetch(`${base}/api/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'healthy') throw new Error(`Unexpected status: ${data.status}`);
  });

  // 2. Static SPA serving
  await test('Root / serves Frontend SPA index.html', async () => {
    const res = await fetch(`${base}/`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const html = await res.text();
    if (!html.includes('<div id="root"></div>')) throw new Error('Root HTML does not include #root');
  });

  // 3. SPA Route Fallback
  await test('SPA Route /dashboard fallback serves index.html', async () => {
    const res = await fetch(`${base}/dashboard`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const html = await res.text();
    if (!html.includes('<div id="root"></div>')) throw new Error('Fallback HTML does not include #root');
  });

  // 4. API tasks
  await test('GET /api/tasks returns data array', async () => {
    const res = await fetch(`${base}/api/tasks`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.data)) throw new Error('Data is not an array');
  });

  // 5. API assignments
  await test('GET /api/assignments returns data array', async () => {
    const res = await fetch(`${base}/api/assignments`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.data)) throw new Error('Data is not an array');
  });

  // 6. API routines
  await test('GET /api/routines/habits returns habits', async () => {
    const res = await fetch(`${base}/api/routines/habits`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.data)) throw new Error('Data is not an array');
  });

  // 7. API timetable
  await test('GET /api/timetable returns timetable', async () => {
    const res = await fetch(`${base}/api/timetable`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.data) throw new Error('No timetable data returned');
  });

  // 8. API goals
  await test('GET /api/goals/milestones returns milestones', async () => {
    const res = await fetch(`${base}/api/goals/milestones`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.data)) throw new Error('Data is not an array');
  });

  // 9. API dashboard
  await test('GET /api/dashboard/stats returns metrics', async () => {
    const res = await fetch(`${base}/api/dashboard/stats`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.data.metrics) throw new Error('No metrics returned');
  });

  // 10. API 404 handler
  await test('GET /api/nonexistent-endpoint returns 404 JSON', async () => {
    const res = await fetch(`${base}/api/nonexistent-endpoint`);
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    const data = await res.json();
    if (data.success !== false) throw new Error('Expected success: false in 404 JSON response');
  });

  // 11. Security Headers
  await test('Security headers are present', async () => {
    const res = await fetch(`${base}/api/health`);
    const nosniff = res.headers.get('x-content-type-options');
    const xframe = res.headers.get('x-frame-options');
    if (nosniff !== 'nosniff') throw new Error(`Missing X-Content-Type-Options: nosniff (got: ${nosniff})`);
    if (xframe !== 'SAMEORIGIN') throw new Error(`Missing X-Frame-Options: SAMEORIGIN (got: ${xframe})`);
  });

  console.log(`\n========================================`);
  console.log(`TOTAL PASSED: ${passed} | TOTAL FAILED: ${failed}`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runTests();
