import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, GraduationCap, ListTodo, FileBarChart2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV: { to: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean }[] = [
  { to: "/academic", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/academic/students", label: "Students", icon: GraduationCap },
  { to: "/academic/task", label: "Task", icon: ListTodo },
  { to: "/academic/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/academic/audit", label: "Audit Logs", icon: ShieldCheck },
];

export function AcademicLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="-m-4 md:-m-6 flex min-h-[calc(100vh-4rem)] bg-muted/30">
      <aside className="hidden md:flex w-[232px] flex-col text-white shadow-xl" style={{ background: "linear-gradient(180deg, #0b1e4d 0%, #112a6b 60%, #15348a 100%)" }}>
        <div className="px-5 py-5 border-b border-white/10">
          <div className="text-[11px] uppercase tracking-widest text-white/60">Module</div>
          <div className="text-lg font-semibold mt-0.5">Academics</div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="size-[18px] shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-white/10 text-[11px] leading-relaxed text-white/55">
          Smart Office Initiative<br />SOP-AMD-2025-01 · v1.0
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 bg-card border-b border-border px-5 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{today}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Academic term</span>
            <select
              defaultValue="Spring 2025"
              className="h-8 rounded-md border border-border bg-background px-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option>Spring 2025</option>
              <option>Fall 2024</option>
              <option>Spring 2024</option>
            </select>
          </div>
        </header>
        <main className="flex-1 p-5 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
