import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { getDb } from "$lib/db/mongo";
import { BETTER_AUTH_URL, BETTER_AUTH_SECRET } from "$env/static/private";

const db = await getDb();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true
  },

  plugins: [sveltekitCookies(getRequestEvent)],
  trustedOrigins: [
    "https://endlessresume.netlify.app/",
    "http://localhost:4173",
    "http://localhost:5173"
  ]
});
