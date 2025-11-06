import { Card } from "@/components/ui/card"
import { format, isSameDay, startOfToday } from "date-fns"
import { DepartmentList, Provider } from "@/app/(dashboard)/scheduler/dummy-data/dummy-providers"

interface DailyViewProps {
  filteredData: DepartmentList[]
  date: Date
  onProviderClick: (provider: Provider & { department: string }) => void
}

export function DailyView({ filteredData, date, onProviderClick }: DailyViewProps) {
  return (
    <div className="space-y-8">
      {filteredData.map((dept) => (
        <Card key={dept.department} className="p-5 shadow-lg bg-card/95">
          
          {/* Department Header */}
          <h2 className="text-lg font-semibold mb-4 text-primary">
            {dept.department}
          </h2>

          <div className="space-y-6">
            {dept.providers.map((prov) => {
              
              const isToday = isSameDay(date, startOfToday())
              const filteredAppointments = isToday ? prov.appointments : []

              return (
                <div
                  key={prov.name}
                  className="p-4 border border-border rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6 cursor-pointer hover:bg-muted/30 transition"
                  onClick={() => {
                    onProviderClick({ ...prov, department: dept.department })
                  }}
                >

                  {/* SECTION 1 — Provider Info */}
                  <div className="space-y-2">
                    <p className="text-base font-semibold">{prov.name}</p>

                    <p className="text-sm text-muted-foreground">
                      Shift: {prov.availability.join(", ")}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {format(date, "EEEE, MMM d")}
                    </p>

                    {/* Daily Appointments */}
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
                        <p className="text-xs italic text-muted-foreground">
                          No visits on this day
                        </p>
                      )}
                    </div>
                  </div>

                  {/* SECTION 2 — Dept / Clinic */}
                  <div className="space-y-2 text-sm">
                    <p className="text-xs font-semibold uppercase text-primary">
                      Department
                    </p>
                    <p>{dept.department}</p>

                    <p className="text-xs font-semibold uppercase text-primary mt-2">
                      Office Location
                    </p>
                    <p className="text-muted-foreground">
                      {prov.officeLocation ?? "Not Available"}
                    </p>
                  </div>

                  {/* SECTION 3 — Contacts */}
                  <div className="space-y-2 text-sm md:text-right">
                    <p className="text-xs font-semibold uppercase text-primary">
                      Contact Details
                    </p>

                    {prov.contactSchedulerOnly ? (
                      <p className="text-muted-foreground">
                        Scheduler Only: {prov.contactSchedulerOnly}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic">No scheduler line</p>
                    )}

                    {prov.publicContact && (
                      <p className="text-muted-foreground">
                        Patient Line: {prov.publicContact}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ))}
    </div>
  )
}