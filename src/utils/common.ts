import { globalI18n } from 'boot/i18n';

export const i18nSubPath =
  (baseName: string) =>
    (relativePath: string, data?: Record<string, unknown>) => {
      if (data) {
        return globalI18n.t(`${baseName}.${relativePath}`, data);
      } else {
        return globalI18n.t(`${baseName}.${relativePath}`);
      }
    };

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
