import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { authStore } from "@/lib/auth-store";

// Layout route for everything under /admin. Guards all admin pages in one place —
// unauthenticated users are redirected to the login page (which is exempt).
export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (location.pathname !== "/admin/login" && !authStore.isAuthed()) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: () => <Outlet />,
});
