import { Suspense } from "react"
import { CrudPage } from "../_components/crud-page"

export default function SessionsCrudPage() {
  return (
    <Suspense fallback={null}>
      <CrudPage
        title="Sessions"
        storageKey="super-admin:sessions"
        seed={[
          { name: "sess-7f3a", description: "Production - web-01 (SSH)" },
          { name: "sess-1c9d", description: "Staging - api-02 (SSH)" },
          { name: "sess-9aa2", description: "Production - win-03 (RDP)" },
          { name: "sess-2b10", description: "Dev - lab-vm (VNC)" },
        ]}
      />
    </Suspense>
  )
}
