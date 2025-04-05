"use client";
import useDashboardStore from '../store/dashboard';
import YouTubeOwnerDashboard from '../components/owner/OwnerDashboard';
import EditorDashboard from '../components/editor/EditorDashboard';
import useUserStore from '../store/store';
export default function DashboardPage() {
  const { role, dashboard } = useDashboardStore();
  const {user}= useUserStore();
  return (
    <div>
      {role === "OWNER" && <YouTubeOwnerDashboard dashboard={dashboard} role={role} user={user}   />}
      {role === "EDITOR" && <EditorDashboard dashboard={dashboard} role={role} user={user}  />}
    </div>
  );
}
