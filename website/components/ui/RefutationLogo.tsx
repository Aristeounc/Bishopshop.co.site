'use client';

export function RefutationLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-brand-accent"
    >
      {/* Shield base - represents defense against weak arguments */}
      <path
        d="M16 2L4 7v8c0 7 12 13 12 13s12-6 12-13V7l-12-5z"
        fill="currentColor"
        opacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Checkmark - represents valid refutation */}
      <path
        d="M10 16l3 3 7-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lightning bolt - represents sharp argumentation */}
      <path
        d="M20 9l-2 4h3l-4 8"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}
