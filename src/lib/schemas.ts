import { z } from "zod";

/** Projects, Awards, Certifications, etc */
export const StructuredEntry = z.object({
  type: z.literal("structured"),
  heading: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bullets: z.array(z.string())
});

/** Education, Experience, etc */
export const TimelineEntry = StructuredEntry.extend({
  type: z.literal("timeline"),
  subheading: z.string(),
  location: z.string().optional()
});

/** Skills, etc */
export const ListEntry = z.object({
  type: z.literal("list"),
  heading: z.string().optional(),
  items: z.array(z.string())
});

export const TextEntry = z.object({
  type: z.literal("text"),
  heading: z.string().optional(),
  content: z.string()
});

export const SubSectionSchema = z.discriminatedUnion("type", [
  TimelineEntry,
  StructuredEntry,
  ListEntry,
  TextEntry
]);

const SectionTypes = SubSectionSchema.options.map((schema) => schema.shape.type.value);

export const SectionSchema = z.object({
  type: z.enum(SectionTypes),
  title: z.string(),
  entries: z.array(SubSectionSchema)
});

export const ResumeSchema = z.object({
  _id: z.string(),
  title: z.string(),
  subtitle: z.array(
    z.object({
      label: z.string(),
      value: z.string()
    })
  ),
  sections: z.array(SectionSchema),
  spacing: z.object({
    bullet: z.number().positive(),
    section: z.number().positive()
  }),
  font: z.object({
    family: z.string(),
    sizes: z.object({
      title: z.number().positive(),
      heading: z.number().positive(),
      bullet: z.number().positive()
    })
  }),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Resume = z.infer<typeof ResumeSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type SectionType = (typeof SectionTypes)[number];
export type SubSection = z.infer<typeof SubSectionSchema>;
