import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import CourseList from "@/components/dashboard/student/course/course-list";

// Course interface
interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  totalResources: number;
  totalStudents: number;
}

const StudentCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockCourses = [
          {
            id: 1,
            title: "Introduction to Web Development",
            instructor: "Dr. Sarah Johnson",
            progress: 75,
            totalResources: 12,
            totalStudents: 45,
          },
          {
            id: 2,
            title: "Data Structures and Algorithms",
            instructor: "Prof. Michael Chen",
            progress: 60,
            totalResources: 18,
            totalStudents: 32,
          },
          {
            id: 3,
            title: "Mobile App Development with React Native",
            instructor: "Dr. David Wilson",
            progress: 40,
            totalResources: 15,
            totalStudents: 28,
          },
          {
            id: 4,
            title: "Database Systems",
            instructor: "Prof. Lisa Adams",
            progress: 90,
            totalResources: 10,
            totalStudents: 38,
          },
          {
            id: 5,
            title: "Python Programming",
            instructor: "Dr. Robert Brown",
            progress: 25,
            totalResources: 14,
            totalStudents: 50,
          },
          {
            id: 6,
            title: "Machine Learning Fundamentals",
            instructor: "Dr. Emily Clark",
            progress: 15,
            totalResources: 20,
            totalStudents: 35,
          },
        ];

        setCourses(mockCourses);
        setFilteredCourses(mockCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter and sort courses when search term or sort criteria changes
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "instructor") {
        return a.instructor.localeCompare(b.instructor);
      }
      if (sortBy === "progress") {
        return b.progress - a.progress;
      }
      return 0;
    });

    setFilteredCourses(sorted);
  }, [searchTerm, sortBy, courses]);

  return (
    <DashboardLayout title="My Courses">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">
          Access your enrolled courses and learning materials
        </p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center w-full md:w-auto">
          <label htmlFor="sortBy" className="text-sm text-gray-600 mr-2">
            Sort by:
          </label>
          <select
            id="sortBy"
            className="w-full md:w-auto rounded-lg border border-gray-200 py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="instructor">Instructor</option>
            <option value="progress">Progress</option>
          </select>
        </div>
      </div>

      <CourseList courses={filteredCourses} isLoading={isLoading} />
    </DashboardLayout>
  );
};

export default StudentCoursesPage;
