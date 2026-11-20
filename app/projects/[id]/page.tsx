import { Suspense } from "react";
import ProjectScreen from "./ProjectScreen";

export default function ProjectPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading project...</p>}>
      <ProjectScreen />
    </Suspense>
  );
}
