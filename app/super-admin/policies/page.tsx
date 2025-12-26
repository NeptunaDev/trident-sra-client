import { Suspense } from "react"
import { CrudPage } from "../_components/crud-page"

export default function PoliciesCrudPage() {
  return (
    <Suspense fallback={null}>
      <CrudPage
        title="Policies"
        storageKey="super-admin:policies"
        seed={[
          { name: "Block Dangerous Commands", description: "Prevents rm -rf, shutdown, etc." },
          { name: "MFA Required", description: "Require MFA for privileged sessions" },
          { name: "Session Time Limit", description: "Auto-end sessions after 60 minutes" },
          { name: "Recording Mandatory", description: "Record all production sessions" },
        ]}
      />
    </Suspense>
  )
}
