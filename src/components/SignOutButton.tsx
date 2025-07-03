'use client';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { LogOut } from 'lucide-react';

export function SignOutMenuItem() {
  const handleSignOut = async () => {};

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      className="flex items-center gap-2"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </DropdownMenuItem>
  );
}
