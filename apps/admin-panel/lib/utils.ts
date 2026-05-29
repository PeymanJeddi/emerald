export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const SITE_NAME = "Emerald Scholars Congress";
export const SITE_SHORT = "Emerald Scholars";
