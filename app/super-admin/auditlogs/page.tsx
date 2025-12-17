import { Suspense } from "react"
import { CrudPage } from "../_components/crud-page"

export default function AuditLogsCrudPage() {
  return (
    <Suspense fallback={null}>
      <CrudPage
        title="Audit Logs"
        storageKey="super-admin:auditlogs"
        seed={[
          { name: "LOGIN_SUCCESS", description: "User logged in successfully" },
          { name: "POLICY_UPDATED", description: "A policy was modified" },
          { name: "SESSION_STARTED", description: "A privileged session started" },
          { name: "COMMAND_BLOCKED", description: "A command was blocked by policy" },
        ]}
      />
    </Suspense>
  )
}
