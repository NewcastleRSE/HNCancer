import { defineCollection } from 'astro:content'

// No-op collection signals Astro to skip auto-discovering
// content collections in src/content/ subdirectories
export const collections = {
  _noop: defineCollection({ loader: () => [] }),
}
