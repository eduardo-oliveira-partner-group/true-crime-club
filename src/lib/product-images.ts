import type { StaticImageData } from "next/image"

import caixa01 from "@/src/assets/images/boxes/caixa-01.jpeg"
import caixa02 from "@/src/assets/images/boxes/caixa-02.jpeg"
import caixa03 from "@/src/assets/images/boxes/caixa-03.jpg"
import caixa04 from "@/src/assets/images/boxes/caixa-04.jpg"

const productImages: Record<string, StaticImageData> = {
  "boxes/caixa-01.jpeg": caixa01,
  "boxes/caixa-02.jpeg": caixa02,
  "boxes/caixa-03.jpg": caixa03,
  "boxes/caixa-04.jpg": caixa04,
}

export function getProductImage(path: string): StaticImageData | undefined {
  return productImages[path]
}
