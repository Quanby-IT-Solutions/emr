import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Provider, mockWeeklyAvailability } from "@/app/(dashboard)/dummy-data/dummy-providers"

interface WeeklyViewProps {
  provider: Provider & { department: string }
}

export function WeeklyView({ provider }: WeeklyViewProps) {
  const schedule = mockWeeklyAvailability[provider.name] ?? {}

  return (
    <Card className="shadow-lg bg-card/95 border border-border rounded-xl hover:shadow-xl transition">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Weekly Availability
        </CardTitle>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{provider.name}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{provider.department}</span>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-6">
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(schedule).map(([day, slots]) => (
            <div key={day} className="text-center bg-muted/20 rounded-lg p-3">
              <p className="font-semibold">{day}</p>
              <div className="flex flex-col gap-2 mt-2">
                {slots.length > 0 ? (
                  slots.map((slot) => (
                    <button
                      key={slot}
                      className="border rounded-lg py-2 text-sm hover:bg-primary/10 transition"
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <p className="text-muted-foreground text-xs italic">
                    No availability
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}