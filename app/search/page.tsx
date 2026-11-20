import { Suspense } from "react";
import SearchView from "./SearchView";

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading search...</p>}>
      <SearchView />
    </Suspense>
  );
}
