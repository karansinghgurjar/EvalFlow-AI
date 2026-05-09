export function getDashboardPath(role) {
  if (role === "ADMIN") {
    return "/dashboard/admin";
  }

  if (role === "ANNOTATOR") {
    return "/dashboard/annotator";
  }

  if (role === "REVIEWER") {
    return "/dashboard/reviewer";
  }

  return "/login";
}
