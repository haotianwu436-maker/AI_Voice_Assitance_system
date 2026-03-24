import { AssignPanel } from "@/components/admin/assign-panel";
import { getCustomers, getSalesUsers } from "@/lib/customers/repository";

export default async function AdminAssignPage() {
  const [salesUsers, customers] = await Promise.all([
    getSalesUsers(),
    getCustomers()
  ]);

  return (
    <AssignPanel salesUsers={salesUsers.map((s) => ({ id: s.id, name: s.name }))} customers={customers} />
  );
}
