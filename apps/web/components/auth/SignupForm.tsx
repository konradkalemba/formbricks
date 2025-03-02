"use client";

import { Button } from "@formbricks/ui";
import { createUser } from "@/lib/users/users";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { GithubButton } from "./GithubButton";
import { GoogleButton } from "@/components/auth/GoogleButton";

export const SignupForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [signingUp, setSigningUp] = useState(false);

  const handleSubmit = async (e: any) => {
    setSigningUp(true);
    e.preventDefault();
    try {
      await createUser(
        e.target.elements.name.value,
        e.target.elements.email.value,
        e.target.elements.password.value,
        searchParams?.get("inviteToken")
      );
      const url =
        process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_DISABLED === "1"
          ? `/auth/signup-without-verification-success`
          : `/auth/verification-requested?email=${encodeURIComponent(e.target.elements.email.value)}`;

      router.push(url);
    } catch (e: any) {
      setError(e.message);
      setSigningUp(false);
    }
  };

  const [showLogin, setShowLogin] = useState(false);
  const [isButtonEnabled, setButtonEnabled] = useState(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const checkFormValidity = () => {
    // If all fields are filled, enable the button
    if (formRef.current) {
      setButtonEnabled(formRef.current.checkValidity());
    }
  };

  return (
    <>
      {error && (
        <div className="absolute top-10 rounded-md bg-teal-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-teal-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-teal-800">An error occurred when logging you in</h3>
              <div className="mt-2 text-sm text-teal-700">
                <p className="space-y-1 whitespace-pre-wrap">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="text-center">
        <p className="mb-8 text-lg text-slate-700">Create your Formbricks account</p>
        <div className="space-y-2">
          <form onSubmit={handleSubmit} ref={formRef} className="space-y-2" onChange={checkFormValidity}>
            {showLogin && (
              <div>
                <div className="mb-2 transition-all duration-500 ease-in-out">
                  <label htmlFor="name" className="sr-only">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Full Name"
                      aria-placeholder="Full Name"
                      required
                      className="focus:border-brand focus:ring-brand block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mb-2 transition-all duration-500 ease-in-out">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="work@email.com"
                    defaultValue={searchParams?.get("email") || ""}
                    className="focus:border-brand focus:ring-brand block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
                  />
                </div>
                <div className="transition-all duration-500 ease-in-out">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="*******"
                    aria-placeholder="password"
                    onFocus={() => setIsPasswordFocused(true)}
                    required
                    className="focus:border-brand focus:ring-brand block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
                  />
                </div>
                {process.env.NEXT_PUBLIC_PASSWORD_RESET_DISABLED !== "1" && isPasswordFocused && (
                  <div className="ml-1 text-right transition-all duration-500 ease-in-out">
                    <Link
                      href="/auth/forgot-password"
                      className="hover:text-brand-dark text-xs text-slate-500">
                      Forgot your password?
                    </Link>
                  </div>
                )}
              </div>
            )}
            <Button
              onClick={() => {
                if (!showLogin) {
                  setShowLogin(true);
                  setButtonEnabled(false);
                } else if (formRef.current) {
                  formRef.current.requestSubmit();
                }
              }}
              variant="darkCTA"
              className="w-full justify-center"
              loading={signingUp}
              disabled={!isButtonEnabled}>
              Continue with Email
            </Button>
          </form>

          {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "1" && (
            <>
              <GoogleButton />
            </>
          )}
          {process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED === "1" && (
            <>
              <GithubButton />{" "}
            </>
          )}
        </div>

        {(process.env.NEXT_PUBLIC_TERMS_URL || process.env.NEXT_PUBLIC_PRIVACY_URL) && (
          <div className="mt-3 text-center text-xs text-slate-500">
            By signing up, you agree to our
            <br />
            {process.env.NEXT_PUBLIC_TERMS_URL && (
              <Link
                className="font-semibold"
                href="google.com" /* {process.env.NEXT_PUBLIC_TERMS_URL} */
                rel="noreferrer"
                target="_blank">
                Terms of Service
              </Link>
            )}
            {process.env.NEXT_PUBLIC_TERMS_URL && process.env.NEXT_PUBLIC_PRIVACY_URL && <span> and </span>}
            {process.env.NEXT_PUBLIC_PRIVACY_URL && (
              <Link
                className="font-semibold"
                href="google.com" /* {/* process.env.NEXT_PUBLIC_PRIVACY_URL }*/
                rel="noreferrer"
                target="_blank">
                Privacy Policy.
              </Link>
            )}
            {/*           <br />
          We&apos;ll occasionally send you account related emails. */}
            <hr className="mx-6 mt-3"></hr>
          </div>
        )}

        <div className="mt-3 text-center text-xs text-slate-600">
          Have an account?{" "}
          <Link href="/auth/login" className="font-semibold underline">
            Log in.
          </Link>
        </div>
      </div>
    </>
  );
};
