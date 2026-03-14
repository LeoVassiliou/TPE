"use client";

import type { Premise } from "@/app/page";
import { Slider } from "@/components/ui/slider";

interface PremiseSliderProps {
  premise: Premise;
  index: number;
  onChange: (value: number) => void;
}

export function PremiseSlider({ premise, index, onChange }: PremiseSliderProps) {
  const getCredenceLabel = (value: number): string => {
    if (value < 20) return "Very Unlikely";
    if (value < 40) return "Unlikely";
    if (value < 60) return "Uncertain";
    if (value < 80) return "Likely";
    return "Very Likely";
  };

  return (
    <div className="bg-secondary/50 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
          {index}
        </span>
        <p className="text-foreground text-sm leading-relaxed">{premise.text}</p>
      </div>

      <div className="flex items-center gap-4 pl-9">
        <Slider
          value={[premise.belief]}
          onValueChange={(values) => onChange(values[0])}
          max={100}
          min={0}
          step={1}
          className="flex-1"
        />
        <div className="flex items-center gap-2 min-w-[120px] justify-end">
          <span className="text-lg font-semibold text-primary">
            {premise.belief}%
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {getCredenceLabel(premise.belief)}
          </span>
        </div>
      </div>
    </div>
  );
}
