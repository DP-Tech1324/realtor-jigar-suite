import ProtectedRoute from './ProtectedRoute';
// Bring in the AI chat bubble for admin users. It renders the shared base
// with context="admin" to provide specialized assistance to administrators.
import AiChatBubble from '@/components/AiChatBubble';
export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <div style={{ padding: 40, fontSize: 24 }}>
        🔑 Admin Dashboard (protected)
        {/* Render the admin AI chat bubble at bottom‑right */}
        <AiChatBubble />
      </div>
    </ProtectedRoute>
  );
}
