import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TodoListPage = lazy(() => import('./pages/TodoListPage'));
const AssignmentsPage = lazy(() => import('./pages/AssignmentsPage'));
const RoutineTrackerPage = lazy(() => import('./pages/RoutineTrackerPage'));
const TimetablePage = lazy(() => import('./pages/TimetablePage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner fullScreen message="Initializing Scholara OS..." />}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="todo" element={<TodoListPage />} />
              <Route path="assignments" element={<AssignmentsPage />} />
              <Route path="routine" element={<RoutineTrackerPage />} />
              <Route path="timetable" element={<TimetablePage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}
