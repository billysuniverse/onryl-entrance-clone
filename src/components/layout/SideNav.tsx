'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  Megaphone,
  Users,
  Search,
  Settings,
  Plus,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const NavLink = ({ href, icon, label, active, collapsed, onClick }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-md',
        active
          ? 'bg-purple-900/30 text-purple-400 font-medium'
          : 'text-gray-300 hover:text-purple-300 hover:bg-purple-900/10',
        collapsed && 'justify-center p-2'
      )}
      onClick={onClick}
    >
      <div className={collapsed ? 'w-8 h-8 flex items-center justify-center' : ''}>
        {icon}
      </div>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

export function SideNav() {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-collapse on mobile and keep expanded on desktop
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [pathname, isMobile]);

  const navItems = [
    {
      href: '/dashboard',
      icon: <LayoutDashboard size={collapsed ? 20 : 18} />,
      label: 'Dashboard',
    },
    {
      href: '/claims',
      icon: <ClipboardCheck size={collapsed ? 20 : 18} />,
      label: 'Claims',
    },
    {
      href: '/messages',
      icon: <MessageSquare size={collapsed ? 20 : 18} />,
      label: 'Messages',
    },
    {
      href: '/campaigns',
      icon: <Megaphone size={collapsed ? 20 : 18} />,
      label: 'Campaigns',
    },
    {
      href: '/contacts',
      icon: <Users size={collapsed ? 20 : 18} />,
      label: 'Contacts',
    },
    {
      href: '/subscribers',
      icon: <Plus size={collapsed ? 20 : 18} />,
      label: 'Subscribers',
    },
    {
      href: '/lookups',
      icon: <Search size={collapsed ? 20 : 18} />,
      label: 'Lookups',
    },
    {
      href: '/workspace',
      icon: <Settings size={collapsed ? 20 : 18} />,
      label: 'Workspace',
    },
  ];

  // Mobile menu button - shown in header
  const MobileMenuButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden rounded-full"
      onClick={() => setMobileOpen(!mobileOpen)}
    >
      {mobileOpen ? <X size={20} /> : <Menu size={20} />}
    </Button>
  );

  return (
    <>
      {/* Mobile menu button - exported for use in DashboardLayout */}
      {isMobile && <MobileMenuButton />}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[hsl(var(--entrance-sidebar))] border-r border-[hsl(var(--entrance-border))] transition-all duration-300 ease-in-out",
          collapsed ? "w-[70px]" : "w-[220px]",
          // Mobile specific classes
          isMobile && "shadow-xl",
          isMobile && !mobileOpen && "-translate-x-full",
          isMobile && mobileOpen && "translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "p-4 border-b border-[hsl(var(--entrance-border))]",
          collapsed ? "flex justify-center" : ""
        )}>
          <div className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "justify-center"
          )}>
            <Link href="/dashboard" className="flex items-center">
              <img src="/purpleO.svg" alt="Onryl" className={cn("h-8 w-8", collapsed ? "" : "mr-2")} />
              {!collapsed && <span className="font-bold text-white text-xl">Onryl</span>}
            </Link>
          </div>
        </div>

        {/* User profile */}
        <div className={cn(
          "p-4 border-b border-[hsl(var(--entrance-border))]",
          collapsed ? "flex flex-col items-center" : ""
        )}>
          <div className={cn(
            "flex",
            collapsed ? "flex-col items-center" : "flex-col"
          )}>
            <div className={cn(
              "mb-3",
              collapsed ? "flex justify-center" : "flex items-center"
            )}>
              <Avatar className="h-10 w-10 bg-[hsl(var(--entrance-primary))]">
                <span className="text-xs font-medium">MFG</span>
              </Avatar>
              {!collapsed && (
                <div className="ml-3">
                  <div className="text-white text-sm font-medium">billy roth</div>
                  <div className="text-[hsl(var(--entrance-primary-light))] text-xs">Admin</div>
                </div>
              )}
            </div>
            {!collapsed && (
              <>
                <div className="text-[hsl(var(--entrance-text-muted))] text-xs mt-1">User# - 4942</div>
                <div className="text-[hsl(var(--entrance-text-muted))] text-xs">Workspace# - 2320</div>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "mt-4 flex-1 overflow-y-auto",
          collapsed ? "px-1" : "px-2"
        )}>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
              collapsed={collapsed}
              onClick={() => isMobile && setMobileOpen(false)}
            />
          ))}
        </nav>

        {/* Bottom section */}
        {!collapsed && (
          <div className="p-4 text-xs text-[hsl(var(--entrance-text-muted))] border-t border-[hsl(var(--entrance-border))]">
            <div className="font-medium">Integrated Apps</div>
            <div className="mt-2">No Integrations</div>
          </div>
        )}

        {/* Collapse/Expand button - only on desktop */}
        {!isMobile && (
          <button
            className="absolute -right-3 top-20 bg-[hsl(var(--entrance-sidebar))] border border-[hsl(var(--entrance-border))] rounded-full p-1.5 hover:bg-[hsl(var(--entrance-primary))] transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              size={16}
              className={cn(
                "text-white transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        )}

        {/* Close button - only on mobile */}
        {isMobile && mobileOpen && (
          <button
            className="absolute right-2 top-2 text-white p-2"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Overlay for mobile */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

// Export the component to be used in DashboardLayout
SideNav.displayName = "SideNav";
