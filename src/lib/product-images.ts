import type { StaticImageData } from "next/image"

import box01 from "@/src/assets/images/products/box-01.jpg"
import box02 from "@/src/assets/images/products/box-02.jpg"
import box03 from "@/src/assets/images/products/box-03.jpg"
import box04 from "@/src/assets/images/products/box-04.jpg"

const productImages: Record<string, StaticImageData> = {
  "products/box-01.jpg": box01,
  "products/box-02.jpg": box02,
  "products/box-03.jpg": box03,
  "products/box-04.jpg": box04,
}

export function getProductImage(path: string): StaticImageData | undefined {
  return productImages[path]
}
