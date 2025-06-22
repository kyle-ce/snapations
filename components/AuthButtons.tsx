"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>Signed in as {session.user?.name}</p>
        <button className="btn btn-google" onClick={() => signOut()}>
          Sign out
        </button>
      </>
    );
  }

  return (
    <>
      <button onClick={() => signIn("github")} className="btn btn-github">
        <FaGithub className="w-5 h-5" />
        Sign in with GitHub
      </button>

      <button onClick={() => signIn("google")} className="btn btn-google">
        <FcGoogle className="w-5 h-5" />
        Sign in with Google
      </button>
    </>
  );
}
