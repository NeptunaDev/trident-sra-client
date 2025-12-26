import { Suspense } from "react"
import { CrudPage } from "../_components/crud-page"

export default function ParticipantsCrudPage() {
  return (
    <Suspense fallback={null}>
      <CrudPage
        title="Participants"
        storageKey="super-admin:participants"
        seed={[
          { name: "Requester", description: "User who requested access" },
          { name: "Approver", description: "User who approved the request" },
          { name: "Observer", description: "Read-only session observer" },
          { name: "Executor", description: "User executing commands" },
        ]}
      />
    </Suspense>
  )
}
