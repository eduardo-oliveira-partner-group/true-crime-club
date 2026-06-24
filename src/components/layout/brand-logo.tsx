import Image from "next/image"

import logo from "@/src/assets/images/logo.png"
import { cn } from "@/src/lib/utils"

type BrandLogoProps = {
  className?: string
  priority?: boolean
}

export function BrandLogo({ className, priority }: BrandLogoProps) {
  return (
    <Image
      src={logo}
      alt="True Crime Club"
      className={cn("h-8 w-auto", className)}
      priority={priority}
    />
  )
}
