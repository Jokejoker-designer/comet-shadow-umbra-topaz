import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-canvas px-6 text-ink">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
          Neuromorphic lab
        </p>
        <h1 className="mt-1 text-xl font-medium tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-mute">
          Optional. The graph and COM8 replay work as a guest.
        </p>
        <div className="mt-5 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="h-10 w-full rounded-sm border border-line px-4 text-sm hover:bg-elevated"
              >
                Continue with {p.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-mute">Sign-in is disabled.</p>
          )}
        </div>
        <a href="/" className="mt-4 inline-block text-xs text-mute hover:text-ink">
          Back to graph
        </a>
      </div>
    </main>
  );
}
