import crypto from "crypto";

type GenerateSlugOptions = {
  maxLength?: number;
  fallbackRandomSuffix?: boolean;
  separator?: string;
};
export const generateSlug = (
  value: string,
  options: GenerateSlugOptions = {},
) => {
  const {
    maxLength = 80,
    fallbackRandomSuffix = true,
    separator = "-",
  } = options;

  const normalized = (value ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "");

  let slug = normalized
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    // convert spaces to separator
    .replace(/\s+/g, separator)
    // collapse multiple separators
    .replace(new RegExp(`${separator}+`, "g"), separator)
    // trim separators from ends
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), "");

  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(new RegExp(`${separator}$`), "");
  }

  if (!slug && fallbackRandomSuffix) {
    const suffix = crypto.randomBytes(4).toString("hex");
    slug = `item-${suffix}`;
  }

  return slug;
};

export const generateUniqueSlug = async (
  baseText: string,
  exists: (slug: string) => Promise<boolean>,
  options: GenerateSlugOptions = {},
) => {
  const baseSlug = generateSlug(baseText, options);

  let candidate = baseSlug;
  let counter = 2;

  while (await exists(candidate)) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return candidate;
};
