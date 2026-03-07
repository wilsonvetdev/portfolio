"use client";

import type { CardValue } from "@/lib/poker-types";

interface CardProps {
  value: CardValue;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function Card({ value, selected, onClick, disabled }: CardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-16 h-24 sm:w-20 sm:h-28 rounded-xl border-2 font-sans text-xl font-bold
        transition-all duration-200 flex items-center justify-center
        ${
          selected
            ? "border-primary bg-primary text-white shadow-lg -translate-y-2 scale-105"
            : "border-border bg-white text-secondary hover:border-primary/50 hover:-translate-y-1 hover:shadow-md"
        }
        ${disabled ? "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none" : "cursor-pointer"}
      `}
    >
      {value}
    </button>
  );
}
