"use client";

import { useState, useEffect } from "react";
import { signIn, getProviders } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiLogIn } from "react-icons/fi";

import clsx from "clsx";

export default function SignInModal() {
  const [providers, setProviders] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

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
        {providers ? (
          Object.values(providers).map((provider: any) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id)}
              type="button"
              className={clsx("btn flex items-center justify-center gap-2", {
                "btn-github": provider.id === "github",
              })}
            >
              {provider.id === "github" ? (
                <FaGithub className="w-5 h-5" />
              ) : (
                <FcGoogle className="w-5 h-5" />
              )}
              <span>Sign in with {provider.name}</span>
            </button>
          ))
        ) : (
          <p>Loading providers...</p>
        )}
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
