import { Suspense } from "react"
import { CrudPage } from "../_components/crud-page"

export default function OrganizationsCrudPage() {
  return (
    <Suspense fallback={null}>
      <CrudPage
        title="Organizations"
        storageKey="super-admin:organizations"
        seed={[
          { name: "Neptuna", description: "Primary organization" },
          { name: "Trident Labs", description: "R&D and experiments" },
          { name: "Blue Harbor", description: "Customer success org" },
          { name: "Aegis Ops", description: "Operations and reliability" },
        ]}
      />
    </Suspense>
  )
}
