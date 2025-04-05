import { create } from 'zustand';

export interface User{
    id: string;
    email : string;
    jwtToken : string;
}
interface UserState {
    user : User | null;
    setUser: (user: User) => void;
    logout: () => void;
  }
const useUserStore = create<UserState>()(
        (set) => ({
            user: null,
            setUser: (user: User) => set({ user }),
            logout: () => set({ user: null }),
        }),
       
);
export default useUserStore;