import { SideNav } from './SideNav';
import { Sun, Moon, User, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#1e2029] text-white flex">
      <SideNav />

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-[#2a2d36] flex items-center justify-between p-4">
          <div className="flex items-center">
            {title && (
              <div>
                <h1 className="text-xl font-semibold">{title}</h1>
                {subtitle && <p className="text-sm text-[#8c8e96]">{subtitle}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Sun size={18} className="text-[#8c8e96]" />
            </Button>
            <Button variant="ghost" size="icon">
              <User size={18} className="text-[#8c8e96]" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto bg-[#1e2029]">{children}</main>
      </div>
    </div>
  );
}
