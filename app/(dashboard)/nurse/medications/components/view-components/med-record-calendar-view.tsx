import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

// --- Interface Definitions ---
export interface CalendarAdministration {
  date: string
  time: string
  status: 'taken' | 'refused'
  administeringNurse?: string
  nurseNotes?: string
  medicationName?: string
  dosageAdministered?: string
  classification?: string
}

export interface CalendarMedication {
  medicationGenericName: string
  dosage: string
  schedule: string
  discontinuedDate?: string
  administrations: CalendarAdministration[]
  classification?: string
}

type ViewType = "daily" | "weekly" | "monthly"
// --------------------------------------------------------

interface MedRecordCalendarViewProps {
  transformedMedicationOrders: CalendarMedication[]
  onRecordClick: (record: CalendarAdministration) => void // New Prop
}

const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay()) // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }
  
  const getDailyHours = () => {
    const hours = []
    for (let i = 0; i < 24; i++) {
      hours.push(i)
    }
    return hours
  }
  
  const getMonthDates = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const lastDay = new Date(year, month + 1, 0)
    const dates = []
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(new Date(year, month, i))
    }
    return dates
  }
  
  const formatTime = (timeStr: string): string => {
    const match = timeStr.match(/(\d{1,2}):?(\d{2})/)
    if (match) {
      const hours = match[1].padStart(2, '0')
      const minutes = match[2]
      return `${hours}:${minutes}`
    }
    return timeStr
  }

export function MedRecordCalendarView({ transformedMedicationOrders, onRecordClick }: MedRecordCalendarViewProps) {
  const [viewType, setViewType] = useState<ViewType>("weekly")
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [currentDay, setCurrentDay] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeek(newDate)
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDay)
    newDate.setDate(currentDay.getDate() + (direction === 'next' ? 1 : -1))
    setCurrentDay(newDate)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentMonth(newDate)
  }

  const { dates, displayRange } = useMemo(() => {
    let dates: Date[] = []
    let displayRange = ''

    if (viewType === 'daily') {
      dates = [currentDay]
      displayRange = currentDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } else if (viewType === 'weekly') {
      dates = getWeekDates(currentWeek)
      displayRange = `${dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    } else { 
      dates = getMonthDates(currentMonth)
      displayRange = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    return { dates, displayRange }
  }, [viewType, currentWeek, currentDay, currentMonth])

  const dailyHours = getDailyHours()

  const getAdministrationForDate = (medication: CalendarMedication, date: Date) => {
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    return medication.administrations.filter((admin) => admin.date === dateStr)
  }

  const getAdministrationForHour = (medication: CalendarMedication, date: Date, hour: number) => {
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    return medication.administrations.filter((admin) => {
      if (admin.date !== dateStr) return false
      const timeMatch = admin.time.match(/(\d{1,2}):?(\d{2})/)
      if (timeMatch) {
        const adminHour = parseInt(timeMatch[1])
        return adminHour === hour
      }
      return false
    })
  }

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (viewType === 'daily') navigateDay(direction)
    else if (viewType === 'weekly') navigateWeek(direction)
    else navigateMonth(direction)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => handleNavigate('prev')} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-semibold text-lg min-w-[200px] text-center">{displayRange}</div>
              <Button variant="outline" size="icon" onClick={() => handleNavigate('next')} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant={viewType === "daily" ? "default" : "outline"} size="sm" onClick={() => setViewType("daily")}>Daily</Button>
              <Button variant={viewType === "weekly" ? "default" : "outline"} size="sm" onClick={() => setViewType("weekly")}>Weekly</Button>
              <Button variant={viewType === "monthly" ? "default" : "outline"} size="sm" onClick={() => setViewType("monthly")}>Monthly</Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="text-left p-3 font-semibold text-sm min-w-[200px] sticky left-0 bg-gray-100 z-10">Medications</th>
                    {viewType === 'daily' && dailyHours.map((hour) => (
                      <th key={hour} className="text-center p-3 font-semibold text-sm min-w-20 border-l">
                         <div>{hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour-12}pm`}</div>
                      </th>
                    ))}
                    {viewType === 'weekly' && dates.map((date, idx) => (
                      <th key={idx} className="text-center p-3 font-semibold text-sm min-w-[120px] border-l">
                        <div className="font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-xs font-normal">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </th>
                    ))}
                    {viewType === 'monthly' && dates.map((date, idx) => (
                      <th key={idx} className="text-center p-3 font-semibold text-sm min-w-[70px] border-l">
                        <div className="text-xs">{date.getDate()}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transformedMedicationOrders.map((medication, medIdx) => (
                    <tr key={medIdx} className="border-b hover:bg-gray-50">
                      <td className="p-3 align-top sticky left-0 bg-white">
                        <div className="space-y-1">
                          <div className="font-semibold text-sm">{medication.medicationGenericName}</div>
                          <div className="text-xs text-muted-foreground">{medication.dosage}</div>
                          <div className="text-xs text-muted-foreground">{medication.schedule}</div>
                          {medication.discontinuedDate && (
                            <Badge variant="outline" className="text-xs">D/C: {medication.discontinuedDate}</Badge>
                          )}
                        </div>
                      </td>
                      {(viewType === 'daily' ? dailyHours : dates).map((item, colIdx) => {
                        const dateForCell = viewType === 'daily' ? currentDay : (item as Date)
                        const administrations = viewType === 'daily'
                          ? getAdministrationForHour(medication, dateForCell, item as number)
                          : getAdministrationForDate(medication, item as Date)

                        const discontinuedDate = medication.discontinuedDate ? new Date(medication.discontinuedDate) : null
                        const isAfterDiscontinued = discontinuedDate && dateForCell > discontinuedDate

                        return (
                          <td key={colIdx} className={`p-2 align-top border-l ${isAfterDiscontinued ? 'bg-gray-100' : ''}`}>
                            <div className={`space-y-1 ${viewType === 'monthly' ? 'flex flex-col gap-1' : ''}`}>
                              {administrations.map((administration, adminIdx) => (
                                <div
                                  key={adminIdx}
                                  onClick={() => onRecordClick(administration)}
                                  className={`p-1 rounded text-center cursor-pointer hover:opacity-80 transition-opacity ${
                                    viewType === 'monthly' ? 'text-[10px]' : 'text-xs p-2'
                                  } ${
                                    administration.status === 'taken'
                                      ? 'bg-green-500 text-white'
                                      : 'bg-red-500 text-white'
                                  }`}
                                >
                                  <div className="font-semibold">{formatTime(administration.time)}</div>
                                  {viewType !== 'monthly' && (
                                    <div className="text-[10px] mt-1">
                                      {administration.status === 'taken' ? 'Taken' : 'Refused'}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Legend code remains same */}
          <div className="flex items-center justify-center gap-6 text-sm bg-gray-50 p-3 rounded border">
             <p className="text-muted-foreground">Legend:</p>
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 bg-green-500 rounded"></div>
               <span>Taken</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 bg-red-500 rounded"></div>
               <span>Refused/Not Taken</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}