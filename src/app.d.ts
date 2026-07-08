// src/app.d.ts
import type { auth } from "$lib/auth/auth";

type Session = typeof auth.$Infer.Session.session;
type User = typeof auth.$Infer.Session.user;

declare global {
  namespace App {
    interface Locals {
      session: Session | null;
      user: User | null;
    }
  }
}

export {};
