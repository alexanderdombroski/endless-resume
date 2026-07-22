import { describe, test, expect } from "vitest";
import { sanitizeRichText, isRichTextEmpty, sanitizeResumeSections } from "../../lib/rich-text";
import type { Section } from "../../lib/schemas";

describe("rich-text helpers", () => {
  describe("sanitizeRichText", () => {
    test("should allow valid formatting tags and strip attributes", () => {
      const input =
        '<p>This is <strong class="bold">bold</strong> and <em style="color: red;">emphasized</em>. <u>Underline</u> and <br /> breaks are allowed.</p>';
      const expected =
        "This is <strong>bold</strong> and <em>emphasized</em>. <u>Underline</u> and <br> breaks are allowed.";
      expect(sanitizeRichText(input)).toBe(expected);
    });

    test("should completely strip disallowed tags like script, div, span but leave content", () => {
      const input = "<div>Hello</div><script>alert('xss')</script><span>World</span>";
      const expected = "Helloalert('xss')World";
      expect(sanitizeRichText(input)).toBe(expected);
    });

    test("should keep text content of stripped tags", () => {
      const input = "<h1>Title</h1><p>Paragraph with <b>bold</b> text.</p>";
      const expected = "TitleParagraph with <b>bold</b> text.";
      expect(sanitizeRichText(input)).toBe(expected);
    });

    test("should handle self-closing allowed tags and strip attributes", () => {
      const input = "Line 1<br class='clear'/>Line 2";
      const expected = "Line 1<br>Line 2";
      expect(sanitizeRichText(input)).toBe(expected);
    });

    test("should return empty string if input is empty", () => {
      expect(sanitizeRichText("")).toBe("");
    });
  });

  describe("isRichTextEmpty", () => {
    test("should return true for empty string or whitespace", () => {
      expect(isRichTextEmpty("")).toBe(true);
      expect(isRichTextEmpty("   ")).toBe(true);
    });

    test("should return true for strings containing only br tags", () => {
      expect(isRichTextEmpty("<br>")).toBe(true);
      expect(isRichTextEmpty("<br/>")).toBe(true);
      expect(isRichTextEmpty("<br   />")).toBe(true);
      expect(isRichTextEmpty("  <br>  <br />  ")).toBe(true);
    });

    test("should return false for strings containing text or other tags", () => {
      expect(isRichTextEmpty("hello")).toBe(false);
      expect(isRichTextEmpty("hello <br>")).toBe(false);
      expect(isRichTextEmpty("<b></b>")).toBe(false);
    });
  });

  describe("sanitizeResumeSections", () => {
    test("should sanitize all fields across different entry types and preserve structure", () => {
      const dirtySections: Section[] = [
        {
          type: "text",
          title: "Profile",
          entries: [
            {
              type: "text",
              heading: "My <h1>Profile</h1>",
              content: "<p>I am a <script>malicious</script> <b>developer</b>.</p>"
            }
          ]
        },
        {
          type: "list",
          title: "Skills",
          entries: [
            {
              type: "list",
              heading: "Languages <div>subset</div>",
              items: ["TypeScript <script>alert(1)</script>", "<b>Rust</b> <i>programming</i>"]
            }
          ]
        },
        {
          type: "timeline",
          title: "Experience",
          entries: [
            {
              type: "timeline",
              heading: "Software Engineer at <h1>Company</h1>",
              subheading: "<b>DevOps</b> <span>Team</span>",
              location: "Remote",
              bullets: [
                "Wrote <u>awesome</u> code.",
                "Optimized <script>unsafe</script> database queries."
              ]
            }
          ]
        },
        {
          type: "structured",
          title: "Projects",
          entries: [
            {
              type: "structured",
              heading: "Open Source <h1>Project</h1>",
              bullets: ["Fixed <p>bugs</p> and implemented <br> features."]
            }
          ]
        }
      ];

      const sanitized = sanitizeResumeSections(dirtySections);

      // Verify Text Entry
      expect(sanitized[0].entries[0]).toEqual({
        type: "text",
        heading: "My Profile",
        content: "I am a malicious <b>developer</b>."
      });

      // Verify List Entry
      expect(sanitized[1].entries[0]).toEqual({
        type: "list",
        heading: "Languages subset",
        items: ["TypeScript alert(1)", "<b>Rust</b> <i>programming</i>"]
      });

      // Verify Timeline Entry
      expect(sanitized[2].entries[0]).toEqual({
        type: "timeline",
        heading: "Software Engineer at Company",
        subheading: "<b>DevOps</b> Team",
        location: "Remote",
        bullets: ["Wrote <u>awesome</u> code.", "Optimized unsafe database queries."]
      });

      // Verify Structured Entry
      expect(sanitized[3].entries[0]).toEqual({
        type: "structured",
        heading: "Open Source Project",
        bullets: ["Fixed bugs and implemented <br> features."]
      });
    });

    test("should handle missing heading in text and list entries", () => {
      const sections: Section[] = [
        {
          type: "text",
          title: "Summary",
          entries: [
            {
              type: "text",
              content: "Plain content"
            }
          ]
        },
        {
          type: "list",
          title: "Interests",
          entries: [
            {
              type: "list",
              items: ["Gaming", "Hiking"]
            }
          ]
        }
      ];

      const sanitized = sanitizeResumeSections(sections);
      expect(sanitized[0].entries[0].heading).toBeUndefined();
      expect(sanitized[1].entries[0].heading).toBeUndefined();
    });
  });
});
