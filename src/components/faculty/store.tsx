import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { SEED, type Collections, type FacultyRole } from "./data";

type Col = keyof Collections;
type Entity = { id: string } & Record<string, unknown>;
type Change = { col: Col; id: string; before: Entity | null; after: Entity | null };
export type HistoryEntry = { id: string; label: string; role: FacultyRole; at: number; changes: Change[]; reverted: boolean };

type Ctx = {
  role: FacultyRole;
  setRole: (r: FacultyRole) => void;
  data: Collections;
  history: HistoryEntry[];
  /** Upsert (or delete with null) and record a revertable history entry. */
  act: (label: string, ops: { col: Col; id: string; value: Entity | null }[]) => void;
  revert: (historyId: string) => void;
  reset: () => void;
};

const FacultyCtx = createContext<Ctx | null>(null);
const KEY = "faculty-portal-v1";
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

function apply(data: Collections, col: Col, id: string, value: Entity | null): Collections {
  const list = data[col] as unknown as Entity[];
  const exists = list.some((e) => e.id === id);
  let next: Entity[];
  if (value === null) next = list.filter((e) => e.id !== id);
  else if (exists) next = list.map((e) => (e.id === id ? value : e));
  else next = [value, ...list];
  return { ...data, [col]: next } as Collections;
}

export function FacultyProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<FacultyRole>("Dean");
  const [data, setData] = useState<Collections>(() => clone(SEED) as Collections);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.data) setData(s.data);
        if (s.history) setHistory(s.history);
        if (s.role) setRole(s.role);
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify({ data, history, role }));
  }, [data, history, role, loaded]);

  const act: Ctx["act"] = useCallback((label, ops) => {
    setData((prev) => {
      let next = prev;
      const changes: Change[] = ops.map(({ col, id, value }) => {
        const before = ((next[col] as unknown as Entity[]).find((e) => e.id === id) ?? null) as Entity | null;
        next = apply(next, col, id, value);
        return { col, id, before: before && clone(before), after: value && clone(value) };
      });
      const entry: HistoryEntry = { id: crypto.randomUUID(), label, role, at: Date.now(), changes, reverted: false };
      setHistory((h) => [entry, ...h]);
      return next;
    });
    toast.success(label, { description: "Saved · you can undo this from Action History" });
  }, [role]);

  const revert = useCallback((hid: string) => {
    const entry = history.find((h) => h.id === hid);
    if (!entry || entry.reverted) return;
    setData((prev) => {
      let next = prev;
      for (const c of [...entry.changes].reverse()) next = apply(next, c.col, c.id, c.before);
      return next;
    });
    setHistory((h) => h.map((x) => (x.id === hid ? { ...x, reverted: true } : x)));
    toast.info(`Rolled back: ${entry.label}`);
  }, [history]);

  const reset = useCallback(() => {
    setData(clone(SEED) as Collections);
    setHistory([]);
    toast.info("Portal reset to original data");
  }, []);

  const value = useMemo(() => ({ role, setRole, data, history, act, revert, reset }), [role, data, history, act, revert, reset]);
  return <FacultyCtx.Provider value={value}>{children}</FacultyCtx.Provider>;
}

export function useFaculty() {
  const c = useContext(FacultyCtx);
  if (!c) throw new Error("useFaculty outside provider");
  return c;
}
