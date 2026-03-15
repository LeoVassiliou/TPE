"use client";

import type { Argument } from "@/app/page";
import { cn } from "@/lib/utils";

interface ArgumentNavProps {
  args: Argument[];
  activeArg: string;
  setActiveArg: (id: string) => void;
  calculateConclusion: (arg: Argument) => number;
}

export function ArgumentNav({
  args,
  activeArg,
  setActiveArg,
  calculateConclusion,
}: ArgumentNavProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {args.map((arg) => {
        const prob = calculateConclusion(arg);
        const isActive = activeArg === arg.id;

        return (
          <button
            key={arg.id}
            onClick={() => setActiveArg(arg.id)}
            className={cn(
              "relative px-4 py-3 rounded-lg border transition-all duration-200 text-left",
              isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-card-foreground border-border hover:border-primary/50"
            )}
          >
            <span className="font-medium block">{arg.shortName}</span>
            <span
              className={cn(
                "text-xs",
                isActive ? "text-primary-foreground/80" : "text-muted-foreground"
              )}
            >
              {prob.toFixed(1)}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
