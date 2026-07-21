import type { InvestigationFilesByBox } from '@/src/lib/domain/types'

import { fetcher } from '../core/fetcher'
import { asArray } from '../core/json'
import { toInvestigationFilesByBox } from '../mappers/investigation'

export const casesApi = {
  getData: () => fetcher('/casos'),
  listFiles: (): Promise<InvestigationFilesByBox[]> =>
    fetcher('/casos/arquivos').then((res) =>
      asArray(res.boxes).map(toInvestigationFilesByBox),
    ),
}
