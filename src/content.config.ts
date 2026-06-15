import { defineCollection } from "astro:content";
import { csvLoader } from "@ascorbic/csv-loader";
import { z } from 'astro/zod';

const records = defineCollection({
  loader: csvLoader({
    fileName: "src/data/HNC.csv",
  }),
  schema: z.object({
    id: z.number(),
    table: z.string(),
    diagnosisYear: z.number(),
    ageSpecificIncidence0to49: z.number()
  }),
});

export const collections = { records };