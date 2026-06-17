/**
 * Brand theme selection. Pick the active site theme by setting
 * NEXT_PUBLIC_BRAND_THEME to one of BRAND_THEMES (defaults to 'teal').
 * Each value maps to a [data-brand="..."] palette in globals.css.
 */
export const BRAND_THEMES = ['teal', 'emerald', 'azure', 'indigo', 'amber'] as const

export type BrandTheme = (typeof BRAND_THEMES)[number]

export const BRAND_THEME_LABELS: Record<BrandTheme, string> = {
  teal: 'Forest & Sky',
  emerald: 'Emerald',
  azure: 'Azure',
  indigo: 'Indigo AI',
  amber: 'Sunrise',
}

export const DEFAULT_BRAND_THEME: BrandTheme = 'teal'

export function getActiveBrandTheme(): BrandTheme {
  const value = process.env.NEXT_PUBLIC_BRAND_THEME as BrandTheme | undefined
  return value && BRAND_THEMES.includes(value) ? value : DEFAULT_BRAND_THEME
}
