"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to settings page since we removed profiles
    router.replace("/pages/settings");
  }, [router]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-5xl">⚙️</div>
        <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">
          Redirecting to Account Settings...
        </h2>
        <p className="text-sm text-dark-5 dark:text-gray-400">
          Profile features have been simplified. Managing your account settings instead.
        </p>
      </div>
    </div>
  );
}
