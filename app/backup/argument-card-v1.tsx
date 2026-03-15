"use client";

import type { Argument } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiseSlider } from "./premise-slider";

interface ArgumentCardProps {
  argument: Argument;
  conclusionProbability: number;
  onPremiseChange: (argId: string, premiseId: string, value: number) => void;
}

export function ArgumentCard({
  argument,
  conclusionProbability,
  onPremiseChange,
}: ArgumentCardProps) {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="border-b border-border pb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-foreground mb-2">
              {argument.name}
            </CardTitle>
            <p className="text-muted-foreground leading-relaxed">
              {argument.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Premises
          </h3>
          <div className="space-y-4">
            {argument.premises.map((premise, index) => (
              <PremiseSlider
                key={premise.id}
                premise={premise}
                index={index + 1}
                onChange={(value) =>
                  onPremiseChange(argument.id, premise.id, value)
                }
              />
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Conclusion
          </h3>
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-secondary-foreground mb-4">
              {argument.conclusionText}
            </p>

            {argument.formula && (
              <p className="text-xs text-muted-foreground mb-3 font-mono">
                {argument.formula}
              </p>
            )}

            <div className="flex items-center gap-4">
              <div className="flex-1 bg-background rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.min(conclusionProbability, 100)}%` }}
                />
              </div>
              <span className="text-2xl font-bold text-primary min-w-[80px] text-right">
                {conclusionProbability.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
