import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import NotFoundPage from './pages/NotFoundPage';
import { isAuthenticated } from './auth';
import { ThemeProvider } from './context/ThemeContext';
const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : _jsx(Navigate, { to: "/login", replace: true });
};
const App = () => {
    return (_jsx(ThemeProvider, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/tasks", element: _jsx(ProtectedRoute, { children: _jsx(TasksPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }) }) }));
};
export default App;
