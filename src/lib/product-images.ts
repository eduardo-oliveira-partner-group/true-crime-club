import type { StaticImageData } from 'next/image'

import archiveBox01 from '@/src/assets/images/design-sugerido/box-01.png'
import archiveBox02 from '@/src/assets/images/design-sugerido/box-02.png'
import archiveBox03 from '@/src/assets/images/design-sugerido/box-03.png'
import archiveBox04 from '@/src/assets/images/design-sugerido/box-04.png'
import worldCupEdition from '@/src/assets/images/design-sugerido/edicao-copa.png'
import box01 from '@/src/assets/images/products/box-01.jpg'
import box02 from '@/src/assets/images/products/box-02.jpg'
import box03 from '@/src/assets/images/products/box-03.jpg'
import box04 from '@/src/assets/images/products/box-04.jpg'

const productImages: Record<string, StaticImageData> = {
  'design-sugerido/box-01.png': archiveBox01,
  'design-sugerido/box-02.png': archiveBox02,
  'design-sugerido/box-03.png': archiveBox03,
  'design-sugerido/box-04.png': archiveBox04,
  'products/box-01.jpg': box01,
  'products/box-02.jpg': box02,
  'products/box-03.jpg': box03,
  'products/box-04.jpg': box04,
  'design-sugerido/edicao-copa.png': worldCupEdition,
}

export function getProductImage(path: string): StaticImageData | undefined {
  return productImages[path]
}
