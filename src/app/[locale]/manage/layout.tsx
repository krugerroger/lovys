// /manage/Layout.jsx
import { LayoutProps } from '@/types/layout';
import Sidebar from '@/components/Sidebar';

export default function ManageLayout({ children }: LayoutProps) {
  return (
        <Sidebar>
        <div className="h-full">
          {children}
        </div>
      </Sidebar>
  );
}