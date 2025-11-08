import AuthProvider from '@/components/cms/AuthProvider';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
