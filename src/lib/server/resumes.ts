import { randomUUID } from "node:crypto";
import type { Resume } from "$lib/schemas";
import type { ResumeTemplate } from "$lib/assets/data/templates";
import { templates } from "$lib/assets/data/templates";

const DEFAULT_SPACING = { bullet: 1, section: 1.5 };
const DEFAULT_FONT = {
  family: "Inter",
  sizes: { title: 22, heading: 14, bullet: 11 }
};

const resumesByUser = new Map<string, Map<string, Resume>>();

function getUserStore(userId: string): Map<string, Resume> {
  let store = resumesByUser.get(userId);
  if (!store) {
    store = new Map();
    resumesByUser.set(userId, store);
  }
  return store;
}

function templateToResume(template: ResumeTemplate, title?: string): Resume {
  const now = new Date().toISOString();
  return {
    _id: randomUUID(),
    title: title ?? template.title,
    subtitle: template.subtitle,
    sections: template.sections,
    spacing: DEFAULT_SPACING,
    font: DEFAULT_FONT,
    createdAt: now,
    updatedAt: now
  };
}

function seed(userId: string) {
  const store = getUserStore(userId);
  const seeded = [
    templateToResume(templates[0], "Alex Morgan"),
    templateToResume(templates[1], "Jordan Rivera")
  ];
  for (const resume of seeded) {
    store.set(resume._id, resume);
  }
}

seed("mock-user-1");

export function listResumes(userId: string): Resume[] {
  return Array.from(getUserStore(userId).values());
}

export function getResume(userId: string, id: string): Resume | undefined {
  return getUserStore(userId).get(id);
}

export function createResume(userId: string, template: ResumeTemplate): Resume {
  const resume = templateToResume(template);
  getUserStore(userId).set(resume._id, resume);
  return resume;
}

export function deleteResume(userId: string, id: string): boolean {
  return getUserStore(userId).delete(id);
}
