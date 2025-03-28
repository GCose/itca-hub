import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  isLoading?: boolean;
  valueClassName?: string;
  subtitle?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  isLoading = false,
  valueClassName = "text-gray-900",
  subtitle,
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

          {subtitle && !isLoading && (
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
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
