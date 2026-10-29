import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';

import DashboardPage from './pages/DashboardPage';
import TodoListPage from './pages/TodoListPage';
import AssignmentsPage from './pages/AssignmentsPage';
import RoutineTrackerPage from './pages/RoutineTrackerPage';
import TimetablePage from './pages/TimetablePage';
import GoalsPage from './pages/GoalsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="todo" element={<TodoListPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="routine" element={<RoutineTrackerPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
