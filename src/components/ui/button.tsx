import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Fantasy themed variants
        mystical: "bg-gradient-mystical text-shadow-depth font-fantasy font-semibold border border-rune-glow/30 hover:border-rune-glow hover:shadow-lg hover:shadow-rune-glow/25 hover:scale-105",
        rune: "bg-card border-2 border-rune-glow text-rune-glow font-fantasy font-semibold hover:bg-rune-glow hover:text-shadow-depth hover:shadow-lg hover:shadow-rune-glow/40 mystical-glow rune-pulse",
        forge: "bg-gradient-forge text-shadow-depth font-fantasy font-semibold border border-forge-orange/30 hover:border-forge-orange hover:shadow-lg hover:shadow-forge-orange/25",
        portal: "bg-[hsl(var(--portal-gold))] text-background font-fantasy font-semibold border border-[hsl(var(--portal-gold))]/30 hover:border-[hsl(var(--portal-gold))] hover:shadow-lg hover:shadow-[hsl(var(--portal-gold))]/25 hover:brightness-110"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 py-3 text-base",
        icon: "h-10 w-10",
        hero: "h-14 rounded-lg px-12 py-4 text-lg"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
