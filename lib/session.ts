'use server'
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionData {
  username: string,
  prev_cursors: string[]
}

const sessionOptions = {
  password: process.env.SESSION_PASSWORD,
  cookieName: 'fincent_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production
  },
};

const defaultSession: SessionData = {
  username: 'tester',
  prev_cursors: []
}

async function getSession() {
  const session = await getIronSession(cookies(), sessionOptions)
  if (!session.prev_cursors) {
    session.prev_cursors = []
  }
  return session
}

async function addPrevCursor(cursor: string) {
  const session = await getIronSession(cookies(), sessionOptions)
  if (!session.prev_cursors) {
    session.prev_cursors = defaultSession.prev_cursors
  }
  session.prev_cursors.push(cursor)
  await session.save()
  return session
}

async function clearCursors() {
  const session = await getIronSession(cookies(), sessionOptions)
  if (!session.prev_cursors) {
    session.prev_cursors = defaultSession.prev_cursors
  }
  session.prev_cursors = []
  await session.save()
  return session;
}

function testCursor() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(1)
    }, 2000)
  })
}

export {
  getSession,
  clearCursors,
  addPrevCursor,
  testCursor,
  SessionData
}