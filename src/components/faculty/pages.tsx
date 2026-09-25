import { useState } from "react";
import { Check, X, RotateCcw, Undo2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFaculty } from "./store";
import {
  CURRENT_HOD, CURRENT_TEACHER, DAYS, DEAN, DEPTS, FACULTY, SLOTS, dept, fac,
  type Status,
} from "./data";

/* ---------- shared UI ---------- */
function Header({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-border bg-card shadow-soft", className)}>{children}</div>;
}
function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
    </Card>
  );
}
function StatusBadge({ s }: { s: string }) {
  const cls =
    s === "Approved" || s === "Resolved" || s === "Done"
      ? "bg-primary/10 text-primary"
      : s === "Rejected"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";
  return <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-md", cls)}>{s}</span>;
}
function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs text-muted-foreground">
          <tr>{head.map((h) => <th key={h} className="text-left font-medium px-4 py-2.5">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </Card>
  );
}
const Td = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>
);
function Decide({ status, onDecide }: { status: Status; onDecide: (s: Status) => void }) {
  if (status !== "Pending") return <StatusBadge s={status} />;
  return (
    <div className="flex gap-1.5">
      <Button size="sm" className="h-7 gap-1" onClick={() => onDecide("Approved")}><Check className="size-3.5" />Approve</Button>
      <Button size="sm" variant="outline" className="h-7 gap-1" onClick={() => onDecide("Rejected")}><X className="size-3.5" />Reject</Button>
    </div>
  );
}
const today = () => new Date().toISOString().slice(0, 10);
const uid = (p: string) => `${p}${Date.now().toString(36)}`;

/* ---------- DEAN ---------- */
function DeanOverview() {
  const { data } = useFaculty();
  const pend = [...data.curriculum, ...data.hiring, ...data.exams].filter((x) => x.status === "Pending").length;
  return (
    <>
      <Header title={`Welcome, ${DEAN.name}`} sub="Dean of Academics · college-wide overview" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Stat label="Departments" value={DEPTS.length} />
        <Stat label="Faculty" value={FACULTY.length} />
        <Stat label="Students" value={DEPTS.reduce((a, d) => a + d.students, 0)} />
        <Stat label="Pending approvals" value={pend} hint="Curriculum, hiring & exams" />
      </div>
      <ResultsTable />
    </>
  );
}
function ResultsTable() {
  return (
    <Table head={["Department", "HOD", "Students", "Pass %", "Avg CGPA"]}>
      {DEPTS.map((d) => (
        <tr key={d.id}>
          <Td><div className="font-medium">{d.code}</div><div className="text-xs text-muted-foreground">{d.name}</div></Td>
          <Td>{fac(d.hodId)?.name}</Td>
          <Td>{d.students}</Td>
          <Td>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary" style={{ width: `${d.passPct}%` }} /></div>
              {d.passPct}%
            </div>
          </Td>
          <Td>{d.avgCgpa}</Td>
        </tr>
      ))}
    </Table>
  );
}
function DeanCurriculum() {
  const { data, act } = useFaculty();
  return (
    <>
      <Header title="Curriculum Oversight" sub="Review syllabus changes proposed by HODs" />
      <Table head={["Proposal", "Department", "Semester", "Submitted by", "Decision"]}>
        {data.curriculum.map((c) => (
          <tr key={c.id}>
            <Td className="font-medium">{c.title}</Td>
            <Td>{dept(c.deptId)?.code}</Td>
            <Td>{c.semester}</Td>
            <Td>{fac(c.submittedBy)?.name}</Td>
            <Td><Decide status={c.status} onDecide={(s) => act(`${s} curriculum: ${c.title}`, [{ col: "curriculum", id: c.id, value: { ...c, status: s } }])} /></Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
function DeanRecruitment() {
  const { data, act } = useFaculty();
  return (
    <>
      <Header title="Faculty Recruitment" sub="Hiring requests raised by departments" />
      <Table head={["Position", "Department", "Subject", "Posts", "Reason", "Decision"]}>
        {data.hiring.map((h) => (
          <tr key={h.id}>
            <Td className="font-medium">{h.position}</Td>
            <Td>{dept(h.deptId)?.code}</Td>
            <Td>{h.subject}</Td>
            <Td>{h.count}</Td>
            <Td className="text-muted-foreground">{h.reason}</Td>
            <Td><Decide status={h.status} onDecide={(s) => act(`${s} hiring: ${h.position} (${h.subject})`, [{ col: "hiring", id: h.id, value: { ...h, status: s } }])} /></Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
function DeanExams() {
  const { data, act } = useFaculty();
  return (
    <>
      <Header title="Examination Approvals" sub="Approve question papers before printing" />
      <Table head={["Subject", "Department", "Exam date", "Set by", "Decision"]}>
        {data.exams.map((e) => (
          <tr key={e.id}>
            <Td className="font-medium">{e.subject}</Td>
            <Td>{dept(e.deptId)?.code}</Td>
            <Td>{e.date}</Td>
            <Td>{fac(e.setBy)?.name}</Td>
            <Td><Decide status={e.status} onDecide={(s) => act(`${s} exam paper: ${e.subject}`, [{ col: "exams", id: e.id, value: { ...e, status: s } }])} /></Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
function DeanResults() {
  return (<><Header title="Result Analysis" sub="Semester results by department" /><ResultsTable /></>);
}
function DeanHods() {
  return (
    <>
      <Header title="HOD Management" sub="Heads of department and their teams" />
      <div className="grid sm:grid-cols-2 gap-3">
        {DEPTS.map((d) => {
          const h = fac(d.hodId)!;
          const team = FACULTY.filter((f) => f.deptId === d.id);
          return (
            <Card key={d.id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold">{h.name[0]}</div>
                <div><div className="font-medium">{h.name}</div><div className="text-xs text-muted-foreground">HOD · {d.name}</div></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                <div className="rounded-lg bg-muted/60 p-2"><div className="text-base font-semibold">{team.length}</div>Faculty</div>
                <div className="rounded-lg bg-muted/60 p-2"><div className="text-base font-semibold">{d.students}</div>Students</div>
                <div className="rounded-lg bg-muted/60 p-2"><div className="text-base font-semibold">{h.feedback}</div>Feedback</div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

/* ---------- HOD ---------- */
const hodDept = () => fac(CURRENT_HOD)!.deptId;
const deptFaculty = () => FACULTY.filter((f) => f.deptId === hodDept());

function HodOverview() {
  const { data } = useFaculty();
  const d = dept(hodDept())!;
  const team = deptFaculty();
  return (
    <>
      <Header title={`Welcome, ${fac(CURRENT_HOD)!.name}`} sub={`Head of Department · ${d.name}`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Stat label="Faculty" value={team.length} />
        <Stat label="Students" value={d.students} />
        <Stat label="Subjects allocated" value={data.allocations.filter((a) => a.deptId === d.id).length} />
        <Stat label="Leave requests" value={data.leaves.filter((l) => l.status === "Pending").length} hint="Awaiting your decision" />
      </div>
      <FacultyTable />
    </>
  );
}
function FacultyTable() {
  const { data } = useFaculty();
  return (
    <Table head={["Name", "Designation", "Allocated subjects", "Weekly hrs", "Feedback", "Attendance"]}>
      {deptFaculty().map((f) => {
        const subs = data.allocations.filter((a) => a.facultyId === f.id).length;
        return (
          <tr key={f.id}>
            <Td className="font-medium">{f.name}</Td>
            <Td>{f.designation}</Td>
            <Td>{subs}</Td>
            <Td><span className={cn(f.weeklyHours > 18 && "text-destructive font-medium")}>{f.weeklyHours}</span></Td>
            <Td>{f.feedback} / 5</Td>
            <Td>{f.attendance}%</Td>
          </tr>
        );
      })}
    </Table>
  );
}
function HodFaculty() {
  return (<><Header title="Faculty" sub="Department faculty, workload and performance" /><FacultyTable /></>);
}
function HodAllocation() {
  const { data, act } = useFaculty();
  const [subject, setSubject] = useState("");
  const [sem, setSem] = useState("Sem 1");
  const [fid, setFid] = useState(deptFaculty()[0].id);
  const rows = data.allocations.filter((a) => a.deptId === hodDept());
  return (
    <>
      <Header title="Subject Allocation" sub="Assign subjects to faculty for this semester" />
      <Card className="p-4 mb-4 flex flex-wrap gap-2 items-end">
        <Input className="w-56" placeholder="Subject name" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <select className="h-9 rounded-md border border-border bg-background px-2 text-sm" value={sem} onChange={(e) => setSem(e.target.value)}>
          {["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <FacSelect value={fid} onChange={setFid} />
        <Button className="gap-1" disabled={!subject.trim()} onClick={() => {
          const id = uid("a");
          act(`Allocated ${subject} to ${fac(fid)?.name}`, [{ col: "allocations", id, value: { id, deptId: hodDept(), subject: subject.trim(), semester: sem, facultyId: fid } }]);
          setSubject("");
        }}><Plus className="size-4" />Allocate</Button>
      </Card>
      <Table head={["Subject", "Semester", "Faculty", ""]}>
        {rows.map((a) => (
          <tr key={a.id}>
            <Td className="font-medium">{a.subject}</Td>
            <Td>{a.semester}</Td>
            <Td>
              <FacSelect value={a.facultyId} onChange={(v) => act(`Reassigned ${a.subject}: ${fac(a.facultyId)?.name} → ${fac(v)?.name}`, [{ col: "allocations", id: a.id, value: { ...a, facultyId: v } }])} />
            </Td>
            <Td className="text-right">
              <Button size="sm" variant="ghost" className="h-7 text-destructive" onClick={() => act(`Removed allocation: ${a.subject}`, [{ col: "allocations", id: a.id, value: null }])}>Remove</Button>
            </Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
function FacSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select className="h-9 rounded-md border border-border bg-background px-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
      {deptFaculty().map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
    </select>
  );
}
function TimetableGrid({ facultyId }: { facultyId?: string }) {
  const { data } = useFaculty();
  const allocs = data.allocations.filter((a) => a.deptId === hodDept() && (!facultyId || a.facultyId === facultyId));
  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr><th className="px-3 py-2 text-left font-medium">Day</th>{SLOTS.map((s) => <th key={s} className="px-3 py-2 text-left font-medium">{s}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {DAYS.map((d, di) => (
            <tr key={d}>
              <td className="px-3 py-2 font-medium">{d}</td>
              {SLOTS.map((s, si) => {
                const a = allocs.length ? allocs[(di * 2 + si) % (allocs.length + 2)] : undefined;
                return (
                  <td key={s} className="px-2 py-1.5">
                    {a ? (
                      <div className="rounded-md bg-primary/10 px-2 py-1.5">
                        <div className="font-medium text-foreground truncate">{a.subject}</div>
                        <div className="text-muted-foreground">{facultyId ? a.semester : fac(a.facultyId)?.name}</div>
                      </div>
                    ) : <span className="text-muted-foreground">—</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
function HodTimetable() {
  return (<><Header title="Timetable" sub="Weekly department timetable generated from subject allocation" /><TimetableGrid /></>);
}
function HodMentoring() {
  const { data, act } = useFaculty();
  return (
    <>
      <Header title="Mentoring" sub="Assign faculty mentors to students" />
      <Table head={["Student", "USN", "Mentor"]}>
        {data.mentors.filter((m) => m.deptId === hodDept()).map((m) => (
          <tr key={m.id}>
            <Td className="font-medium">{m.student}</Td>
            <Td>{m.usn}</Td>
            <Td><FacSelect value={m.facultyId} onChange={(v) => act(`Mentor for ${m.student} → ${fac(v)?.name}`, [{ col: "mentors", id: m.id, value: { ...m, facultyId: v } }])} /></Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
function HodHiring() {
  const { data, act } = useFaculty();
  const [position, setPosition] = useState("Assistant Professor");
  const [subject, setSubject] = useState("");
  const [reason, setReason] = useState("");
  return (
    <>
      <Header title="Hiring Requests" sub="Raise faculty requirements to the Dean" />
      <Card className="p-4 mb-4 flex flex-wrap gap-2">
        <select className="h-9 rounded-md border border-border bg-background px-2 text-sm" value={position} onChange={(e) => setPosition(e.target.value)}>
          {["Professor", "Associate Professor", "Assistant Professor", "Lecturer", "Lab Instructor"].map((p) => <option key={p}>{p}</option>)}
        </select>
        <Input className="w-48" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <Input className="flex-1 min-w-48" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        <Button disabled={!subject.trim()} onClick={() => {
          const id = uid("h");
          act(`Requested ${position} (${subject})`, [{ col: "hiring", id, value: { id, deptId: hodDept(), position, subject: subject.trim(), count: 1, reason: reason || "—", status: "Pending" } }]);
          setSubject(""); setReason("");
        }}>Send to Dean</Button>
      </Card>
      <Table head={["Position", "Subject", "Reason", "Status"]}>
        {data.hiring.filter((h) => h.deptId === hodDept()).map((h) => (
          <tr key={h.id}><Td className="font-medium">{h.position}</Td><Td>{h.subject}</Td><Td className="text-muted-foreground">{h.reason}</Td><Td><StatusBadge s={h.status} /></Td></tr>
        ))}
      </Table>
    </>
  );
}
function HodLeaves() {
  const { data, act } = useFaculty();
  return (
    <>
      <Header title="Leave Approvals" sub="Staff leave requests in your department" />
      <Table head={["Faculty", "Type", "From", "To", "Reason", "Decision"]}>
        {data.leaves.map((l) => (
          <tr key={l.id}>
            <Td className="font-medium">{fac(l.facultyId)?.name}</Td>
            <Td>{l.type}</Td><Td>{l.from}</Td><Td>{l.to}</Td>
            <Td className="text-muted-foreground">{l.reason}</Td>
            <Td><Decide status={l.status} onDecide={(s) => act(`${s} leave for ${fac(l.facultyId)?.name}`, [{ col: "leaves", id: l.id, value: { ...l, status: s } }])} /></Td>
          </tr>
        ))}
      </Table>
    </>
  );
}

/* ---------- TEACHING STAFF ---------- */
const me = () => fac(CURRENT_TEACHER)!;

function TeacherOverview() {
  const { data } = useFaculty();
  const m = me();
  return (
    <>
      <Header title={`Welcome, ${m.name}`} sub={`${m.designation} · ${dept(m.deptId)?.name}`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Stat label="My subjects" value={data.allocations.filter((a) => a.facultyId === m.id).length} />
        <Stat label="Mentees" value={data.mentors.filter((x) => x.facultyId === m.id).length} />
        <Stat label="Open tasks" value={data.tasks.filter((t) => t.facultyId === m.id && !t.done).length} />
        <Stat label="Feedback" value={`${m.feedback} / 5`} />
      </div>
      <TimetableGrid facultyId={m.id} />
    </>
  );
}
function TeacherTimetable() {
  return (<><Header title="My Timetable" sub="Your weekly teaching schedule" /><TimetableGrid facultyId={me().id} /></>);
}
function TeacherClass() {
  const { data, act } = useFaculty();
  const mine = data.allocations.filter((a) => a.facultyId === me().id);
  const [subject, setSubject] = useState(mine[0]?.subject ?? "");
  const [present, setPresent] = useState("55");
  return (
    <>
      <Header title="My Class" sub="Record attendance and view mentees" />
      <Card className="p-4 mb-4 flex flex-wrap gap-2 items-center">
        <select className="h-9 rounded-md border border-border bg-background px-2 text-sm" value={subject} onChange={(e) => setSubject(e.target.value)}>
          {mine.map((a) => <option key={a.id}>{a.subject}</option>)}
        </select>
        <Input type="number" className="w-28" value={present} onChange={(e) => setPresent(e.target.value)} />
        <span className="text-sm text-muted-foreground">of 60 present</span>
        <Button disabled={!subject} onClick={() => {
          const id = uid("at");
          act(`Marked attendance: ${subject} (${present}/60)`, [{ col: "attendance", id, value: { id, facultyId: me().id, subject, date: today(), present: Number(present) || 0, total: 60 } }]);
        }}>Save attendance</Button>
      </Card>
      <div className="grid lg:grid-cols-2 gap-4">
        <Table head={["Date", "Subject", "Present"]}>
          {data.attendance.filter((a) => a.facultyId === me().id).map((a) => (
            <tr key={a.id}><Td>{a.date}</Td><Td>{a.subject}</Td><Td>{a.present}/{a.total}</Td></tr>
          ))}
          {!data.attendance.some((a) => a.facultyId === me().id) && <tr><Td className="text-muted-foreground">No attendance recorded yet</Td></tr>}
        </Table>
        <Table head={["Mentee", "USN"]}>
          {data.mentors.filter((x) => x.facultyId === me().id).map((x) => <tr key={x.id}><Td className="font-medium">{x.student}</Td><Td>{x.usn}</Td></tr>)}
        </Table>
      </div>
    </>
  );
}
function TeacherTasks() {
  const { data, act } = useFaculty();
  return (
    <>
      <Header title="Assigned Tasks" sub="Work assigned by HOD and Dean" />
      <Table head={["Task", "Due", "Status", ""]}>
        {data.tasks.filter((t) => t.facultyId === me().id).map((t) => (
          <tr key={t.id}>
            <Td className="font-medium">{t.title}</Td><Td>{t.due}</Td>
            <Td><StatusBadge s={t.done ? "Done" : "Open"} /></Td>
            <Td className="text-right">
              <Button size="sm" variant="outline" className="h-7" onClick={() => act(`${t.done ? "Reopened" : "Completed"} task: ${t.title}`, [{ col: "tasks", id: t.id, value: { ...t, done: !t.done } }])}>
                {t.done ? "Reopen" : "Mark done"}
              </Button>
            </Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
function TeacherLeave() {
  const { data, act } = useFaculty();
  const [type, setType] = useState("Casual");
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  const [reason, setReason] = useState("");
  return (
    <>
      <Header title="Apply for Leave" sub="Requests go to your HOD for approval" />
      <Card className="p-4 mb-4 flex flex-wrap gap-2">
        <select className="h-9 rounded-md border border-border bg-background px-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
          {["Casual", "Sick", "Earned", "Duty"].map((t) => <option key={t}>{t}</option>)}
        </select>
        <Input type="date" className="w-40" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input type="date" className="w-40" value={to} onChange={(e) => setTo(e.target.value)} />
        <Input className="flex-1 min-w-48" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        <Button disabled={!reason.trim()} onClick={() => {
          const id = uid("l");
          act(`Applied ${type} leave (${from} → ${to})`, [{ col: "leaves", id, value: { id, facultyId: me().id, type, from, to, reason: reason.trim(), status: "Pending" } }]);
          setReason("");
        }}>Submit</Button>
      </Card>
      <Table head={["Type", "From", "To", "Reason", "Status"]}>
        {data.leaves.filter((l) => l.facultyId === me().id).map((l) => (
          <tr key={l.id}><Td>{l.type}</Td><Td>{l.from}</Td><Td>{l.to}</Td><Td className="text-muted-foreground">{l.reason}</Td><Td><StatusBadge s={l.status} /></Td></tr>
        ))}
      </Table>
    </>
  );
}
function TeacherComplaint() {
  const { data, act } = useFaculty();
  const [subject, setSubject] = useState("");
  const [detail, setDetail] = useState("");
  return (
    <>
      <Header title="Register Complaint" sub="Report infrastructure or academic issues" />
      <Card className="p-4 mb-4 flex flex-wrap gap-2">
        <Input className="w-56" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <Input className="flex-1 min-w-48" placeholder="Details" value={detail} onChange={(e) => setDetail(e.target.value)} />
        <Button disabled={!subject.trim()} onClick={() => {
          const id = uid("cp");
          act(`Registered complaint: ${subject}`, [{ col: "complaints", id, value: { id, facultyId: me().id, subject: subject.trim(), detail, status: "Open" } }]);
          setSubject(""); setDetail("");
        }}>Submit</Button>
      </Card>
      <Table head={["Subject", "Details", "Status"]}>
        {data.complaints.map((c) => <tr key={c.id}><Td className="font-medium">{c.subject}</Td><Td className="text-muted-foreground">{c.detail}</Td><Td><StatusBadge s={c.status} /></Td></tr>)}
        {!data.complaints.length && <tr><Td className="text-muted-foreground">No complaints yet</Td></tr>}
      </Table>
    </>
  );
}

/* ---------- ROLLBACK ---------- */
export function HistoryPage() {
  const { history, revert } = useFaculty();
  return (
    <>
      <Header title="Action History" sub="Every change is logged. Roll back any action to restore the previous state." />
      {!history.length ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          <RotateCcw className="size-7 mx-auto mb-2" />No actions yet. Approvals, allocations and submissions will appear here.
        </Card>
      ) : (
        <Card className="divide-y divide-border">
          {history.map((h) => (
            <div key={h.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className={cn("text-sm font-medium", h.reverted && "line-through text-muted-foreground")}>{h.label}</div>
                <div className="text-xs text-muted-foreground">{h.role} · {new Date(h.at).toLocaleString("en-IN")}</div>
              </div>
              {h.reverted ? <Badge variant="secondary">Rolled back</Badge> : (
                <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => revert(h.id)}><Undo2 className="size-4" />Roll back</Button>
              )}
            </div>
          ))}
        </Card>
      )}
    </>
  );
}

/* ---------- router ---------- */
const PAGES: Record<string, Record<string, () => React.ReactElement>> = {
  Dean: { "": DeanOverview, curriculum: DeanCurriculum, recruitment: DeanRecruitment, "exam-approvals": DeanExams, results: DeanResults, hods: DeanHods },
  HOD: { "": HodOverview, faculty: HodFaculty, allocation: HodAllocation, timetable: HodTimetable, mentoring: HodMentoring, hiring: HodHiring, "leave-approvals": HodLeaves },
  "Teaching Staff": { "": TeacherOverview, "my-timetable": TeacherTimetable, "my-class": TeacherClass, tasks: TeacherTasks, "apply-leave": TeacherLeave, complaint: TeacherComplaint },
};

export function FacultyPage({ page }: { page: string }) {
  const { role } = useFaculty();
  if (page === "history") return <HistoryPage />;
  const C = PAGES[role][page];
  if (!C) {
    return (
      <Card className="p-10 text-center">
        <h3 className="font-semibold">Not available for {role}</h3>
        <p className="text-sm text-muted-foreground mt-1">Switch role from the top bar or pick a page from the menu.</p>
      </Card>
    );
  }
  return <C />;
}
