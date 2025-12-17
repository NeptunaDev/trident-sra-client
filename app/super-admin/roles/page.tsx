import { Suspense } from "react"
import { CrudPage } from "../_components/crud-page"

export default function RolesCrudPage() {
  return (
    <Suspense fallback={null}>
      <CrudPage
        title="Roles"
        storageKey="super-admin:roles"
        seed={[
          { name: "Super Admin", description: "Full access to all modules" },
          { name: "Admin", description: "Manage users, orgs and policies" },
          { name: "Auditor", description: "Read-only access to audit logs" },
          { name: "Operator", description: "Manage sessions and recordings" },
        ]}
      />
    </Suspense>
  )
}
