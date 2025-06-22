"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiLogIn } from "react-icons/fi";

import clsx from "clsx";

const PROVIDERS = [
  {
    id: "github",
    name: "GitHub",
    icon: <FaGithub className="w-5 h-5" />,
    className: "btn-github",
  },
  {
    id: "google",
    name: "Google",
    icon: <FcGoogle className="w-5 h-5" />,
    className: "btn-google",
  },
  // add more providers here as needed
];

export default function SignInModal() {
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      alert("Error signing in: " + error.message);
    }
    // Supabase will redirect the user to the provider, so no need to close the modal
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn flex items-center justify-center"
        type="button"
      >
        <FiLogIn className="w-4 h-4 " />
        Sign In
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg flex flex-col gap-2"
        onClick={(e) => e.stopPropagation()} // prevent modal close on inner click
      >
        <h2 className="mb-4 text-lg font-semibold">Sign in</h2>
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleOAuthSignIn(provider.id as any)}
            type="button"
            className={clsx(
              "btn flex items-center justify-center gap-2",
              provider.className
            )}
          >
            {provider.icon}
            <span>Sign in with {provider.name}</span>
          </button>
        ))}
        <button
          onClick={() => setIsOpen(false)}
          className="btn btn-google"
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
