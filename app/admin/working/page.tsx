import { WorkingTable } from "@/components/admin/working-table";
import { workingAssignments } from "@/mock/WorkingMocked";

export default function WorkingPage() {
  return (
    <div className="flex h-full min-h-0 flex-col pt-2">
      <WorkingTable assignments={workingAssignments} />
    </div>
  );
}
