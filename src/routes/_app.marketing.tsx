import { createFileRoute } from "@tanstack/react-router";
import {
  Megaphone, Mail, MousePointerClick, Target, Plus, Send, Instagram,
  Facebook, Search, Globe, TrendingUp,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { PageHeader, Section, StatCard } from "@/components/ui/page";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/marketing")({
  component: Marketing,
});

const TRAFFIC = [
  { d: "W1", visits: 2400, leads: 124 },
  { d: "W2", visits: 3100, leads: 168 },
  { d: "W3", visits: 2800, leads: 142 },
  { d: "W4", visits: 4200, leads: 218 },
  { d: "W5", visits: 5100, leads: 264 },
  { d: "W6", visits: 4800, leads: 248 },
];

const CAMPAIGNS = [
  { name: "Summer Admissions 2026", channel: "Google Ads", spend: "₹2.4L", leads: 348, cpl: "₹689", status: "Active" as const },
  { name: "Open House — Grade 6", channel: "Instagram", spend: "₹86K", leads: 142, cpl: "₹605", status: "Active" as const },
  { name: "Scholarship Drive", channel: "Email", spend: "₹12K", leads: 86, cpl: "₹140", status: "Scheduled" as const },
  { name: "Brand Awareness", channel: "Facebook", spend: "₹1.1L", leads: 92, cpl: "₹1,196", status: "Paused" as const },
];

const CHANNELS = [
  { icon: Search, name: "Organic Search", value: "42%", color: "text-chart-1 bg-chart-1/10" },
  { icon: Instagram, name: "Instagram", value: "24%", color: "text-chart-5 bg-chart-5/10" },
  { icon: Globe, name: "Direct", value: "18%", color: "text-chart-2 bg-chart-2/10" },
  { icon: Facebook, name: "Facebook", value: "11%", color: "text-chart-1 bg-chart-1/10" },
  { icon: Mail, name: "Email", value: "5%", color: "text-chart-4 bg-chart-4/10" },
];

const stColor = (s: string) =>
  s === "Active" ? "bg-success/10 text-success"
  : s === "Scheduled" ? "bg-primary/10 text-primary"
  : "bg-muted text-muted-foreground";

function Marketing() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing"
        subtitle="Campaigns, lead funnels and channel performance"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Send className="size-4" /> Email blast</Button>
            <Button size="sm" className="gap-1.5"><Plus className="size-4" /> New campaign</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Reach (30d)" value="248K" delta="22%" icon={Megaphone} accent="primary" />
        <StatCard label="Leads generated" value="1,148" delta="14%" icon={Target} accent="success" />
        <StatCard label="Click-through rate" value="3.84%" delta="0.4%" icon={MousePointerClick} accent="warning" />
        <StatCard label="Cost per lead" value="₹612" delta="9%" icon={TrendingUp} trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Traffic & lead conversion" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TRAFFIC}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="visits" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="leads" stroke="var(--color-success)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Top channels">
          <ul className="space-y-3">
            {CHANNELS.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.name} className="flex items-center gap-3">
                  <div className={`size-9 rounded-lg grid place-items-center ${c.color}`}>
                    <Icon className="size-[18px]" />
                  </div>
                  <div className="flex-1 text-sm font-medium">{c.name}</div>
                  <div className="text-sm font-semibold tabular-nums">{c.value}</div>
                </li>
              );
            })}
          </ul>
        </Section>
      </div>

      <Section title="Active campaigns" action={<button className="text-xs text-primary font-medium hover:underline">View all</button>}>
        <div className="overflow-x-auto -m-5">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Campaign</th>
                <th className="px-3 py-3 text-left font-medium">Channel</th>
                <th className="px-3 py-3 text-right font-medium">Spend</th>
                <th className="px-3 py-3 text-right font-medium">Leads</th>
                <th className="px-3 py-3 text-right font-medium">CPL</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map((c) => (
                <tr key={c.name} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-5 py-3 font-medium">{c.name}</td>
                  <td className="px-3 py-3 text-muted-foreground">{c.channel}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{c.spend}</td>
                  <td className="px-3 py-3 text-right tabular-nums font-semibold">{c.leads}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{c.cpl}</td>
                  <td className="px-5 py-3"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${stColor(c.status)}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
