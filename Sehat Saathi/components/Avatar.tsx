"use client";

export type AvatarState = "idle" | "listening" | "thinking" | "talking" | "concerned";

const RING_COLOR: Record<AvatarState, string> = {
  idle: "bg-teal-300/50",
  listening: "bg-teal-400/60",
  thinking: "bg-amber-300/60",
  talking: "bg-teal-400/60",
  concerned: "bg-rose-400/60",
};

const STATE_CAPTION: Record<AvatarState, string> = {
  idle: "I'm here whenever you're ready.",
  listening: "Listening...",
  thinking: "Analyzing your reports...",
  talking: "Here's what I found.",
  concerned: "This looks urgent — please read carefully.",
};

interface AvatarProps {
  state: AvatarState;
  caption?: string;
}

export default function Avatar({ state, caption }: AvatarProps) {
  const floatClass = state === "thinking" ? "" : "animate-avatar-float";
  const browTilt = state === "concerned" ? 10 : state === "thinking" ? 6 : 0;

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="relative flex h-40 w-40 items-center justify-center">
        {(state === "thinking" || state === "listening" || state === "concerned") && (
          <span
            className={`absolute inset-0 rounded-full animate-avatar-pulse-ring ${RING_COLOR[state]}`}
          />
        )}
        <span className={`absolute inset-2 rounded-full ${RING_COLOR[state]} blur-md opacity-60`} />

        <div className={`relative ${floatClass}`}>
          <svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true">
            <ellipse cx="64" cy="118" rx="34" ry="6" fill="#0f2a2b" opacity="0.08" />

            <rect x="58" y="6" width="12" height="16" rx="6" fill="#0d9488" />
            <circle cx="64" cy="6" r="5" fill={state === "thinking" ? "#f59e0b" : "#14b8a6"} />

            <rect
              x="18"
              y="20"
              width="92"
              height="82"
              rx="34"
              fill="#ffffff"
              stroke="#0d9488"
              strokeWidth="3"
            />

            <rect x="6" y="52" width="14" height="22" rx="7" fill="#0d9488" />
            <rect x="108" y="52" width="14" height="22" rx="7" fill="#0d9488" />

            <g>
              <rect
                x="38"
                y={state === "concerned" ? 50 - browTilt / 4 : 50}
                width="16"
                height="4"
                rx="2"
                fill="#0d9488"
                transform={state === "concerned" ? "rotate(-8 46 52)" : undefined}
              />
              <rect
                x="74"
                y={state === "concerned" ? 50 - browTilt / 4 : 50}
                width="16"
                height="4"
                rx="2"
                fill="#0d9488"
                transform={state === "concerned" ? "rotate(8 82 52)" : undefined}
              />
            </g>

            <rect
              x="42"
              y="58"
              width="10"
              height="14"
              rx="5"
              fill="#0f2a2b"
              className="animate-avatar-blink"
              style={{ transformOrigin: "47px 65px" }}
            />
            <rect
              x="76"
              y="58"
              width="10"
              height="14"
              rx="5"
              fill="#0f2a2b"
              className="animate-avatar-blink"
              style={{ transformOrigin: "81px 65px" }}
            />

            {state === "talking" ? (
              <rect
                x="52"
                y="82"
                width="24"
                height="12"
                rx="6"
                fill="#0f2a2b"
                className="animate-avatar-talk"
                style={{ transformOrigin: "64px 88px" }}
              />
            ) : state === "concerned" ? (
              <rect x="50" y="86" width="28" height="4" rx="2" fill="#0f2a2b" />
            ) : state === "listening" ? (
              <circle cx="64" cy="88" r="6" fill="#0f2a2b" />
            ) : (
              <path
                d="M50 84 Q64 96 78 84"
                stroke="#0f2a2b"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            )}

            <path
              d="M40 100 Q64 116 88 100 L88 108 Q64 122 40 108 Z"
              fill="#0d9488"
            />
            <circle cx="64" cy="108" r="5" fill="#ffffff" stroke="#0d9488" strokeWidth="2" />
            <path d="M60 108 h8 M64 104 v8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          </svg>

          {state === "listening" && (
            <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-3 w-1 rounded-full bg-teal-500 animate-avatar-listen-bar"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <p
        className={`text-sm font-medium ${
          state === "concerned" ? "text-rose-600" : "text-teal-700"
        }`}
      >
        {caption ?? STATE_CAPTION[state]}
      </p>
    </div>
  );
}
