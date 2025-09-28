// components/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg"
    >
      Sign Out
    </button>
  );
}
