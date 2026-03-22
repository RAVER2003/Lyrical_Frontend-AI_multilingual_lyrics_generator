import { useState, type FormEvent } from "react"
import { ArrowRight, Headphones, Mic2, Radio, ShieldCheck, Sparkles, Stars, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"

type AuthMode = "login" | "signup"

type FormState = {
  fullName: string
  email: string
  password: string
}

const initialFormState: FormState = {
  fullName: "",
  email: "",
  password: "",
}

const highlights = [
  "Curated moods for every moment",
  "Fast artist discovery and smart playlists",
  "Private listening rooms for your crew",
]

const stats = [
  { label: "Daily sessions", value: "32K+" },
  { label: "Creator playlists", value: "4.8K" },
  { label: "Avg. joy score", value: "96%" },
]

function App() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [form, setForm] = useState<FormState>(initialFormState)
  const [message, setMessage] = useState("Sign in with the sample credentials or create a fresh demo account.")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const identity = mode === "login" ? "Welcome back" : "Account created"
    const name = mode === "signup" ? form.fullName || "Listener" : "Listener"
    const email = form.email || "demo@lyrical.app"

    setMessage(`${identity}, ${name}. Your demo session is ready for ${email}.`)
  }

  const isLogin = mode === "login"

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.2),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.16),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#0b1120_45%,_#111827_100%)]" />
      <div className="absolute left-[-10rem] top-[-6rem] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-[-8rem] right-[-3rem] h-80 w-80 rounded-full bg-fuchsia-400/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-[0_16px_40px_rgba(14,165,233,0.25)] backdrop-blur">
              <div className="relative">
                <Radio className="h-6 w-6 text-cyan-300" strokeWidth={1.8} />
                <Stars className="absolute -right-2 -top-2 h-3.5 w-3.5 text-amber-300" strokeWidth={2} />
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/75">Lyrical</p>
              <p className="text-sm text-slate-300">Sound that feels personal.</p>
            </div>
          </div>

          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur md:flex md:items-center md:gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Secure demo authentication
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-12">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_10px_30px_rgba(34,211,238,0.12)] backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Next-gen music membership for dreamers and creators
            </div>

            <div className="max-w-2xl space-y-5">
              <h1 className="font-['Georgia'] text-5xl leading-[0.94] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Step into
                <span className="block bg-gradient-to-r from-cyan-200 via-white to-pink-200 bg-clip-text text-transparent">
                  the Lyrical vibe.
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                Discover sessions, artists, and shared playlists in a calm, premium space designed to make signing in feel
                like entering the app, not passing through a form.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <article
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur"
                >
                  <p className="text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.label}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <article className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Live mood room</p>
                    <p className="mt-1 text-2xl font-semibold text-white">Midnight Notes</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-200">
                    <Headphones className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-3">
                  {highlights.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-950/35 px-4 py-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                      <p className="text-sm leading-6 text-slate-200">{item}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-400/18 to-cyan-400/12 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3 text-pink-100">
                    <Mic2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-pink-100/80">Creator note</p>
                    <p className="text-lg font-semibold text-white">Featured this week</p>
                  </div>
                </div>

                <blockquote className="mt-5 text-base leading-7 text-slate-100">
                  "Lyrical feels less like another streaming app and more like a private listening lounge built around taste."
                </blockquote>

                <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">Neha Aria</p>
                    <p className="text-xs text-slate-300">Independent vocalist</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">Verified artist</span>
                </div>
              </article>
            </div>
          </div>

          <section className="relative">
            <div className="absolute inset-x-8 top-4 h-full rounded-[2rem] bg-cyan-400/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-[0_35px_120px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:p-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Your pass</p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">{isLogin ? "Welcome back" : "Create account"}</h2>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-200">
                    {isLogin ? <ShieldCheck className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
                  <button
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isLogin ? "bg-white text-slate-950 shadow-lg" : "text-slate-300 hover:bg-white/5"
                    }`}
                    onClick={() => setMode("login")}
                    type="button"
                  >
                    Log in
                  </button>
                  <button
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      !isLogin ? "bg-white text-slate-950 shadow-lg" : "text-slate-300 hover:bg-white/5"
                    }`}
                    onClick={() => setMode("signup")}
                    type="button"
                  >
                    Sign up
                  </button>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <label className="block space-y-2">
                      <span className="text-sm text-slate-300">Full name</span>
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:bg-white/8"
                        onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                        placeholder="Aarav Mehta"
                        type="text"
                        value={form.fullName}
                      />
                    </label>
                  )}

                  <label className="block space-y-2">
                    <span className="text-sm text-slate-300">Email address</span>
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:bg-white/8"
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder={isLogin ? "demo@lyrical.app" : "you@example.com"}
                      type="email"
                      value={form.email}
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm text-slate-300">Password</span>
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:bg-white/8"
                      onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                      placeholder={isLogin ? "demo1234" : "Create a secure password"}
                      type="password"
                      value={form.password}
                    />
                  </label>

                  <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
                    <p>{isLogin ? "Demo credentials: demo@lyrical.app / demo1234" : "No backend yet. This creates a local demo session."}</p>
                    {isLogin && (
                      <button className="text-cyan-200 transition hover:text-cyan-100" type="button">
                        Forgot?
                      </button>
                    )}
                  </div>

                  <Button
                    className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-300 to-pink-300 px-5 py-4 text-base font-semibold text-slate-950 hover:from-cyan-200 hover:via-sky-200 hover:to-pink-200 focus-visible:outline-cyan-200"
                    type="submit"
                  >
                    <span>{isLogin ? "Enter Lyrical" : "Create your account"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>

                <div className="mt-6 rounded-2xl border border-emerald-300/15 bg-emerald-300/10 px-4 py-3 text-sm leading-6 text-emerald-100">
                  {message}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">Invite-only beta</p>
                    <p className="text-xs text-slate-400">Beautiful now, backend next.</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-200">Lyrical</span>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

export default App
