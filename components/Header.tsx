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
import SignInModal from "./SigninModal";

export default function Header() {
  const { session, supabase } = useSupabaseSession();
  const user = session?.user.user_metadata;
  console.log(user);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b">
      <Link href="/" className="text-xl font-bold">
        Snapations
      </Link>

      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.avatar_url || ""} alt={user.name || ""} />
              <AvatarFallback>
                {session.user.name?.[0]?.toUpperCase() || (
                  <FiUser className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSignOut()}>
              <FiLogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <SignInModal />
      )}
    </header>
  );
}
