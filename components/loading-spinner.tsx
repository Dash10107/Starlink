import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  label?: string
}

export default function LoadingSpinner({ label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px]" aria-live="polite">
      <Loader2 className="h-10 w-10 text-blue-400 animate-spin mb-4" />
      <p className="text-blue-400">{label}</p>
    </div>
  )
}
