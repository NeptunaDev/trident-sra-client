"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CrudItem = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

type CrudSeedItem = {
  name: string
  description: string
}

function nowIso() {
  return new Date().toISOString()
}

function safeParseItems(raw: string | null): CrudItem[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(Boolean) as CrudItem[]
  } catch {
    return []
  }
}

function persist(storageKey: string, items: CrudItem[]) {
  localStorage.setItem(storageKey, JSON.stringify(items))
}

function buildSeed(seed: CrudSeedItem[]): CrudItem[] {
  const ts = nowIso()
  return seed.map((s) => ({
    id: crypto.randomUUID(),
    name: s.name,
    description: s.description,
    createdAt: ts,
    updatedAt: ts,
  }))
}

export function CrudPage(props: { title: string; storageKey: string; seed?: CrudSeedItem[] }) {
  const { title, storageKey, seed } = props
  const searchParams = useSearchParams()
  const q = (searchParams.get("q") ?? "").trim().toLowerCase()

  const [items, setItems] = useState<CrudItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const existing = safeParseItems(localStorage.getItem(storageKey))
    if (existing.length > 0) {
      setItems(existing)
      return
    }

    if (seed?.length) {
      const seeded = buildSeed(seed)
      persist(storageKey, seeded)
      setItems(seeded)
      return
    }

    setItems([])
  }, [storageKey, seed])

  const filtered = useMemo(() => {
    if (!q) return items
    return items.filter((it) => `${it.name} ${it.description}`.toLowerCase().includes(q))
  }, [items, q])

  const openCreate = () => {
    setEditingId(null)
    setName("")
    setDescription("")
    setIsOpen(true)
  }

  const openEdit = (it: CrudItem) => {
    setEditingId(it.id)
    setName(it.name)
    setDescription(it.description)
    setIsOpen(true)
  }

  const onSave = () => {
    const trimmedName = name.trim()
    const trimmedDesc = description.trim()
    if (!trimmedName) return

    setItems((prev) => {
      const ts = nowIso()
      let next: CrudItem[]
      if (!editingId) {
        const created: CrudItem = {
          id: crypto.randomUUID(),
          name: trimmedName,
          description: trimmedDesc,
          createdAt: ts,
          updatedAt: ts,
        }
        next = [created, ...prev]
      } else {
        next = prev.map((it) =>
          it.id === editingId ? { ...it, name: trimmedName, description: trimmedDesc, updatedAt: ts } : it,
        )
      }
      persist(storageKey, next)
      return next
    })

    setIsOpen(false)
  }

  const requestDelete = (id: string) => setDeleteId(id)

  const confirmDelete = () => {
    if (!deleteId) return
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== deleteId)
      persist(storageKey, next)
      return next
    })
    setDeleteId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <p className="text-sm text-[#c0c5ce]">Create, update and delete {title.toLowerCase()}.</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          New
        </Button>
      </div>

      <Card className="bg-[#11111f] border-[rgba(91,194,231,0.2)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0f0f1c] border-b border-[rgba(91,194,231,0.2)]">
              <tr className="text-left">
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Name</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Description</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 px-4 text-center text-[#6b7280]">
                    No results.
                  </td>
                </tr>
              ) : (
                filtered.map((it) => (
                  <tr key={it.id} className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]">
                    <td className="py-3 px-4 text-white font-medium">{it.name}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.description || "—"}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(it)}
                          className="text-white hover:text-[#5bc2e7] hover:bg-[#0f0f1c]"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => requestDelete(it.id)}
                          className="text-white hover:text-white hover:bg-[#ff6b6b]"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{editingId ? "Update" : "Create"} {title.slice(0, -1) || title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#c0c5ce]">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#c0c5ce]">Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-white hover:bg-[#11111f]">
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={!name.trim()}
              className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold disabled:opacity-50"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => (!open ? setDeleteId(null) : null)}>
        <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm delete</DialogTitle>
          </DialogHeader>
          <div className="text-[#c0c5ce]">This action cannot be undone.</div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="text-white hover:bg-[#11111f]">
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

