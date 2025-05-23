import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  Megaphone,
  Users,
  Search,
  Settings,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavLink = ({ href, icon, label, active }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-purple-900/30 text-purple-400 font-medium'
          : 'text-gray-300 hover:text-purple-300 hover:bg-purple-900/10'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export function SideNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
    },
    {
      href: '/claims',
      icon: <ClipboardCheck size={18} />,
      label: 'Claims',
    },
    {
      href: '/messages',
      icon: <MessageSquare size={18} />,
      label: 'Messages',
    },
    {
      href: '/campaigns',
      icon: <Megaphone size={18} />,
      label: 'Campaigns',
    },
    {
      href: '/contacts',
      icon: <Users size={18} />,
      label: 'Contacts',
    },
    {
      href: '/subscribers',
      icon: <Plus size={18} />,
      label: 'Subscribers',
    },
    {
      href: '/lookups',
      icon: <Search size={18} />,
      label: 'Lookups',
    },
    {
      href: '/workspace',
      icon: <Settings size={18} />,
      label: 'Workspace',
    },
  ];

  return (
    <div className="h-screen w-[200px] bg-[#1e2029] flex flex-col">
      <div className="p-4 border-b border-[#2c2e3a]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-lg flex items-center">
            <img src="/purpleO.svg" alt="Onryl" className="h-6 w-6 mr-2" />
            Onryl
          </span>
        </div>
      </div>

      <div className="p-4 border-b border-[#2c2e3a]">
        <div className="flex flex-col">
          <div className="mb-2">
            <Avatar className="h-10 w-10 bg-purple-700">
              <span className="text-xs">MFG</span>
            </Avatar>
          </div>
          <div className="text-white text-sm font-medium">billy roth</div>
          <div className="text-purple-300 text-xs">Admin</div>
          <div className="text-gray-400 text-xs mt-1">User# - 4942</div>
          <div className="text-gray-400 text-xs">Workspace# - 2320</div>
        </div>
      </div>

      <nav className="mt-2 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className="p-4 text-xs text-gray-400 border-t border-gray-700">
        <div>Integrated Apps</div>
        <div className="mt-2">No Integrations</div>
      </div>
    </div>
  );
}
