export function capitalize(input: string): string | null {
  if (!input.length) return null;
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export const formatFeeType = (feeType: string) => {
  switch (feeType) {
    case "Mandatory":
      return "Mandatory";
    case "Voluntary":
      return "Voluntary";
    default:
      return feeType; 
  }
};
