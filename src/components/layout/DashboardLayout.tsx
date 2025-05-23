import { SideNav } from './SideNav';
import { Sun, Moon, User, BellRing, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="min-h-screen flex">
      <SideNav />

      <div className="flex-1 flex flex-col bg-[hsl(var(--entrance-bg))] text-[hsl(var(--entrance-text-primary))]">
        <header className="h-14 md:h-16 border-b border-[hsl(var(--entrance-border))] flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-4">
            {title && (
              <div>
                <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
                {subtitle && <p className="text-xs md:text-sm text-[hsl(var(--entrance-text-secondary))]">{subtitle}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <HelpCircle size={18} className="text-[hsl(var(--entrance-text-secondary))]" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <BellRing size={18} className="text-[hsl(var(--entrance-text-secondary))]" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Sun size={18} className="text-[hsl(var(--entrance-text-secondary))]" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={18} className="text-[hsl(var(--entrance-text-secondary))]" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
