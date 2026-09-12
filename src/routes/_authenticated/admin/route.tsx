import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  Clapperboard,
  Image as ImageIcon,
  Quote,
  Layers,
  FileText,
  Inbox,
  Search,
  Settings,
  History,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const nav: { to: "/admin"; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin" as const, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", icon: FolderOpen },
  { to: "/admin/reels", label: "Social Media / Reels", icon: Clapperboard },
  { to: "/admin/media", label: "Images & Media", icon: ImageIcon },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/services", label: "Services", icon: Layers },
  { to: "/admin/content", label: "Website Content", icon: FileText },
  { to: "/admin/leads", label: "Contact Leads", icon: Inbox },
  { to: "/admin/seo", label: "SEO", icon: Search },
  { to: "/admin/activity", label: "Activity Log", icon: History },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const { data: session } = useQuery({
    queryKey: ["admin-session"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id);
      return {
        email: userData.user.email ?? "",
        roles: (roles ?? []).map((r) => r.role),
      };
    },
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (session === null) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-xl font-semibold">Sign in required</h1>
        <Button className="mt-6" onClick={() => navigate({ to: "/auth" })}>
          Go to sign in
        </Button>
      </div>
    );
  }

  if (session && session.roles.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-xl font-semibold">No access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account isn't authorised to manage the AdMosaic website.
        </p>
        <Button className="mt-6" variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="border-b border-border md:min-h-screen md:w-64 md:shrink-0 md:border-r md:border-b-0">
        <div className="px-6 py-6">
          <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            AdMosaic
          </p>
          <p className="mt-1 text-sm font-medium">Website manager</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-col md:overflow-visible">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors",
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border px-6 py-4 md:mt-auto">
          <p className="truncate text-xs text-muted-foreground">{session?.email}</p>
          <div className="mt-3 flex gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground underline underline-offset-4"
            >
              View site ↗
            </a>
            <button
              type="button"
              onClick={signOut}
              className="text-xs text-muted-foreground underline underline-offset-4"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
