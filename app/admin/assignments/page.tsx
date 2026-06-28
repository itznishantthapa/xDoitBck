import { AssignmentsTable } from "@/components/admin/assignments-table";
import { assignments } from "@/mock/AssignmentMocked";

export default function AssignmentsPage() {
  return (
    <div className="flex h-full min-h-0 flex-col pt-2">
      <AssignmentsTable assignments={assignments} />
    </div>
  );
}
