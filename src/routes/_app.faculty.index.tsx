import { createFileRoute } from "@tanstack/react-router";
import { FacultyPage } from "@/components/faculty/pages";

export const Route = createFileRoute("/_app/faculty/")({
  component: () => <FacultyPage page="" />,
});
