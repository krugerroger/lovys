// /manage/Layout.jsx
import { LayoutProps } from '@/types/layout';
import Header from '@/components/Header';

export default function AuthLayout({ children }: LayoutProps) {
  return (
        <div className="h-full">
            <Header />
          {children}
        </div>
  );
}