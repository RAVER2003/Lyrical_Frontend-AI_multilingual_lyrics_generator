export type AuthUser = {
  id: string
  name: string
  email: string
}

type StoredUser = AuthUser & {
  password: string
}

type LoginInput = {
  email: string
  password: string
}

type SignupInput = {
  name: string
  email: string
  password: string
}

const usersStorageKey = "lyrical-auth-users"
const sessionStorageKey = "lyrical-auth-session"

const seedUsers: StoredUser[] = [
  {
    id: "seed-user-1",
    name: "Demo Listener",
    email: "demo@lyrical.app",
    password: "Demo@123",
  },
]

function delay(ms = 650) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") {
    return seedUsers
  }

  const stored = window.localStorage.getItem(usersStorageKey)
  if (!stored) {
    window.localStorage.setItem(usersStorageKey, JSON.stringify(seedUsers))
    return seedUsers
  }

  try {
    const parsed = JSON.parse(stored) as StoredUser[]
    return parsed.length > 0 ? parsed : seedUsers
  } catch {
    window.localStorage.setItem(usersStorageKey, JSON.stringify(seedUsers))
    return seedUsers
  }
}

function writeUsers(users: StoredUser[]) {
  window.localStorage.setItem(usersStorageKey, JSON.stringify(users))
}

function toPublicUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

export function getStoredSession() {
  if (typeof window === "undefined") {
    return null
  }

  const stored = window.localStorage.getItem(sessionStorageKey)
  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as AuthUser
  } catch {
    window.localStorage.removeItem(sessionStorageKey)
    return null
  }
}

export async function userExists(email: string) {
  await delay(300)
  const normalizedEmail = normalizeEmail(email)
  return readUsers().some((user) => user.email === normalizedEmail)
}

export async function login(input: LoginInput) {
  await delay()
  const normalizedEmail = normalizeEmail(input.email)
  const user = readUsers().find((entry) => entry.email === normalizedEmail)

  if (!user || user.password !== input.password) {
    throw new Error("Invalid email or password.")
  }

  const publicUser = toPublicUser(user)
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(publicUser))
  return publicUser
}

export async function signup(input: SignupInput) {
  await delay()
  const normalizedEmail = normalizeEmail(input.email)
  const users = readUsers()

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("An account with this email already exists.")
  }

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: normalizedEmail,
    password: input.password,
  }

  writeUsers([...users, newUser])
  return toPublicUser(newUser)
}

export function logout() {
  window.localStorage.removeItem(sessionStorageKey)
}
