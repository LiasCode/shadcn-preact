const cache = new Map<string, Intl.NumberFormat>();
export function getFormatter(locale?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions) {
  const key = JSON.stringify({ locale: locale?.toString(), options });
  let formatter = cache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    cache.set(key, formatter);
  }
  return formatter;
}
export function formatNumber(value: number | null, locale?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions) {
  return value == null ? "" : getFormatter(locale, options).format(value);
}
export function formatNumberValue(
  value: number | null,
  locale?: Intl.LocalesArgument,
  format?: Intl.NumberFormatOptions,
) {
  if (value == null) return "";
  return format ? formatNumber(value, locale, format) : formatNumber(value / 100, locale, { style: "percent" });
}