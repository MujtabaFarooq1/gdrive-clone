import { Suspense } from "react";
import DriveView from "@/components/driveView";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      }
    >
      <DriveView />
    </Suspense>
  );
}
