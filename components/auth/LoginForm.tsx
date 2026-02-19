"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signIn } from "@/services/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(supabase, email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/feed");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Watch Circle</h1>
        <p className="mt-2 text-muted">Sign in to your account</p>
      </div>

      {error && (
        <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
