function getBrowserName(): string {
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Chrome")) {
    return "Google Chrome";
  } else if (userAgent.includes("Firefox")) {
    return "Mozilla Firefox";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    return "Apple Safari";
  } else if (userAgent.includes("Edge")) {
    return "Microsoft Edge";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    return "Opera";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) {
    return "Internet Explorer";
  } else {
    return "Unknown Browser";
  }
}

export default getBrowserName;
