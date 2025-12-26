import { Suspense } from "react"
import { CrudPage } from "../_components/crud-page"

export default function RecordingsCrudPage() {
  return (
    <Suspense fallback={null}>
      <CrudPage
        title="Recordings"
        storageKey="super-admin:recordings"
        seed={[
          { name: "rec-00021", description: "Session recording for sess-7f3a" },
          { name: "rec-00022", description: "Session recording for sess-9aa2" },
          { name: "rec-00023", description: "Session recording for sess-1c9d" },
          { name: "rec-00024", description: "Session recording for sess-2b10" },
        ]}
      />
    </Suspense>
  )
}
