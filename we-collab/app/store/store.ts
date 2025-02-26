import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User{
    id: string;
    email : string;
    jwtToken : string;
}
const useUserStore = create(
        (set) => ({
            user: null,
            setUser: (user: User) => set({ user }),
            logout: () => set({ user: null }),
        }),
       
);
export default useUserStore;