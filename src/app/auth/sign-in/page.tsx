"use client";

import { useState } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import Link from "next/link";

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value.length > 0) {
      setEmailValid(validateEmail(value));
    } else {
      setEmailValid(null);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { level: 0, label: "", color: "" };
    if (password.length < 6)
      return { level: 1, label: "Weak", color: "bg-coral-400" };
    if (password.length < 10)
      return { level: 2, label: "Fair", color: "bg-gold-400" };
    if (password.length < 14)
      return { level: 3, label: "Good", color: "bg-peach-400" };
    return { level: 4, label: "Strong", color: "bg-mint-400" };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Warm Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob-warm absolute right-0 top-0 h-96 w-96" />
        <div
          className="blob-warm absolute bottom-0 left-0 h-[500px] w-[500px]"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="glass-card overflow-hidden">
          <div className="flex flex-wrap">
            {/* Left Side - Auth Form */}
            <div className="w-full p-8 sm:p-12 lg:p-16 xl:w-1/2">
              <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
                <div className="shadow-glow-coral rounded-2xl bg-gradient-primary p-1.5">
                  <SparklesIcon className="size-5 text-white" />
                </div>
                <div>
                  <h1 className="gradient-text text-lg font-bold tracking-tight">
                    Clause
                  </h1>
                  <p className="text-xs font-medium text-dark-5 dark:text-gray-400">
                    AI Lease Analyzer
                  </p>
                </div>
              </Link>

              {/* Tabs */}
              <div className="glass mb-8 flex gap-2 rounded-full p-1">
                <button
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
                    !isSignUp
                      ? "shadow-glow-coral bg-gradient-primary text-white"
                      : "text-dark-5 hover:text-dark dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
                    isSignUp
                      ? "shadow-glow-coral bg-gradient-primary text-white"
                      : "text-dark-5 hover:text-dark dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>

              <h2 className="mb-2 text-3xl font-bold text-dark dark:text-white">
                {isSignUp ? "Create your account" : "Welcome back! 👋"}
              </h2>
              <p className="mb-8 text-dark-5 dark:text-gray-400">
                {isSignUp
                  ? "Get started analyzing your contracts and bills"
                  : "Let's find your money."}
              </p>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      className={`input-pill w-full ${
                        emailValid === true
                          ? "border-mint-400 focus:border-mint-500 focus:shadow-glow-mint"
                          : emailValid === false
                            ? "border-coral-400 focus:border-coral-500"
                            : ""
                      }`}
                      placeholder="you@example.com"
                    />
                    {emailValid === true && (
                      <svg
                        className="text-mint-500 absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  {emailValid === false && (
                    <p className="text-coral-600 dark:text-coral-400 mt-1 text-sm">
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-pill w-full"
                    placeholder="Enter your password"
                  />
                  {isSignUp && password.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-1.5 flex gap-1.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded-full transition-all ${
                              level <= passwordStrength.level
                                ? passwordStrength.color
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs font-semibold ${
                          passwordStrength.level === 1
                            ? "text-coral-600 dark:text-coral-400"
                            : passwordStrength.level === 2
                              ? "text-gold-600 dark:text-gold-400"
                              : passwordStrength.level === 3
                                ? "text-peach-600 dark:text-peach-400"
                                : "text-mint-600 dark:text-mint-400"
                        }`}
                      >
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                {!isSignUp && (
                  <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="border-peach-300 text-coral-500 focus:ring-coral-500 rounded"
                      />
                      <span className="text-sm text-dark-5 dark:text-gray-400">
                        Remember me
                      </span>
                    </label>
                    <Link
                      href="#"
                      className="text-coral-600 dark:text-coral-400 text-sm font-semibold hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                <button className="btn-gradient w-full py-4 text-lg">
                  {isSignUp ? "Create Account" : "Sign In"}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="border-peach-200 dark:border-coral-500/20 w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white/70 px-4 text-dark-5 dark:bg-white/5 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="glass border-peach-200/50 hover:shadow-soft-2 dark:border-coral-500/30 flex items-center justify-center gap-2 rounded-full border-2 px-4 py-3.5 font-semibold text-dark transition-all duration-300 hover:scale-105 dark:text-white">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </button>
                  <button className="glass border-peach-200/50 hover:shadow-soft-2 dark:border-coral-500/30 flex items-center justify-center gap-2 rounded-full border-2 px-4 py-3.5 font-semibold text-dark transition-all duration-300 hover:scale-105 dark:text-white">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </button>
                </div>

                <p className="text-center text-sm text-dark-5 dark:text-gray-400">
                  {isSignUp ? (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => setIsSignUp(false)}
                        className="text-coral-600 dark:text-coral-400 font-semibold hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <button
                        onClick={() => setIsSignUp(true)}
                        className="text-coral-600 dark:text-coral-400 font-semibold hover:underline"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="from-peach-100/50 via-coral-50/50 to-orchid-50/50 dark:from-coral-500/10 dark:via-orchid-500/10 hidden bg-gradient-to-br p-12 dark:to-purple-500/10 lg:p-16 xl:block xl:w-1/2">
              <div className="flex h-full flex-col justify-center">
                <div className="glass border-peach-200/40 dark:border-coral-500/30 mb-8 inline-flex w-fit items-center gap-2 rounded-full border px-5 py-2.5 backdrop-blur-xl dark:bg-white/5">
                  <SparklesIcon className="text-coral-500 dark:text-coral-400 size-4" />
                  <span className="text-sm font-semibold text-dark dark:text-white">
                    Powered by Advanced AI
                  </span>
                </div>
                <h3 className="mb-4 text-4xl font-bold text-dark dark:text-white">
                  {isSignUp ? "Start Your Journey" : "Welcome Back! 👋"}
                </h3>
                <p className="mb-8 text-lg leading-relaxed text-dark-5 dark:text-gray-400">
                  {isSignUp
                    ? "Join thousands of tenants and patients protecting their rights and recovering what they're owed."
                    : "Continue analyzing your contracts and tracking your cases."}
                </p>
                <div className="space-y-4">
                  {[
                    { icon: "🔍", text: "AI-powered clause detection" },
                    { icon: "💰", text: "Automatic refund calculations" },
                    { icon: "📝", text: "Professional demand letters" },
                    { icon: "🔒", text: "Privacy-first design" },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-2xl">{feature.icon}</span>
                      <span className="text-dark dark:text-white">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
