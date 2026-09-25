import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, BookOpen, UserCheck, BarChart3, Users2, CheckSquare, CalendarDays,
  Users, Layers, Clock, UserSquare2, ClipboardList, ShieldCheck, History, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FacultyProvider, useFaculty } from "./store";
import type { FacultyRole } from "./data";

type NavItem = { page: string; label: string; icon: React.ComponentType<{ className?: string }> };

export const ROLE_NAV: Record<FacultyRole, NavItem[]> = {
  Dean: [
    { page: "", label: "Overview", icon: LayoutDashboard },
    { page: "curriculum", label: "Curriculum Oversight", icon: BookOpen },
    { page: "recruitment", label: "Faculty Recruitment", icon: UserCheck },
    { page: "exam-approvals", label: "Examination Approvals", icon: CheckSquare },
    { page: "results", label: "Result Analysis", icon: BarChart3 },
    { page: "hods", label: "HOD Management", icon: Users2 },
  ],
  HOD: [
    { page: "", label: "Overview", icon: LayoutDashboard },
    { page: "faculty", label: "Faculty", icon: Users },
    { page: "allocation", label: "Subject Allocation", icon: Layers },
    { page: "timetable", label: "Timetable", icon: Clock },
    { page: "mentoring", label: "Mentoring", icon: UserSquare2 },
    { page: "hiring", label: "Hiring Requests", icon: UserCheck },
    { page: "leave-approvals", label: "Leave Approvals", icon: CalendarDays },
  ],
  "Teaching Staff": [
    { page: "", label: "Overview", icon: LayoutDashboard },
    { page: "my-timetable", label: "My Timetable", icon: Clock },
    { page: "my-class", label: "My Class", icon: Users },
    { page: "tasks", label: "Assigned Tasks", icon: ClipboardList },
    { page: "apply-leave", label: "Apply for Leave", icon: CalendarDays },
    { page: "complaint", label: "Register Complaint", icon: ShieldCheck },
  ],
};

const ROLES: FacultyRole[] = ["Dean", "HOD", "Teaching Staff"];

function Shell() {
  const { role, setRole, history, reset } = useFaculty();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [...ROLE_NAV[role], { page: "history", label: "Action History", icon: History }];
  const pending = history.filter((h) => !h.reverted).length;

  return (
    <div className="-m-4 md:-m-6 flex min-h-[calc(100vh-4rem)] bg-muted/30">
      <aside className="hidden md:flex w-[232px] flex-col bg-card border-r border-border">
        <div className="px-5 py-5 border-b border-border">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Faculty Portal</div>
          <div className="text-lg font-semibold mt-0.5">{role}</div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {items.map((item) => {
            const to = item.page ? `/faculty/${item.page}` : "/faculty";
            const active = item.page ? pathname === to : pathname === "/faculty" || pathname === "/faculty/";
            const Icon = item.icon;
            return (
              <Link
                key={item.page || "overview"}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-foreground/75 hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="size-[18px] shrink-0" />
                <span className="truncate flex-1">{item.label}</span>
                {item.page === "history" && pending > 0 && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">{pending}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 bg-card border-b border-border px-5 flex items-center gap-3">
          <div className="text-sm text-muted-foreground hidden sm:block">Academic Year 2026–27</div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground hidden sm:inline">View as</span>
            <div className="flex rounded-lg border border-border bg-background p-0.5">
              {ROLES.map((r) => (
                <Link
                  key={r}
                  to="/faculty"
                  onClick={() => setRole(r)}
                  className={cn(
                    "px-3 h-7 grid place-items-center rounded-md text-xs font-medium transition",
                    role === r ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r}
                </Link>
              ))}
            </div>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={reset}>
              <RotateCcw className="size-4" /> <span className="hidden lg:inline">Reset</span>
            </Button>
          </div>
        </header>
        <div className="md:hidden flex gap-1 overflow-x-auto px-3 py-2 bg-card border-b border-border">
          {items.map((item) => (
            <Link key={item.page || "o"} to={item.page ? `/faculty/${item.page}` : "/faculty"} className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium bg-muted">
              {item.label}
            </Link>
          ))}
        </div>
        <main className="flex-1 p-5 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function FacultyLayout() {
  return (
    <FacultyProvider>
      <Shell />
    </FacultyProvider>
  );
}
