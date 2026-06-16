import { Suspense } from "react";
import { NewRecordContent, NewRecordFallback } from "./NewRecordClient";

export default function NewRecordPage() {
  return (
    <Suspense fallback={<NewRecordFallback />}>
      <NewRecordContent />
    </Suspense>
  );
}
