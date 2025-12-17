import { Suspense } from "react"
import { CrudPage } from "../_components/crud-page"

export default function CommandsCrudPage() {
  return (
    <Suspense fallback={null}>
      <CrudPage
        title="Commands"
        storageKey="super-admin:commands"
        seed={[
          { name: "ls -la", description: "List files with details" },
          { name: "systemctl status nginx", description: "Check nginx service" },
          { name: "tail -n 200 /var/log/auth.log", description: "Review auth logs" },
          { name: "docker ps", description: "List running containers" },
        ]}
      />
    </Suspense>
  )
}
