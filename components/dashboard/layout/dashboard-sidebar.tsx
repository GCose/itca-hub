import { JSX, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  User,
  BarChart2,
  X,
  LayoutDashboardIcon,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type NavItem = {
  name: string;
  href: string;
  icon: JSX.Element;
  children?: NavItem[];
};

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const router = useRouter();
  const isAdminRef = useRef(false);

  // Navigation items
  const adminNavItems: NavItem[] = [
    {
      name: 'Overview',
      href: '/admin',
      icon: <LayoutDashboardIcon className="h-5 w-5" />,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'Events',
      href: '/admin/events',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: 'Resources',
      href: '/admin/resources',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const studentNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/student', icon: <Home className="h-5 w-5" /> },
    {
      name: 'Events',
      href: '/student/events',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: 'Resources',
      href: '/student/resources',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'Profile',
      href: '/student/profile',
      icon: <User className="h-5 w-5" />,
    },
    {
      name: 'Help',
      href: '/student/help',
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  // Determine NavItems
  const getNavItems = () => {
    isAdminRef.current = router.pathname.startsWith('/admin');
    return isAdminRef.current ? adminNavItems : studentNavItems;
  };

  const handleLogout = () => {
    router.push('/api/logout');
  };

  // Check if a nav item is active
  const isActive = (href: string) => {
    // For dashboard routes, only exact match
    if (href === '/admin' || href === '/student') {
      return router.pathname === href;
    }
    // For other routes, either exact match or starts with the path
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/*==================== Mobile sidebar backdrop ====================*/}
      <AnimatePresence>
        {open && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-gray-600/30 backdrop-blur-sm bg-opacity-75 max-[967px]:block hidden"
          />
        )}
      </AnimatePresence>
      {/*==================== End of Mobile sidebar backdrop ====================*/}

      {/*==================== Sidebar ====================*/}
      <div
        className={`fixed rounded-tr-4xl inset-y-0 z-50 w-60 transform overflow-hidden max-[968px]:bg-white lg:bg-white transition-transform ease-in-out duration-700 
                    ${open ? 'translate-x-0' : '-translate-x-full'} 
                    min-[968px]:translate-x-0 min-[968px]:static min-[968px]:z-0`}
      >
        {/*==================== Decorative Elements  ====================*/}
        <div className="absolute inset-0 pointer-events-none">
          {/*==================== Top Right - Tech Circuit Pattern ====================*/}
          <div className="absolute top-5 right-8">
            <div className="w-8 h-8 rounded-full bg-blue-500/15"></div>
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-amber-500/15"></div>
            <div className="absolute top-6 right-11 w-4 h-4 rounded-full bg-blue-500/10"></div>
          </div>
          {/*==================== End of Top Right - Tech Circuit Pattern ====================*/}
        </div>
        {/*==================== End of Decorative Elements ====================*/}

        {/*==================== Sidebar Content Container ====================*/}
        <div className="relative h-full z-10 flex flex-col">
          {/*==================== Mobile close button ====================*/}
          <div className="justify-between items-center p-4 max-[967px]:flex hidden">
            <Link href="/" className="flex items-center">
              <Image
                width={150}
                height={150}
                alt="ITCA Logo"
                className="mr-2"
                src="/images/logo.jpg"
              />
            </Link>
            <button
              title="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:bg-amber-50 hover:text-amber-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/*==================== End of Mobile close button ====================*/}

          {/*==================== Desktop logo ====================*/}
          <div className="hidden min-[968px]:flex items-center p-4 border-b border-gray-100">
            <Link
              href={router.pathname.startsWith('/admin') ? '/admin' : '/student'}
              className="flex items-center"
            >
              <Image
                width={150}
                height={150}
                alt="ITCA Logo"
                className="mr-2"
                src="/images/logo.jpg"
              />
            </Link>
          </div>
          {/*==================== End of Desktop logo ====================*/}

          {/*==================== Navigation Items ====================*/}
          <div className="px-2 py-4 flex-1 overflow-y-auto">
            <div className="space-y-3">
              {getNavItems().map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-md font-medium  ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-amber-50 to-blue-50 text-blue-700 border-l-2 border-l-amber-500 rounded-r-lg'
                      : 'text-gray-700 hover:bg-amber-50/50 hover:text-blue-700'
                  }`}
                >
                  <span
                    className={`mr-3 ${isActive(item.href) ? 'text-amber-500' : 'text-gray-500'}`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {isActive(item.href) && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-amber-500"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>
          {/*==================== End of Navigation Items ====================*/}

          {/*==================== Logout Button ====================*/}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500" />
              <span>Logout</span>
            </button>
          </div>
          {/*==================== End of Logout Button ====================*/}
        </div>
        {/*==================== End of Sidebar Content Container ====================*/}
      </div>
      {/*==================== End of Sidebar ====================*/}
    </>
  );
};

export default Sidebar;
