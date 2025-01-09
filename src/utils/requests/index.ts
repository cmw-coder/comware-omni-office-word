import axios from 'axios'

import type { ReportSkuDto } from 'src/utils/requests/types'
import { useSettingsStore } from 'stores/settings'

export const reportSku = async (data: ReportSkuDto[]) => {
  try {
    console.debug(
      data
        .map(
          (item) =>
            `SKU 上报: ${item.extra} ${item.subType} ${item.type}.${item.product}.${item.firstClass}.${item.secondClass}.${item.skuName} [${item.count}]`,
        )
        .join('\n'),
    )
    await axios.post('/kong/RdTestResourceStatistic/report/summary', data, {
      baseURL: useSettingsStore().baseUrl,
    })
    return true
  } catch (e) {
    console.error('StatisticsReporter Failed', data, e)
    return false
  }
}
