import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  LockKeyhole,
  MailCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

type FormState = {
  name: string;
  email: string;
  password: string;
};

type ValidationErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  name: "",
  email: "",
  password: "",
};

const passwordRules = [
  {
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "One lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  { label: "One number", test: (value: string) => /\d/.test(value) },
  {
    label: "One special character",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, userExists } = useAuth();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === "login";
  const destination =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? appRoutes.home;
  const locationState = location.state as {
    email?: string;
    signupSuccess?: boolean;
  } | null;
  const failedPasswordRules = useMemo(
    () =>
      passwordRules
        .filter((rule) => !rule.test(form.password))
        .map((rule) => rule.label),
    [form.password],
  );

  useEffect(() => {
    if (isLogin && locationState?.signupSuccess) {
      setForm((current) => ({
        ...current,
        email: locationState.email ?? current.email,
      }));
      toast.success("Account created successfully. Please log in.");
    }
  }, [isLogin, locationState?.email, locationState?.signupSuccess]);

  const setField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: ValidationErrors = {};

    if (!isLogin && !form.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (!isLogin && failedPasswordRules.length > 0) {
      nextErrors.password = failedPasswordRules[0];
    }

    return nextErrors;
  };

  const showValidationToast = (validationErrors: ValidationErrors) => {
    const firstError =
      validationErrors.name ??
      validationErrors.email ??
      validationErrors.password;

    if (firstError) {
      toast.error(firstError);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      showValidationToast(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (isLogin) {
        await login({
          email: form.email,
          password: form.password,
        });
        toast.success("Logged in successfully.");
        navigate(destination, { replace: true });
        return;
      }

      const exists = await userExists(form.email);
      if (exists) {
        setErrors({ email: "An account with this email already exists." });
        toast.error("An account with this email already exists.");
        return;
      }

      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Account created successfully. Please log in.");
      navigate(appRoutes.login, {
        replace: true,
        state: { email: form.email, signupSuccess: true },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Authentication could not be completed.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-1 items-center justify-center py-8 sm:py-12">
      <div className="relative w-full max-w-md">
        <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-[var(--ambient-primary)] blur-3xl" />
        <div className="absolute -right-8 bottom-6 h-28 w-28 rounded-full bg-[var(--ambient-secondary)] blur-3xl" />

        <Card className="relative w-full overflow-hidden rounded-[34px] border border-[var(--auth-card-border)] bg-[var(--auth-card-bg)] shadow-[0_30px_80px_rgba(2,6,23,0.18)]">
          <div className="absolute inset-x-0 top-0 h-28 bg-[var(--auth-hero-bg)]" />
          <div className="absolute right-6 top-6 rounded-full border border-[var(--auth-card-border)] bg-[var(--auth-icon-bg)] p-2 shadow-[0_10px_25px_rgba(2,6,23,0.12)]">
            <Sparkles className="h-4 w-4 text-[var(--accent-strong)]" />
          </div>

          <CardHeader className="relative space-y-3 border-b border-[var(--border-subtle)] pb-6 pt-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--accent-strong)]">
              Lyrical
            </p>
            <CardTitle className="text-4xl tracking-tight">
              {isLogin ? "Welcome back" : "Create account"}
            </CardTitle>
            <p className="mx-auto max-w-xs text-sm leading-7 text-[var(--text-secondary)]">
              {isLogin
                ? "Log in to continue to your workspace."
                : "Sign up to get access to the application."}
            </p>
          </CardHeader>

          <CardContent className="relative p-6 pt-6 sm:p-7 sm:pt-7">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    Full name
                  </span>
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-[20px] border bg-[var(--input-bg)] px-4 py-3 transition focus-within:border-[var(--ring-color)]",
                      errors.name
                        ? "border-[var(--danger-text)]"
                        : "border-[var(--field-border)]",
                      "shadow-[var(--field-shadow)] focus-within:shadow-[var(--field-focus-shadow)]",
                    )}
                  >
                    <UserRound className="h-4 w-4 text-[var(--text-muted)]" />
                    <input
                      className="w-full bg-transparent outline-none"
                      onChange={(event) => setField("name", event.target.value)}
                      placeholder="Enter your name"
                      type="text"
                      value={form.name}
                    />
                  </div>
                </label>
              )}

              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  Email
                </span>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-[20px] border bg-[var(--input-bg)] px-4 py-3 transition focus-within:border-[var(--ring-color)]",
                    errors.email
                      ? "border-[var(--danger-text)]"
                      : "border-[var(--field-border)]",
                    "shadow-[var(--field-shadow)] focus-within:shadow-[var(--field-focus-shadow)]",
                  )}
                >
                  <MailCheck className="h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    className="w-full bg-transparent outline-none"
                    onChange={(event) => setField("email", event.target.value)}
                    placeholder="Enter your email"
                    type="email"
                    value={form.email}
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  Password
                </span>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-[20px] border bg-[var(--input-bg)] px-4 py-3 transition focus-within:border-[var(--ring-color)]",
                    errors.password
                      ? "border-[var(--danger-text)]"
                      : "border-[var(--field-border)]",
                    "shadow-[var(--field-shadow)] focus-within:shadow-[var(--field-focus-shadow)]",
                  )}
                >
                  <LockKeyhole className="h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    className="w-full bg-transparent outline-none"
                    onChange={(event) =>
                      setField("password", event.target.value)
                    }
                    placeholder={
                      isLogin ? "Enter your password" : "Create a password"
                    }
                    type="password"
                    value={form.password}
                  />
                </div>
              </label>

              <Button
                className="h-12 w-full rounded-2xl text-sm font-semibold shadow-[var(--button-strong-shadow)]"
                disabled={isSubmitting}
                type="submit"
              >
                <span>
                  {isSubmitting
                    ? "Please wait..."
                    : isLogin
                      ? "Log in"
                      : "Sign up"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                className="font-medium text-[var(--accent-strong)] transition hover:opacity-80"
                onClick={() =>
                  navigate(isLogin ? appRoutes.signup : appRoutes.login)
                }
                type="button"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
