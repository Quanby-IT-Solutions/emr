import { Clock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MedicationStepperProps {
  activeStep: "pending" | "administered"
  onStepChange: (step: "pending" | "administered") => void
  pendingCount?: number
}

export function MedicationStepper({ 
  activeStep, 
  onStepChange,
  pendingCount = 0 
}: MedicationStepperProps) {
  return (
    <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-lg border">
      {/* Pending Medications */}
      <button
        onClick={() => onStepChange("pending")}
        className={cn(
          "flex items-start gap-4 p-6 text-left transition-colors",
          "hover:bg-accent/50",
          activeStep === "pending" 
            ? "bg-blue-100 dark:bg-blue-850/30 border-r-2 border-blue-500" 
            : "bg-background border-r"
        )}
      >
        <div className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          activeStep === "pending"
            ? "bg-blue-500 text-white"
            : "bg-muted text-muted-foreground"
        )}>
          <Clock className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-semibold",
              activeStep === "pending" && "text-blue-600 dark:text-blue-400"
            )}>
              Pending Medications
            </h3>
            {pendingCount > 0 && (
              <span className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium",
                activeStep === "pending"
                  ? "bg-blue-600 text-white"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              )}>
                {pendingCount}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Review and administer pending medications
          </p>
        </div>
      </button>

      {/* Administered Records */}
      <button
        onClick={() => onStepChange("administered")}
        className={cn(
          "flex items-start gap-4 p-6 text-left transition-colors",
          "hover:bg-accent/50",
          activeStep === "administered" 
            ? "bg-green-50 dark:bg-green-950/30 border-l-2 border-green-500" 
            : "bg-background"
        )}
      >
        <div className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          activeStep === "administered"
            ? "bg-green-500 text-white"
            : "bg-muted text-muted-foreground"
        )}>
          <CheckCircle className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold mb-1",
            activeStep === "administered" && "text-green-600 dark:primary"
          )}>
            Medication Administration Records
          </h3>
          <p className="text-sm text-muted-foreground">
            View previously administered medications
          </p>
        </div>
      </button>
    </div>
  )
}