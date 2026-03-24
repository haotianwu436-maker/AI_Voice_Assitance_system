export type AppRole = "admin" | "sales";

export const ROLE_HOME: Record<AppRole, string> = {
  admin: "/admin",
  sales: "/sales"
};
