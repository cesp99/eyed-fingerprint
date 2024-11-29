import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={`relative h-2 w-full overflow-hidden rounded-full bg-primary/20 ${className}`}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all"
      style={{ 
        transform: `translateX(-${100 - (value || 0)}%)`, 
        backgroundColor: '#C28DFF', // custom color for the indicator
      }}
    />
  </ProgressPrimitive.Root>
))

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
