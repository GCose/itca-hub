import { useState, useEffect, JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  User,
  BookOpen,
  BarChart2,
  X,
} from "lucide-react";

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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if current route is in admin section
    setIsAdmin(router.pathname.startsWith("/admin"));
  }, [router.pathname]);

  // Define navigation items based on role
  const adminNavItems: NavItem[] = [
    { name: "Dashboard", href: "/admin", icon: <Home className="h-5 w-5" /> },
    {
      name: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Events",
      href: "/admin/events",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Resources",
      href: "/admin/resources",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const studentNavItems: NavItem[] = [
    { name: "Dashboard", href: "/student", icon: <Home className="h-5 w-5" /> },
    {
      name: "Profile",
      href: "/student/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Courses",
      href: "/student/courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Events",
      href: "/student/events",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Resources",
      href: "/student/resources",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Help",
      href: "/student/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/auth");
  };

  // Check if a nav item is active
  const isActive = (href: string) => {
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
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          />
        )}
      </AnimatePresence>
      {/*==================== End of Mobile sidebar backdrop ====================*/}

      {/*==================== Sidebar ====================*/}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-white shadow-lg transition-transform ease-in-out duration-300 
                    ${open ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0 md:static md:z-0`}
      >
        {/*==================== Mobile close button ====================*/}
        <div className="flex justify-between items-center p-4 md:hidden">
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
            onClick={() => setOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/*==================== End of Mobile close button ====================*/}

        {/*==================== Desktop logo ====================*/}
        <div className="hidden md:flex items-center p-4">
          <Link href="/admin" className="flex items-center">
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

        <div className="px-2 py-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/*==================== Bottom section with logout ====================*/}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-500" />
            <span>Logout</span>
          </button>
        </div>
        {/*==================== End of Bottom section with logout ====================*/}
      </div>
      {/*==================== End of Sidebar ====================*/}
    </>
  );
};

export default Sidebar;
