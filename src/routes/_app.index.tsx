import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  GraduationCap,
  Wallet,
  TrendingUp,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, Section, StatCard } from "@/components/ui/page";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

const revenue = [
  { m: "Jan", v: 42 }, { m: "Feb", v: 51 }, { m: "Mar", v: 48 },
  { m: "Apr", v: 62 }, { m: "May", v: 70 }, { m: "Jun", v: 81 },
  { m: "Jul", v: 78 }, { m: "Aug", v: 92 }, { m: "Sep", v: 99 },
];

const attendance = [
  { d: "Mon", p: 94 }, { d: "Tue", p: 91 }, { d: "Wed", p: 96 },
  { d: "Thu", p: 89 }, { d: "Fri", p: 93 }, { d: "Sat", p: 78 },
];

const funnel = [
  { name: "Inquiry", value: 1240, color: "var(--color-chart-1)" },
  { name: "Visit", value: 820, color: "var(--color-chart-2)" },
  { name: "Application", value: 520, color: "var(--color-chart-3)" },
  { name: "Enrolled", value: 312, color: "var(--color-chart-4)" },
];

const activity = [
  { who: "Priya Sharma", action: "submitted admission form", time: "2m ago", tag: "Lead" },
  { who: "Mr. Iyer", action: "paid Term-2 fee ₹42,000", time: "18m ago", tag: "Payment" },
  { who: "Class 9-B", action: "marked attendance (28/30)", time: "1h ago", tag: "Attendance" },
  { who: "Counselor Neha", action: "scheduled follow-up with Rohan", time: "3h ago", tag: "CRM" },
  { who: "Exam Cell", action: "published Mid-Term results", time: "Yesterday", tag: "Exam" },
];

const tasks = [
  { t: "Approve 12 admission applications", due: "Today", done: false },
  { t: "Sign payroll for September", due: "Today", done: false },
  { t: "Review fee defaulters list", due: "Tomorrow", done: false },
  { t: "Send PTM invitations — Grade 8", due: "Sep 28", done: true },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Aarav 👋"
        subtitle="Here's what's happening across Greenwood today."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <CalendarDays className="size-4" /> This month
            </Button>
            <Button size="sm">Export report</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active students" value="2,847" delta="3.2%" icon={GraduationCap} />
        <StatCard label="Open leads" value="312" delta="12.4%" icon={Users} accent="warning" />
        <StatCard label="Revenue (MTD)" value="₹48.2L" delta="8.1%" icon={Wallet} accent="success" />
        <StatCard label="Attendance avg" value="92.6%" delta="0.8%" icon={TrendingUp} trend="down" accent="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section
          title="Revenue overview"
          className="lg:col-span-2"
          action={<button className="text-xs text-primary font-medium hover:underline">View report</button>}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="v" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Admission funnel">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={funnel} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {funnel.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {funnel.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Weekly attendance" className="lg:col-span-2">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendance}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="p" radius={[6, 6, 0, 0]} fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section
          title="Tasks & reminders"
          action={<button className="text-xs text-primary font-medium hover:underline">All</button>}
        >
          <ul className="space-y-2.5">
            {tasks.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <CheckCircle2
                  className={`size-4 mt-0.5 ${t.done ? "text-success" : "text-muted-foreground"}`}
                />
                <div className="flex-1 min-w-0">
                  <div className={t.done ? "line-through text-muted-foreground" : ""}>{t.t}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{t.due}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Recent activity" className="lg:col-span-2">
          <ul className="divide-y divide-border -my-3">
            {activity.map((a, i) => (
              <li key={i} className="py-3 flex items-center gap-3">
                <div className="size-9 rounded-full bg-secondary grid place-items-center text-xs font-semibold text-secondary-foreground shrink-0">
                  {a.who.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-medium">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{a.time}</div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                  {a.tag}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="AI insight"
          action={<span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">BETA</span>}
        >
          <div className="rounded-lg gradient-soft p-4 border border-border/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <AlertCircle className="size-4" /> Risk alert
            </div>
            <p className="text-sm mt-2 leading-relaxed">
              <span className="font-semibold">28 students</span> across Grade 9 are predicted to drop below 75% attendance this term.
              Recommended: schedule parent calls and assign mentors.
            </p>
            <Button size="sm" variant="outline" className="mt-3 gap-1.5">
              View students <ArrowRight className="size-3.5" />
            </Button>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <p className="text-muted-foreground">
              <span className="text-foreground font-medium">Conversion ↑ 6%:</span> WhatsApp follow-ups outperformed email by 2.3× this week.
            </p>
            <p className="text-muted-foreground">
              <span className="text-foreground font-medium">Fee collection:</span> 92% likely to hit ₹52L target by Sep 30.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
