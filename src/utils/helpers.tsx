export function capitalize(input: string): string | null {
  if (!input.length) return null;
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export const formatFeeType = (feeType: string) => {
  switch (feeType) {
    case "MANDATORY":
      return "MANDATORY";
    case "VOLUNTARY":
      return "VOLUNTARY";
    case "VEHICLE_PARKING":
      return "VEHICLE_PARKING";
    case "FLOOR_AREA":
      return "FLOOR_AREA";
    default:
      // Convert UPPERCASE_WITH_UNDERSCORE to Title Case
      return feeType
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
  }
};
