import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Menu, Search, User, MessageSquare, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu') && !target.closest('.profile-trigger')) {
        setIsProfileOpen(false);
      }
      if (!target.closest('.notification-menu') && !target.closest('.notification-trigger')) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-3 mx-4 min-[968px]:mx-8 z-20 flex h-16 items-center justify-between bg-white rounded-3xl px-4 transition-shadow duration-200 min-[968px]:px-6">
      {/*==================== Mobile menu button and search ====================*/}
      <div className="flex items-center space-x-4">
        <button
          title="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none max-[967px]:block hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden min-[968px]:block">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 focus:bg-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
      {/*==================== End of Mobile menu button and search ====================*/}

      {/*==================== Right: Notifications and user menu ====================*/}
      <div className="flex items-center space-x-4">
        {/*==================== Notifications ====================*/}
        <div className="relative">
          <button
            className="notification-trigger rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <Bell className="h-6 w-6" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              3
            </span>
          </button>

          {/*==================== Notification Dropdown ====================*/}
          {isNotificationOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="notification-menu absolute right-0 top-full mt-2 w-72 rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
            >
              <div className="px-4 py-2">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <a
                    key={i}
                    href="#"
                    className="block border-l-4 border-transparent px-4 py-2 hover:bg-gray-50"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          New course material available
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Web Development: Lecture notes uploaded
                        </p>
                        <p className="mt-1 text-xs text-gray-400">10 min ago</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="border-t border-gray-100 px-4 py-2">
                <a
                  href="#"
                  className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View all notifications
                </a>
              </div>
            </motion.div>
          )}
          {/*==================== End of Notification Dropdown ====================*/}
        </div>
        {/*==================== End of Notifications ====================*/}

        {/*==================== User Menu ====================*/}
        <div className="relative">
          <button
            className="profile-trigger flex items-center space-x-2 rounded-full focus:outline-none"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-700">
              <User className="h-5 w-5" />
            </div>
            <span className="hidden text-sm font-medium text-gray-700 min-[968px]:block">
              John Doe
            </span>
          </button>

          {/*==================== User Dropdown ====================*/}
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="profile-menu absolute right-0 top-full mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
            >
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john.doe@utg.edu.gm</p>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="mr-3 h-4 w-4 text-gray-500" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="mr-3 h-4 w-4 text-gray-500" />
                  Settings
                </Link>
              </div>
              <div className="border-t border-gray-100 py-1">
                <Link
                  href="/auth"
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="mr-3 h-4 w-4 text-red-500" />
                  Sign out
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
