export const isWidthDown = (breakpoint, screenWidth) => {
  switch (breakpoint) {
    case "xs":
      return screenWidth < 600;
    case "sm":
      return screenWidth < 900;
    case "md":
      return screenWidth < 1200;
    case "lg":
      return screenWidth < 1536;
    case "xl":
      return screenWidth >= 1920;
    default:
      throw new Error("Invalid breakpoint");
  }
};
