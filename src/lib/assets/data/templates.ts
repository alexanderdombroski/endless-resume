import type { Resume } from "$lib/schemas";

export type ResumeTemplate = Omit<
  Resume,
  "_id" | "createdAt" | "updatedAt" | "font" | "spacing" | "user_id"
> & {
  template: string;
  summary: string;
  audience: string;
  tags: string[];
};

export const templates: ResumeTemplate[] = [
  {
    template: "Traditional Professional",
    summary:
      "A classic chronological layout that prioritizes clean formatting, structural clarity, and readability. It places your core profile on top and walks through traditional history blocks.",
    audience:
      "Ideal for established professionals in corporate, legal, or traditional industries where standard, robust layouts are standard.",
    tags: ["Classic", "Chronological", "Corporate", "Clean"],
    title: "Your Name",
    subtitle: [
      { label: "Email", value: "" },
      { label: "Phone", value: "" },
      { label: "Location", value: "" },
      { label: "LinkedIn", value: "" }
    ],
    sections: [
      {
        type: "text",
        title: "Professional Summary",
        entries: [
          {
            type: "text",
            content: ""
          }
        ]
      },
      {
        type: "timeline",
        title: "Experience",
        entries: [
          {
            type: "timeline",
            heading: "Position Title",
            subheading: "Company Name",
            location: "",
            startDate: "",
            endDate: "",
            bullets: ["", ""]
          }
        ]
      },
      {
        type: "timeline",
        title: "Education",
        entries: [
          {
            type: "timeline",
            heading: "Degree",
            subheading: "Institution",
            location: "",
            startDate: "",
            endDate: "",
            bullets: ["", ""]
          }
        ]
      },
      {
        type: "list",
        title: "Skills",
        entries: [
          {
            type: "list",
            items: ["", "", ""]
          }
        ]
      },
      {
        type: "structured",
        title: "Projects",
        entries: [
          {
            type: "structured",
            heading: "Project Name",
            startDate: "",
            endDate: "",
            bullets: ["", ""]
          }
        ]
      }
    ]
  },
  {
    template: "Student & Early Career",
    summary:
      "A layout crafted to highlight academic milestones, skills, and personal coding or design projects before professional experience. It moves education to the top page focal point.",
    audience:
      "Perfect for students, recent graduates, or career changers who want to emphasize hands-on projects and skill acquisition.",
    tags: ["Academic", "Project-focused", "Modern", "Teal Accent"],
    title: "Your Name",
    subtitle: [
      { label: "Email", value: "" },
      { label: "Phone", value: "" },
      { label: "Location", value: "" },
      { label: "Portfolio", value: "" }
    ],
    sections: [
      {
        type: "timeline",
        title: "Education",
        entries: [
          {
            type: "timeline",
            heading: "Degree or Program",
            subheading: "School Name",
            location: "",
            startDate: "",
            endDate: "",
            bullets: ["", ""]
          }
        ]
      },
      {
        type: "structured",
        title: "Projects",
        entries: [
          {
            type: "structured",
            heading: "Project Name",
            startDate: "",
            endDate: "",
            bullets: ["", ""]
          }
        ]
      },
      {
        type: "timeline",
        title: "Experience",
        entries: [
          {
            type: "timeline",
            heading: "Role",
            subheading: "Organization",
            location: "",
            startDate: "",
            endDate: "",
            bullets: ["", ""]
          }
        ]
      },
      {
        type: "list",
        title: "Skills",
        entries: [
          {
            type: "list",
            items: ["", "", "", ""]
          }
        ]
      },
      {
        type: "structured",
        title: "Activities & Leadership",
        entries: [
          {
            type: "structured",
            heading: "Activity or Organization",
            bullets: ["", ""]
          }
        ]
      }
    ]
  },
  {
    template: "Experienced Professional",
    summary:
      "An executive-grade template featuring a comprehensive professional summary profile and structured listings for multi-stage career timelines, key certifications, and awards.",
    audience:
      "Best for senior engineers, managers, directors, or general executives with a deep history of accomplishments and credentials.",
    tags: ["Executive", "High-density", "Multi-page-ready", "Indigo Accent"],
    title: "Your Name",
    subtitle: [
      { label: "Email", value: "" },
      { label: "Phone", value: "" },
      { label: "Location", value: "" },
      { label: "LinkedIn", value: "" },
      { label: "Website", value: "" }
    ],
    sections: [
      {
        type: "structured",
        title: "Executive Summary",
        entries: [
          {
            type: "structured",
            heading: "Professional Profile",
            bullets: ["", ""]
          }
        ]
      },
      {
        type: "timeline",
        title: "Professional Experience",
        entries: [
          {
            type: "timeline",
            heading: "Current or Recent Position",
            subheading: "Company",
            location: "",
            startDate: "",
            endDate: "",
            bullets: ["", ""]
          },
          {
            type: "timeline",
            heading: "Previous Position",
            subheading: "Company",
            location: "",
            startDate: "",
            endDate: "",
            bullets: ["", ""]
          }
        ]
      },
      {
        type: "list",
        title: "Core Skills",
        entries: [
          {
            type: "list",
            items: ["", "", "", "", ""]
          }
        ]
      },
      {
        type: "structured",
        title: "Certifications",
        entries: [
          {
            type: "structured",
            heading: "Certification Name",
            startDate: "",
            endDate: "",
            bullets: ["", ""]
          }
        ]
      },
      {
        type: "structured",
        title: "Awards & Recognition",
        entries: [
          {
            type: "structured",
            heading: "Award Name",
            bullets: ["", ""]
          }
        ]
      },
      {
        type: "timeline",
        title: "Education",
        entries: [
          {
            type: "timeline",
            heading: "Degree",
            subheading: "Institution",
            location: "",
            startDate: "",
            endDate: "",
            bullets: ["", ""]
          }
        ]
      }
    ]
  }
];
