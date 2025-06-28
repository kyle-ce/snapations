// app/signin/page.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const providers = [
  {
    id: "github",
    name: "GitHub",
    icon: <FaGithub className="w-5 h-5" />,
    style: "btn-github",
  },
  {
    id: "google",
    name: "Google",
    icon: <FcGoogle className="w-5 h-5" />,
    style: "btn-google",
  },
];

export default function SignInPage() {
  const supabase = createClient();

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });
    if (error) alert("Error signing in: " + error.message);
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sign in to Snaptions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {providers.map((provider) => (
            <Button
              key={provider.id}
              onClick={() =>
                handleOAuthSignIn(provider.id as "github" | "google")
              }
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
            >
              {provider.icon}
              <span>Continue with {provider.name}</span>
            </Button>
          ))}
          <Link
            href="/"
            className="text-sm text-center text-muted-foreground hover:underline"
          >
            ← Back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
