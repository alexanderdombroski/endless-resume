import type { Resume } from "../src/lib/schemas";
import { MongoClient, ObjectId } from "mongodb";

// nub --env-file=.env scripts/insertTestResume.ts

const email = "test@example.com";
const password = "password";

type TestResume = Omit<Resume, "_id"> & {
  _id: ObjectId;
};

const resume: TestResume = {
  _id: new ObjectId("686d8b3d5b6c1d2e3f4a5b6c"),
  user_id: "", // Override later
  title: "Software Engineer Resume",
  subtitle: [
    { label: "Email", value: "test@example.com" },
    { label: "Phone", value: "(415) 555-2671" },
    { label: "LinkedIn", value: "linkedin.com/in/example" }
  ],
  sections: [
    {
      type: "text",
      title: "Professional Summary",
      entries: [
        {
          type: "text",
          heading: "",
          content:
            "Results-driven Software Engineer with 4+ years of experience specializing in building responsive, state-of-the-art web applications. Proven track record in optimizing web performance and deploying scalable frontend architectures."
        }
      ]
    },
    {
      type: "timeline",
      title: "Work Experience",
      entries: [
        {
          type: "timeline",
          heading: "Senior Software Engineer",
          subheading: "Tech Innovations Inc.",
          location: "San Francisco, CA",
          startDate: "2022-03",
          endDate: "Present",
          bullets: [
            "Led the migration of a legacy monolithic frontend to SvelteKit, increasing page load speed by 45%.",
            "Implemented an automated CI/CD pipeline reducing release cycle times by 30%.",
            "Collaborated with product designers to build a reusable component library following accessibility guidelines."
          ]
        }
      ]
    },
    {
      type: "timeline",
      title: "Education",
      entries: [
        {
          type: "timeline",
          heading: "B.S. in Computer Science",
          subheading: "Stanford University",
          location: "Stanford, CA",
          startDate: "2018-09",
          endDate: "2022-06",
          bullets: []
        }
      ]
    },
    {
      type: "structured",
      title: "Projects",
      entries: [
        {
          type: "structured",
          heading: "Tailored Resume Builder",
          startDate: "2023-05",
          endDate: "2023-11",
          bullets: [
            "Architected a responsive single-page editor in Svelte 5 for editing multi-section documents.",
            "Designed schemas utilizing Zod to validate document state and font styles on the client-side."
          ]
        }
      ]
    },
    {
      type: "list",
      title: "Skills",
      entries: [
        {
          type: "list",
          heading: "",
          items: [
            "TypeScript",
            "JavaScript",
            "Svelte",
            "SvelteKit",
            "CSS/HTML",
            "Node.js",
            "REST APIs",
            "Git"
          ]
        }
      ]
    }
  ],
  spacing: {
    bullet: 4,
    section: 16
  },
  font: {
    family: "Inter",
    sizes: {
      title: 24,
      heading: 14,
      bullet: 10
    }
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function signInUser(email: string, password: string) {
  const baseUrl = getRequiredEnv("BETTER_AUTH_URL").replace(/\/$/, "");
  const endpoint = new URL("/api/auth/sign-in/email", baseUrl);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:5173"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Auth sign-in failed (${response.status}): ${body}`);
  }

  return (await response.json()) as {
    redirect: boolean;
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

async function main() {
  const { user } = await signInUser(email, password);

  const client = new MongoClient(process.env.DATABASE_URL!);
  await client.connect();

  try {
    const dbName = getRequiredEnv("DATABASE_NAME");
    const db = client.db(dbName);
    const resumes = db.collection<TestResume>("resumes");

    const result = await resumes.insertOne({ ...resume, user_id: user.id });

    console.log(
      JSON.stringify(
        {
          userId: user.id,
          email: user.email,
          resumeId: result.insertedId.toString()
        },
        null,
        2
      )
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
