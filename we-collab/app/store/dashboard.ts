import { create } from 'zustand';

interface Dashboard {
  id: string;
  name: string;
  Video : Video[]
}
interface Video {
  id: string;
  name : string;
}
type Role = "EDITOR" | "OWNER";
interface DashboardState {
  dashboard: Dashboard | null;
  role: Role|null; 
  setDashboard: (dashboard: Dashboard) => void;
  setRole: (role: Role) => void; 
  clearDashboard: () => void;
}

const useDashboardStore = create<DashboardState>()(
    (set) => ({
      dashboard: null,
      role: null,
      setDashboard: (dashboard) => set({ dashboard }),
      setRole: (role: Role) => set({ role }),
      clearDashboard: () => set({ dashboard: null, role: null }),
    }),
);

export default useDashboardStore;
