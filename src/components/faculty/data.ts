// Seed data adapted from the College Management Portal project.
export type FacultyRole = "Dean" | "HOD" | "Teaching Staff";

export type Dept = { id: string; name: string; code: string; hodId: string; students: number; passPct: number; avgCgpa: number };
export type Faculty = {
  id: string;
  name: string;
  designation: string;
  deptId: string;
  subjects: string[];
  weeklyHours: number;
  feedback: number;
  attendance: number;
};
export type Status = "Pending" | "Approved" | "Rejected";
export type Curriculum = { id: string; deptId: string; title: string; semester: string; submittedBy: string; status: Status; note?: string };
export type Hiring = { id: string; deptId: string; position: string; subject: string; count: number; reason: string; status: Status };
export type ExamPaper = { id: string; deptId: string; subject: string; date: string; setBy: string; status: Status };
export type Leave = { id: string; facultyId: string; type: string; from: string; to: string; reason: string; status: Status };
export type Allocation = { id: string; deptId: string; subject: string; semester: string; facultyId: string };
export type Mentor = { id: string; student: string; usn: string; deptId: string; facultyId: string };
export type Task = { id: string; facultyId: string; title: string; due: string; done: boolean };
export type Attendance = { id: string; facultyId: string; subject: string; date: string; present: number; total: number };
export type Complaint = { id: string; facultyId: string; subject: string; detail: string; status: "Open" | "Resolved" };

export const DEPTS: Dept[] = [
  { id: "d1", name: "Bachelor of Computer Applications", code: "BCA", hodId: "s3", students: 420, passPct: 91, avgCgpa: 7.8 },
  { id: "d2", name: "Bachelor of Commerce", code: "B.Com.", hodId: "s7", students: 510, passPct: 88, avgCgpa: 7.4 },
  { id: "d3", name: "Bachelor of Science", code: "B.Sc.", hodId: "s11", students: 360, passPct: 84, avgCgpa: 7.2 },
  { id: "d4", name: "Bachelor of Arts", code: "B.A.", hodId: "s15", students: 290, passPct: 86, avgCgpa: 7.1 },
];

const seed: [string, string, string, string, string[]][] = [
  ["s3", "Priyanka", "Professor & HOD", "d1", ["Programming in C", "Python Programming", "DBMS"]],
  ["s4", "Rahul", "Associate Professor", "d1", ["Java Programming", "Web Development"]],
  ["s5", "Nandini", "Assistant Professor", "d1", ["Computer Networks", "Cloud Computing"]],
  ["s6", "Karthik", "Lecturer", "d1", ["Mathematics", "Statistics"]],
  ["s19", "Vivek", "Assistant Professor", "d1", ["Data Analytics", "AI Fundamentals"]],
  ["s20", "Arjun", "Assistant Professor", "d1", ["Data Structures", "Advanced Java"]],
  ["s21", "Ananya", "Teaching Assistant", "d1", ["Web Technologies"]],
  ["s7", "Shwetha", "Professor & HOD", "d2", ["Financial Accounting", "Cost Accounting"]],
  ["s8", "Meghana", "Associate Professor", "d2", ["Business Law", "Corporate Finance"]],
  ["s9", "Rohan", "Assistant Professor", "d2", ["Marketing Management", "GST"]],
  ["s11", "Varshini", "Professor & HOD", "d3", ["Physics", "Chemistry"]],
  ["s12", "Anil", "Associate Professor", "d3", ["Real Analysis", "Numerical Methods"]],
  ["s15", "Sharanya", "Professor & HOD", "d4", ["English Literature", "History"]],
  ["s16", "Harish", "Associate Professor", "d4", ["Economics", "Sociology"]],
];

export const FACULTY: Faculty[] = seed.map(([id, name, designation, deptId, subjects], i) => ({
  id, name, designation, deptId, subjects,
  weeklyHours: 12 + ((i * 3) % 9),
  feedback: +(3.8 + ((i * 7) % 12) / 10).toFixed(1),
  attendance: 86 + ((i * 5) % 13),
}));

export const DEAN = { name: "Varshitha", designation: "Dean" };
export const CURRENT_HOD = "s3"; // Priyanka, BCA
export const CURRENT_TEACHER = "s4"; // Rahul, BCA

export const SEED = {
  curriculum: [
    { id: "c1", deptId: "d1", title: "Add Generative AI elective", semester: "Sem 5", submittedBy: "s3", status: "Pending" },
    { id: "c2", deptId: "d2", title: "Revise GST syllabus (2026 amendments)", semester: "Sem 4", submittedBy: "s7", status: "Pending" },
    { id: "c3", deptId: "d3", title: "Merge Mechanics lab sessions", semester: "Sem 2", submittedBy: "s11", status: "Approved" },
    { id: "c4", deptId: "d4", title: "Introduce Kannada Film Studies", semester: "Sem 6", submittedBy: "s15", status: "Pending" },
  ] as Curriculum[],
  hiring: [
    { id: "h1", deptId: "d1", position: "Assistant Professor", subject: "Cyber Security", count: 1, reason: "Workload exceeds 20 hrs/week", status: "Pending" },
    { id: "h2", deptId: "d3", position: "Lab Instructor", subject: "Chemistry", count: 1, reason: "New lab block", status: "Pending" },
  ] as Hiring[],
  exams: [
    { id: "e1", deptId: "d1", subject: "Data Structures", date: "2026-11-12", setBy: "s20", status: "Pending" },
    { id: "e2", deptId: "d2", subject: "Cost Accounting", date: "2026-11-14", setBy: "s7", status: "Pending" },
    { id: "e3", deptId: "d4", subject: "Economics", date: "2026-11-15", setBy: "s16", status: "Approved" },
  ] as ExamPaper[],
  leaves: [
    { id: "l1", facultyId: "s5", type: "Casual", from: "2026-10-02", to: "2026-10-03", reason: "Family function", status: "Pending" },
    { id: "l2", facultyId: "s19", type: "Sick", from: "2026-09-28", to: "2026-09-29", reason: "Fever", status: "Pending" },
    { id: "l3", facultyId: "s4", type: "Earned", from: "2026-08-10", to: "2026-08-12", reason: "Conference", status: "Approved" },
  ] as Leave[],
  allocations: [
    { id: "a1", deptId: "d1", subject: "Python Programming", semester: "Sem 3", facultyId: "s19" },
    { id: "a2", deptId: "d1", subject: "Java Programming", semester: "Sem 3", facultyId: "s4" },
    { id: "a3", deptId: "d1", subject: "Computer Networks", semester: "Sem 5", facultyId: "s5" },
    { id: "a4", deptId: "d1", subject: "Data Structures", semester: "Sem 3", facultyId: "s20" },
    { id: "a5", deptId: "d1", subject: "Web Development", semester: "Sem 5", facultyId: "s4" },
    { id: "a6", deptId: "d1", subject: "Statistics", semester: "Sem 1", facultyId: "s6" },
  ] as Allocation[],
  mentors: [
    { id: "m1", student: "Aditya Rao", usn: "BCA23001", deptId: "d1", facultyId: "s4" },
    { id: "m2", student: "Sneha Kulkarni", usn: "BCA23002", deptId: "d1", facultyId: "s4" },
    { id: "m3", student: "Mohammed Ayaan", usn: "BCA23003", deptId: "d1", facultyId: "s5" },
    { id: "m4", student: "Diya Shetty", usn: "BCA23004", deptId: "d1", facultyId: "s20" },
    { id: "m5", student: "Tejas Hegde", usn: "BCA23005", deptId: "d1", facultyId: "s19" },
  ] as Mentor[],
  tasks: [
    { id: "t1", facultyId: "s4", title: "Submit Sem 3 internal marks", due: "2026-09-30", done: false },
    { id: "t2", facultyId: "s4", title: "Prepare NAAC criterion 2 data", due: "2026-10-05", done: false },
    { id: "t3", facultyId: "s4", title: "Lab manual revision – Java", due: "2026-09-20", done: true },
  ] as Task[],
  attendance: [] as Attendance[],
  complaints: [] as Complaint[],
};

export type Collections = { [K in keyof typeof SEED]: (typeof SEED)[K][number][] };

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];

export const fac = (id: string) => FACULTY.find((f) => f.id === id);
export const dept = (id: string) => DEPTS.find((d) => d.id === id);
