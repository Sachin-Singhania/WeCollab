"use client";

import { ReactNode } from 'react';

import ProtectedRoute from '../components/Protected';
export default function Layout({ children }: { children: ReactNode }) {

  return (
    <ProtectedRoute>
        {children}
    </ProtectedRoute>
  );
}

