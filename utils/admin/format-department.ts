const formatDepartment = (departmentId: string | undefined): string => {
  if (!departmentId) return 'Uncategorized';

  // Map of department IDs to formatted names
  const departmentMap: Record<string, string> = {
    computer_science: 'Computer Science',
    information_systems: 'Information Systems',
    telecommunications: 'Telecommunications',
  };

  // Return the mapped value or a formatted version if not found in the map
  return (
    departmentMap[departmentId] ||
    departmentId
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
};

export default formatDepartment;
