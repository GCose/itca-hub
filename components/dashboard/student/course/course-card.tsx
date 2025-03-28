import { FileText, Users } from "lucide-react";
import Link from "next/link";

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  totalResources: number;
  totalStudents: number;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <div className="h-full rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="h-3 bg-blue-600"></div>
      <div className="p-5">
        <h3 className="font-medium text-lg text-gray-900 mb-1 line-clamp-1">
          <Link
            href={`/student/courses/${course.id}`}
            className="hover:text-blue-700 transition-colors"
          >
            {course.title}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Instructor: {course.instructor}
        </p>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <div className="flex justify-center w-4 mr-1">
              <FileText className="h-4 w-4" />
            </div>
            <span>{course.totalResources} Resources</span>
          </div>
          <div className="flex items-center text-gray-500">
            <div className="flex justify-center w-4 mr-1">
              <Users className="h-4 w-4" />
            </div>
            <span>{course.totalStudents} Students</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 text-sm border-t border-gray-100">
        <Link
          href={`/student/courses/${course.id}`}
          className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          Go to course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
