import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getAdminCount, bootstrapAdmin } from "@/lib/admin-users.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — AdMosaic" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Private sign-in for AdMosaic Marketing administrators." },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "forgot" | "setup";

function AuthPage() {
  const navigate = useNavigate();
  const adminCount = useServerFn(getAdminCount);
  const createOwner = useServerFn(bootstrapAdmin);

  const [mode, setMode] = useState<Mode>("signin");
  const [needsSetup, setNeedsSetup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) navigate({ to: "/admin", replace: true });
    });
    adminCount()
      .then((r) => {
        if (!active) return;
        setNeedsSetup(r.count === 0);
        if (r.count === 0) setMode("setup");
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [adminCount, navigate]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Check your inbox for the reset link.");
        setMode("signin");
      } else {
        await createOwner({ data: { email: email.trim(), password } });
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        toast.success("Owner account created.");
        navigate({ to: "/admin", replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          AdMosaic
        </p>
        <h1 className="mt-4 text-2xl font-medium tracking-tight">
          {mode === "setup"
            ? "Create the owner account"
            : mode === "forgot"
              ? "Reset your password"
              : "Sign in"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "setup"
            ? "This one-time setup creates the first administrator."
            : mode === "forgot"
              ? "We'll email you a secure link to choose a new password."
              : "Private area for AdMosaic administrators."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {mode !== "forgot" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "setup" ? "new-password" : "current-password"}
                required
                minLength={mode === "setup" ? 10 : 6}
                maxLength={200}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {mode === "setup" && (
                <p className="text-xs text-muted-foreground">Use at least 10 characters.</p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy
              ? "Please wait…"
              : mode === "setup"
                ? "Create account"
                : mode === "forgot"
                  ? "Send reset link"
                  : "Sign in"}
          </Button>
        </form>

        {!needsSetup && (
          <button
            type="button"
            onClick={() => setMode(mode === "forgot" ? "signin" : "forgot")}
            className="mt-6 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            {mode === "forgot" ? "Back to sign in" : "Forgot your password?"}
          </button>
        )}
      </div>
    </div>
  );
}
