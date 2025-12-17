import { Suspense } from "react"
import { CrudPage } from "../_components/crud-page"

export default function UsersCrudPage() {
  return (
    <Suspense fallback={null}>
      <CrudPage
        title="Users"
        storageKey="super-admin:users"
        seed={[
          { name: "Alice Johnson", description: "Security Analyst" },
          { name: "Bruno Díaz", description: "Platform Engineer" },
          { name: "Carla Méndez", description: "Audit Reviewer" },
          { name: "Diego Torres", description: "Support Admin" },
        ]}
      />
    </Suspense>
  )
}

