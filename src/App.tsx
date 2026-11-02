import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import ProtectedRoute from './auth/ProtectedRoute';
import DeliveryListPage from './pages/DeliveryListPage';
import DeliveryPage from './pages/DeliveryPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><DeliveryListPage /></ProtectedRoute>} />
      <Route path="/deliveries/:id" element={<ProtectedRoute><DeliveryPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
