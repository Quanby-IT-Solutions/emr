"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { IconChevronDown, IconChevronRight, IconClipboardList } from "@tabler/icons-react"
import { toast } from "sonner"

interface OrderSetItem {
  name: string
  type: string
  details: string
}

interface OrderSet {
  id: string
  name: string
  description: string
  items: OrderSetItem[]
}

const orderSets: OrderSet[] = [
  {
    id: "os1",
    name: "Chest Pain Workup",
    description: "Standard evaluation for acute chest pain",
    items: [
      { name: "Troponin I", type: "Lab", details: "STAT, serial x3 q6h" },
      { name: "BMP", type: "Lab", details: "STAT" },
      { name: "CBC", type: "Lab", details: "STAT" },
      { name: "PT/INR", type: "Lab", details: "STAT" },
      { name: "Chest X-Ray", type: "Imaging", details: "PA and Lateral" },
      { name: "12-Lead ECG", type: "Procedure", details: "STAT" },
      { name: "Aspirin 325mg", type: "Medication", details: "PO, Once, chew" },
      { name: "Nitroglycerin 0.4mg SL", type: "Medication", details: "PRN chest pain" },
    ],
  },
  {
    id: "os2",
    name: "Sepsis Bundle",
    description: "Early goal-directed therapy for suspected sepsis",
    items: [
      { name: "Blood Culture x2", type: "Lab", details: "STAT, before antibiotics" },
      { name: "Lactate", type: "Lab", details: "STAT" },
      { name: "CBC with Diff", type: "Lab", details: "STAT" },
      { name: "CMP", type: "Lab", details: "STAT" },
      { name: "Urinalysis", type: "Lab", details: "STAT" },
      { name: "Normal Saline 30mL/kg", type: "Medication", details: "IV bolus over 3 hours" },
      { name: "Vancomycin 25mg/kg", type: "Medication", details: "IV, Once" },
      { name: "Piperacillin-Tazobactam 4.5g", type: "Medication", details: "IV, Q8H" },
    ],
  },
  {
    id: "os3",
    name: "Post-Op Standard",
    description: "Routine post-operative care orders",
    items: [
      { name: "CBC", type: "Lab", details: "AM draw" },
      { name: "BMP", type: "Lab", details: "AM draw" },
      { name: "Acetaminophen 1000mg", type: "Medication", details: "PO, Q6H, PRN pain" },
      { name: "Ondansetron 4mg", type: "Medication", details: "IV, Q6H, PRN nausea" },
      { name: "Enoxaparin 40mg", type: "Medication", details: "SC, Daily, DVT prophylaxis" },
      { name: "Incentive Spirometry", type: "Procedure", details: "Q1H while awake" },
    ],
  },
]

const typeBadgeClass: Record<string, string> = {
  Lab: "bg-blue-100 text-blue-800 border-blue-300",
  Imaging: "bg-purple-100 text-purple-800 border-purple-300",
  Medication: "bg-green-100 text-green-800 border-green-300",
  Procedure: "bg-orange-100 text-orange-800 border-orange-300",
}

export function OrderSetSection() {
  const [openSets, setOpenSets] = useState<Record<string, boolean>>({})

  const toggleSet = (id: string) => {
    setOpenSets((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handlePlaceOrderSet = (set: OrderSet) => {
    toast.success(`Order set placed: ${set.name}`, {
      description: `${set.items.length} orders queued for review`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconClipboardList className="h-5 w-5" />
          Order Sets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {orderSets.map((set) => {
          const isOpen = openSets[set.id] ?? false
          return (
            <Collapsible key={set.id} open={isOpen} onOpenChange={() => toggleSet(set.id)}>
              <div className="border rounded-lg">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full p-3 text-left hover:bg-muted/50 rounded-t-lg transition-colors">
                    <div className="flex items-center gap-3">
                      {isOpen ? (
                        <IconChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{set.name}</p>
                        <p className="text-xs text-muted-foreground">{set.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {set.items.length} items
                    </Badge>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t px-3 pb-3 pt-2 space-y-2">
                    {set.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm py-1.5 px-2 rounded hover:bg-muted/30"
                      >
                        <div className="flex items-center gap-2">
                          <Badge className={typeBadgeClass[item.type] ?? "bg-gray-100 text-gray-800"}>
                            {item.type}
                          </Badge>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.details}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <Button size="sm" onClick={() => handlePlaceOrderSet(set)}>
                        Place Order Set
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )
        })}
      </CardContent>
    </Card>
  )
}
