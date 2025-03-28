import { useState, ReactNode } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import Sidebar from "./dashboard-sidebar";
import Header from "./dashboard-header";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const DashboardLayout = ({
  children,
  title = "Dashboard",
}: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{`ITCA Hub | ${title}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/logo.jpg" />
      </Head>

      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/*==================== Sidebar ====================*/}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/*==================== Main Content ====================*/}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
        {/*==================== End of Main Content ====================*/}
      </div>
    </>
  );
};

export default DashboardLayout;
