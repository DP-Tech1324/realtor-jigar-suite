import ProtectedRoute from './ProtectedRoute';
export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <div style={{padding:40, fontSize:24}}>🔑 Admin Dashboard (protected)</div>
    </ProtectedRoute>
  );
}
