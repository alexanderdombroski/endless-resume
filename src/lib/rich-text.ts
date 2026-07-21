import type { Section } from "./schemas";

const ALLOWED_TAGS = new Set(["b", "strong", "i", "em", "u", "br"]);

export function sanitizeRichText(html: string): string {
  return html.replace(/<\/?([a-zA-Z0-9]+)[^>]*>/g, (match, tagName: string) => {
    const tag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    return match.startsWith("</") ? `</${tag}>` : `<${tag}>`;
  });
}

export function isRichTextEmpty(html: string): boolean {
  return html.replace(/<br\s*\/?>/gi, "").trim() === "";
}

export function sanitizeResumeSections(sections: Section[]): Section[] {
  return sections.map((section) => ({
    ...section,
    entries: section.entries.map((entry) => {
      switch (entry.type) {
        case "text":
          return {
            ...entry,
            heading: entry.heading !== undefined ? sanitizeRichText(entry.heading) : entry.heading,
            content: sanitizeRichText(entry.content)
          };
        case "list":
          return {
            ...entry,
            heading: entry.heading !== undefined ? sanitizeRichText(entry.heading) : entry.heading,
            items: entry.items.map(sanitizeRichText)
          };
        case "timeline":
          return {
            ...entry,
            heading: sanitizeRichText(entry.heading),
            subheading: sanitizeRichText(entry.subheading),
            bullets: entry.bullets.map(sanitizeRichText)
          };
        case "structured":
          return {
            ...entry,
            heading: sanitizeRichText(entry.heading),
            bullets: entry.bullets.map(sanitizeRichText)
          };
        default:
          return entry;
      }
    })
  }));
}
