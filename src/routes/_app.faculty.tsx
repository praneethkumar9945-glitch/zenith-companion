import { createFileRoute } from "@tanstack/react-router";
import { FacultyLayout } from "@/components/faculty/layout";

export const Route = createFileRoute("/_app/faculty")({
  head: () => ({
    meta: [
      { title: "Faculty Portal — Dean, HOD & Teaching Staff | Edusphere" },
      { name: "description", content: "Role-based faculty portal for Dean, Head of Department and teaching staff with undoable actions." },
      { property: "og:title", content: "Faculty Portal — Edusphere" },
      { property: "og:description", content: "Dean, HOD and teaching staff workspaces with full action rollback." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FacultyLayout,
});
