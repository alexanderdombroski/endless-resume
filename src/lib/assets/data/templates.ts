import type { Resume } from "$lib/schemas";

type ResumeTemplate = Omit<Resume, "_id" | "createdAt" | "updatedAt" | "font" | "spacing"> & {
  template: string;
};

export const templates: ResumeTemplate[] = [
  {
    template: "traditional-professional",
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
    template: "student-early-career",
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
    template: "experienced-professional",
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
