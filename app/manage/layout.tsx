// /manage/Layout.jsx
import { LayoutProps } from '@/types/layout';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { UserProvider } from '../context/userContext';

export default function ManageLayout({ children }: LayoutProps) {
  return (
        <Sidebar>
        <div className="h-full">
          {children}
        </div>
      </Sidebar>
  );
}