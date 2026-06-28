import { UsersTable } from "@/components/admin/users-table";
import { users } from "@/mock/UsersMocked";

export default function UsersPage() {
  return (
    <div className="flex h-full min-h-0 flex-col pt-2">
      <UsersTable users={users} />
    </div>
  );
}
