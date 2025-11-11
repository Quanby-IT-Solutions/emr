import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, isSameDay, startOfToday } from "date-fns"
import { DepartmentList, Provider } from "@/app/(dashboard)/dummy-data/dummy-providers"
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"

interface DailyViewProps {
  filteredData: DepartmentList[]
  date: Date
  onProviderClick: (provider: Provider & { department: string }) => void
}

const PAGE_SIZE = 3

export function DailyView({ filteredData, date, onProviderClick }: DailyViewProps) {
  const [currentPage, setCurrentPage] = useState<{ [dept: string]: number }>({})

  const handleFirstPage = (dept: string) => {
    setCurrentPage(prev => ({ ...prev, [dept]: 0 }))
  }

  const handleLastPage = (dept: string, totalPages: number) => {
    setCurrentPage(prev => ({ ...prev, [dept]: totalPages - 1 }))
  }

  const handleNextPage = (dept: string, totalPages: number) => {
    setCurrentPage(prev => ({
      ...prev,
      [dept]: Math.min((prev[dept] || 0) + 1, totalPages - 1),
    }))
  }

  const handlePrevPage = (dept: string) => {
    setCurrentPage(prev => ({
      ...prev,
      [dept]: Math.max((prev[dept] || 0) - 1, 0),
    }))
  }

  return (
    <div className="space-y-4">
      {filteredData.map(dept => {
        const totalPages = Math.ceil(dept.providers.length / PAGE_SIZE) || 1
        const rawPage = currentPage[dept.department] || 0
        const page = Math.min(rawPage, totalPages - 1)

        const paginatedProviders = dept.providers.slice(
          page * PAGE_SIZE,
          page * PAGE_SIZE + PAGE_SIZE
        )


        return (
          <Card key={dept.department} className="p-4 shadow-lg bg-card/95">
            {/* Department Header */}
            <h2 className="text-lg font-semibold mt-1 text-primary">{dept.department}</h2>

            <div>
              {paginatedProviders.map(prov => {
                const isToday = isSameDay(date, startOfToday())
                const filteredAppointments = isToday ? prov.appointments : []

                return (
                  <div
                    key={prov.name}
                    className="p-4 border-b border-t grid grid-cols-1 md:grid-cols-3 gap-6 cursor-pointer hover:bg-muted/30 transition"
                    onClick={() => onProviderClick({ ...prov, department: dept.department })}
                  >
                    {/* Provider Info */}
                    <div className="space-y-2">
                      <p className="text-base font-semibold">{prov.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Shift: {prov.availability.join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground">{format(date, "EEEE, MMM d")}</p>

                      <div className="pt-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                          {isToday ? "Today's Visits" : "Scheduled Visits"}
                        </p>

                        {filteredAppointments.length > 0 ? (
                          <ul className="text-xs space-y-1">
                            {filteredAppointments.map((appt, idx) => (
                              <li key={idx}>
                                {appt.time} — {appt.patient}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs italic text-muted-foreground">No visits on this day</p>
                        )}
                      </div>
                    </div>

                    {/* Dept / Clinic Info */}
                    <div className="space-y-2 text-sm">
                      <p className="text-xs font-semibold uppercase text-primary">Department</p>
                      <p>{dept.department}</p>

                      <p className="text-xs font-semibold uppercase text-primary mt-2">Office Location</p>
                      <p className="text-muted-foreground">{prov.officeLocation ?? "Not Available"}</p>
                    </div>

                    {/* Contacts */}
                    <div className="space-y-2 text-sm md:text-right">
                      <p className="text-xs font-semibold uppercase text-primary">Contact Details</p>
                      {prov.contactSchedulerOnly ? (
                        <p className="text-muted-foreground">Scheduler Only: {prov.contactSchedulerOnly}</p>
                      ) : (
                        <p className="text-muted-foreground italic">No scheduler line</p>
                      )}
                      {prov.publicContact && <p className="text-muted-foreground">Patient Line: {prov.publicContact}</p>}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-end items-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFirstPage(dept.department)}
                  disabled={page === 0}
                  aria-label="First Page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrevPage(dept.department)}
                  disabled={page === 0}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="px-3 py-1 font-semibold text-primary select-none">{page + 1}</span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNextPage(dept.department, totalPages)}
                  disabled={page >= totalPages - 1}
                  aria-label="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLastPage(dept.department, totalPages)}
                  disabled={page >= totalPages - 1}
                  aria-label="Last Page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
