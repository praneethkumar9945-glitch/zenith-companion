export const COURSES = ["B.Sc", "B.Com", "B.A", "BCA", "BBA"] as const;
export const YEARS = ["1st Year", "2nd Year", "3rd Year"] as const;

export type Course = (typeof COURSES)[number];
export type Year = (typeof YEARS)[number];

export type Student = {
  id: string;
  name: string;
  email: string;
  course: Course;
  year: Year;
  phone: string;
  attendance: number;
  gpa: number;
  cgpa: number;
  subjects: { name: string; marks: number; max: number }[];
  monthlyAttendance: { month: string; pct: number }[];
  assignments: { title: string; status: "Submitted" | "Pending" | "Late" }[];
  remarks: string;
};

const SUBJECTS_BY_COURSE: Record<Course, string[]> = {
  "B.Sc": ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
  "B.Com": ["Accountancy", "Economics", "Business Law", "Statistics", "English"],
  "B.A": ["History", "Political Science", "Sociology", "Psychology", "English"],
  BCA: ["Programming in C", "Data Structures", "DBMS", "Web Tech", "Mathematics"],
  BBA: ["Management", "Marketing", "Finance", "HR", "Economics"],
};

const FIRST = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Ayaan", "Krishna", "Ishaan", "Rohan", "Ananya", "Diya", "Saanvi", "Aanya", "Pari", "Anika", "Navya", "Kiara", "Myra", "Sara"];
const LAST = ["Sharma", "Verma", "Patel", "Iyer", "Nair", "Reddy", "Khan", "Joshi", "Pillai", "Gupta", "Mehta", "Das", "Bose", "Shah", "Rao"];

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeStudent(idx: number, course: Course, year: Year): Student {
  const r = rand(idx * 37 + course.length * 13 + year.length);
  const first = FIRST[Math.floor(r() * FIRST.length)];
  const last = LAST[Math.floor(r() * LAST.length)];
  const name = `${first} ${last}`;
  const id = `${course.replace(/\./g, "").toUpperCase()}-${year[0]}-${String(idx).padStart(3, "0")}`;
  const attendance = Math.round(55 + r() * 45);
  const gpa = +(5 + r() * 5).toFixed(2);
  const subjects = SUBJECTS_BY_COURSE[course].map((n) => ({
    name: n,
    marks: Math.round(40 + r() * 60),
    max: 100,
  }));
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
  const monthlyAttendance = months.map((m) => ({ month: m, pct: Math.round(60 + r() * 40) }));
  const assignments = [
    { title: "Mid-term Project", status: r() > 0.3 ? "Submitted" : "Pending" },
    { title: "Lab Report 3", status: r() > 0.5 ? "Submitted" : "Late" },
    { title: "Term Paper", status: r() > 0.4 ? "Submitted" : "Pending" },
  ] as Student["assignments"];
  return {
    id,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@college.edu`,
    course,
    year,
    phone: `+91 9${Math.floor(r() * 900000000 + 100000000)}`,
    attendance,
    gpa,
    cgpa: +(gpa - 0.2 + r() * 0.4).toFixed(2),
    subjects,
    monthlyAttendance,
    assignments,
    remarks:
      attendance < 75
        ? "Attendance below required minimum. Counselling recommended."
        : gpa > 8
        ? "Excellent academic performance. Encourage to mentor peers."
        : "Consistent performer. Maintain current trajectory.",
  };
}

export const STUDENTS: Student[] = (() => {
  const out: Student[] = [];
  let idx = 1;
  COURSES.forEach((c) => {
    YEARS.forEach((y) => {
      const n = 8 + (idx % 4);
      for (let i = 0; i < n; i++) out.push(makeStudent(idx++, c, y));
    });
  });
  return out;
})();

export const ATTENDANCE_TREND = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    pct: Math.round(72 + Math.sin(i / 2) * 8 + (i % 3) * 2),
  };
});

export const PROGRAM_DISTRIBUTION = COURSES.map((c) => ({
  name: c,
  value: STUDENTS.filter((s) => s.course === c).length,
}));

export const AUDIT_LOGS = [
  { ts: "2025-06-17 09:42", user: "admin@college.edu", action: "LOGIN", target: "Dashboard", ip: "10.0.1.21" },
  { ts: "2025-06-17 09:51", user: "r.sharma@college.edu", action: "UPDATE_MARKS", target: "BSC-1-004", ip: "10.0.3.18" },
  { ts: "2025-06-17 10:14", user: "admin@college.edu", action: "ADD_STUDENT", target: "BCA-2-011", ip: "10.0.1.21" },
  { ts: "2025-06-17 10:33", user: "p.joshi@college.edu", action: "EXPORT_REPORT", target: "Attendance-Jun", ip: "10.0.2.07" },
  { ts: "2025-06-17 11:02", user: "k.verma@college.edu", action: "SCHEDULE_EVENT", target: "Internal Test - CS-11", ip: "10.0.4.05" },
  { ts: "2025-06-17 11:25", user: "admin@college.edu", action: "DELETE_RECORD", target: "Old-Term-Plan-2023", ip: "10.0.1.21" },
  { ts: "2025-06-17 11:48", user: "m.khan@college.edu", action: "UPDATE_REMARKS", target: "BA-3-006", ip: "10.0.5.12" },
  { ts: "2025-06-17 12:07", user: "admin@college.edu", action: "ROLE_CHANGE", target: "faculty:s.pillai", ip: "10.0.1.21" },
];

export const REPORTS = [
  { name: "Term Attendance Report", period: "Apr – Jun 2025", generated: "Jun 15, 2025", size: "2.4 MB", format: "PDF" },
  { name: "Internal Assessment Summary", period: "May 2025", generated: "May 30, 2025", size: "1.1 MB", format: "XLSX" },
  { name: "Faculty Workload Analysis", period: "Spring 2025", generated: "Jun 10, 2025", size: "780 KB", format: "PDF" },
  { name: "Course-wise GPA Distribution", period: "Spring 2025", generated: "Jun 12, 2025", size: "1.6 MB", format: "PDF" },
  { name: "At-Risk Students Watchlist", period: "Jun 2025", generated: "Jun 16, 2025", size: "420 KB", format: "XLSX" },
  { name: "Assignment Submission Audit", period: "Apr – Jun 2025", generated: "Jun 14, 2025", size: "990 KB", format: "PDF" },
];
