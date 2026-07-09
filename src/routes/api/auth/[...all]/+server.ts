// This is necessary so better auth endpoints are not prerendered
import { auth } from "$lib/auth/auth";
import type { RequestHandler } from "./$types";

const handler: RequestHandler = ({ request }) => auth.handler(request);

export const GET = handler;
export const POST = handler;
