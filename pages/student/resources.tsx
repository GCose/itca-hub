import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ResourceManager from "@/components/dashboard/student/resource/resource-manager";

const StudentResourcesPage = () => {
  return (
    <DashboardLayout title="Learning Resources">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Learning Resources
        </h1>
        <p className="text-gray-600">
          Access course materials, documents, and learning resources
        </p>
      </div>

      <ResourceManager />
    </DashboardLayout>
  );
};

export default StudentResourcesPage;
