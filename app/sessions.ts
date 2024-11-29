import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET || 'default_secret';

const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: 'modal-session-cookie',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    httpOnly: true,
  },
});

export { getSession, commitSession };
