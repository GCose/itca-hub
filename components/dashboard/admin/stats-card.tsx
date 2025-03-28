import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  isLoading?: boolean;
  valueClassName?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendDirection = "neutral",
  isLoading = false,
  valueClassName = "text-gray-900",
}: StatsCardProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>

          {isLoading ? (
            <div className="mt-2 h-8 w-20 animate-pulse rounded bg-gray-200"></div>
          ) : (
            <p className={`mt-2 text-2xl font-bold ${valueClassName}`}>
              {value}
            </p>
          )}

          {trend && !isLoading && (
            <p
              className={`mt-1 flex items-center text-xs font-medium ${
                trendDirection === "up"
                  ? "text-green-600"
                  : trendDirection === "down"
                    ? "text-red-600"
                    : "text-gray-500"
              }`}
            >
              {trendDirection === "up" && (
                <svg
                  className="mr-1 h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              )}
              {trendDirection === "down" && (
                <svg
                  className="mr-1 h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
              {trend}
            </p>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
