"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Command } from "cmdk"
import { Check, ChevronDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"

export type SelectSearchItem = { value: string; label: string }

export type SelectSearchProps = {
  items: SelectSearchItem[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
}

export function SelectSearch({
  items,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results.",
  disabled,
  className,
  triggerClassName,
}: SelectSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const selected = React.useMemo(() => items.find((i) => i.value === value) ?? null, [items, value])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) => `${i.label} ${i.value}`.toLowerCase().includes(q))
  }, [items, query])

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "w-full h-9 px-3 rounded-md flex items-center justify-between gap-2 text-sm",
            "bg-[#11111f] border border-[rgba(91,194,231,0.2)] text-white",
            "hover:bg-[#0f0f1c] focus:outline-none focus:ring-2 focus:ring-[#5bc2e7]/40 focus:border-[#5bc2e7]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            triggerClassName,
          )}
        >
          <span className={cn("truncate", !selected && "text-[#6b7280]")}>{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-[#c0c5ce]" />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          className={cn(
            "z-50 w-[--radix-popover-trigger-width] rounded-md border shadow-md overflow-hidden",
            "bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white",
            className,
          )}
        >
          <Command className="w-full">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[rgba(91,194,231,0.2)]">
              <Search className="w-4 h-4 text-[#c0c5ce]" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder={searchPlaceholder}
                className={cn(
                  "w-full bg-transparent outline-none text-sm text-white placeholder:text-[#6b7280]",
                )}
              />
            </div>

            <Command.List className="max-h-64 overflow-auto p-1">
              {filtered.length === 0 ? (
                <Command.Empty className="py-10 px-4 text-center text-sm text-[#6b7280]">{emptyText}</Command.Empty>
              ) : (
                filtered.map((it) => {
                  const isSelected = it.value === value
                  return (
                    <Command.Item
                      key={it.value}
                      value={`${it.label} ${it.value}`}
                      onSelect={() => {
                        onValueChange(it.value)
                        setOpen(false)
                        setQuery("")
                      }}
                      className={cn(
                        "flex items-center gap-2 px-2 py-2 rounded-sm text-sm cursor-pointer select-none outline-none",
                        "text-[#c0c5ce] data-[selected=true]:bg-[#11111f] data-[selected=true]:text-[#5bc2e7]",
                        "aria-selected:bg-[#11111f] aria-selected:text-[#5bc2e7]",
                      )}
                    >
                      <span className="flex-1 truncate">{it.label}</span>
                      {isSelected ? <Check className="w-4 h-4 text-[#5bc2e7]" /> : null}
                    </Command.Item>
                  )
                })
              )}
            </Command.List>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

