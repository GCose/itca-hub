import { BookOpen } from "lucide-react";
import CourseCard from "./course-card";

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  totalResources: number;
  totalStudents: number;
}

interface CourseListProps {
  courses: Course[];
  isLoading?: boolean;
}

const CourseList = ({ courses, isLoading = false }: CourseListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            <div className="h-3 bg-gray-200 animate-pulse"></div>
            <div className="p-5">
              <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-3"></div>
              <div className="h-4 w-1/2 bg-gray-200 animate-pulse mb-4"></div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between">
                  <div className="h-3 w-1/4 bg-gray-200 animate-pulse"></div>
                  <div className="h-3 w-1/5 bg-gray-200 animate-pulse"></div>
                </div>
                <div className="h-2 w-full bg-gray-200 animate-pulse rounded-full"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-1/3 bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-1/3 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
              <div className="h-4 w-1/4 bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="flex justify-center mb-3">
          <BookOpen className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No courses available
        </h3>
        <p className="text-gray-500 mb-4">
          You{"'"}re not enrolled in any courses right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
