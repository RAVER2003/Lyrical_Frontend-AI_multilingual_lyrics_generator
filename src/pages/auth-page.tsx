import { useState, type FormEvent } from "react";
import { ArrowRight, ShieldCheck, UserPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AuthMode = "login" | "signup";

type FormState = {
  fullName: string;
  email: string;
  password: string;
};

const initialFormState: FormState = {
  fullName: "",
  email: "",
  password: "",
};

const highlights = [
  "Structured routes for a larger product",
  "Theme-ready design with a shared toggle",
  "Prepared for future backend integration",
];

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<FormState>(initialFormState);
  const [message, setMessage] = useState(
    "Sign in with the sample credentials or create a fresh demo account.",
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const identity = mode === "login" ? "Welcome back" : "Account created";
    const name = mode === "signup" ? form.fullName || "Listener" : "Listener";
    const email = form.email || "demo@lyrical.app";

    setMessage(
      `${identity}, ${name}. Your demo session is ready for ${email}.`,
    );
  };

  const isLogin = mode === "login";

  return (
    <section className="grid flex-1 items-start gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
      <div className="space-y-8 pt-4">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-medium text-[var(--text-muted)]">
            Authentication
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Calm access for a growing app.
          </h1>
          <p className="max-w-xl text-base leading-7 text-[var(--text-secondary)]">
            The login and signup screen now lives as its own route, with a
            softer visual direction that works better for a broader product
            experience.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <Card
              key={item}
              className="rounded-[24px] p-5 shadow-[0_20px_40px_rgba(148,163,184,0.08)]"
            >
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                {item}
              </p>
            </Card>
          ))}
        </div>

        <Card className="rounded-[32px] bg-[linear-gradient(145deg,var(--surface-raised),var(--surface-soft))] p-6 shadow-[0_28px_60px_rgba(148,163,184,0.1)]">
          <p className="text-sm font-medium text-[var(--text-muted)]">
            Why this direction
          </p>
          <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
            The new layout keeps the interface gentle and spacious, with warm
            neutrals and muted sage accents instead of a heavy dark hero. It
            feels quieter, but still designed.
          </p>
        </Card>
      </div>

      <section>
        <Card className="rounded-[32px] shadow-[0_30px_80px_rgba(148,163,184,0.1)]">
          <CardHeader className="border-b border-[var(--border-subtle)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[var(--text-muted)]">
                  Your account
                </p>
                <CardTitle className="mt-2">
                  {isLogin ? "Welcome back" : "Create account"}
                </CardTitle>
              </div>
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3 text-[var(--text-secondary)]">
                {isLogin ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <UserPlus className="h-5 w-5" />
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-6">
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--surface-muted)] p-1">
              <button
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isLogin
                    ? "bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]"
                }`}
                onClick={() => setMode("login")}
                type="button"
              >
                Log in
              </button>
              <button
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  !isLogin
                    ? "bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]"
                }`}
                onClick={() => setMode("signup")}
                type="button"
              >
                Sign up
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <label className="block space-y-2">
                  <span className="text-sm text-[var(--text-secondary)]">
                    Full name
                  </span>
                  <input
                    className="w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--ring-color)]"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    placeholder="Aarav Mehta"
                    type="text"
                    value={form.fullName}
                  />
                </label>
              )}

              <label className="block space-y-2">
                <span className="text-sm text-[var(--text-secondary)]">
                  Email address
                </span>
                <input
                  className="w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--ring-color)]"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder={isLogin ? "demo@lyrical.app" : "you@example.com"}
                  type="email"
                  value={form.email}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-[var(--text-secondary)]">
                  Password
                </span>
                <input
                  className="w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--ring-color)]"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder={
                    isLogin ? "demo1234" : "Create a secure password"
                  }
                  type="password"
                  value={form.password}
                />
              </label>

              <div className="flex items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
                <p>
                  {isLogin
                    ? "Demo credentials: demo@lyrical.app / demo1234"
                    : "No backend yet. This creates a local demo session."}
                </p>
                {isLogin && (
                  <button
                    className="transition hover:text-[var(--text-primary)]"
                    type="button"
                  >
                    Forgot?
                  </button>
                )}
              </div>

              <Button className="w-full" type="submit">
                <span>{isLogin ? "Enter Lyrical" : "Create your account"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]">
              {message}
            </div>
            <div className="mt-4">
              <Badge variant="secondary">Demo auth experience</Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
