import { DateTime } from 'luxon'

import PackageJson from 'app/package.json'
import type { ReportSkuDto } from 'src/utils/requests/types'
import { useSettingsStore } from 'stores/settings'

export const acceptSku = (
  begin: DateTime,
  count: number | undefined,
  modelName: string,
  projectId: string,
): ReportSkuDto => ({
  begin: Math.floor(begin.toMillis() / 1000),
  end: Math.floor(DateTime.now().toMillis() / 1000),
  count: count ?? 0,
  type: 'AIGC',
  product: 'WORD',
  firstClass: 'CODE',
  secondClass: modelName,
  skuName: 'KEEP',
  user: useSettingsStore().username,
  userType: 'USER',
  extra: PackageJson.version,
  subType: projectId,
})

export const generateSku = (
  begin: DateTime,
  count: number | undefined,
  modelName: string,
  projectId: string,
): ReportSkuDto => ({
  begin: Math.floor(begin.toMillis() / 1000),
  end: Math.floor(DateTime.now().toMillis() / 1000),
  count: count ?? 0,
  type: 'AIGC',
  product: 'WORD',
  firstClass: 'CODE',
  secondClass: modelName,
  skuName: 'GENE',
  user: useSettingsStore().username,
  userType: 'USER',
  extra: PackageJson.version,
  subType: projectId,
})
