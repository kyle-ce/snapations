"use client";

import Link from "next/link";
import { useSupabaseSession } from "@/lib/supabase/hooks/useSession";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiLogOut, FiUser } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { session, supabase } = useSupabaseSession();
  const user = session?.user.user_metadata;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto max-w-screen-lg flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring rounded-md"
        >
          Snapations
        </Link>

        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer transition hover:scale-105">
                <AvatarImage
                  src={user.avatar_url || ""}
                  alt={user.name || ""}
                />
                <AvatarFallback>
                  {user?.name?.[0]?.toUpperCase() || (
                    <FiUser className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut}>
                <FiLogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/signin" className="btn">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
