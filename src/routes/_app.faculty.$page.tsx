import { createFileRoute } from "@tanstack/react-router";
import { FacultyPage } from "@/components/faculty/pages";

export const Route = createFileRoute("/_app/faculty/$page")({
  component: PageRoute,
});

function PageRoute() {
  const { page } = Route.useParams();
  return <FacultyPage page={page} />;
}
