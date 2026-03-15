"use client";

import type { Argument } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CumulativePanelProps {
  args: Argument[];
  calculateConclusion: (arg: Argument) => number;
  cumulativeProbability: number;
}

export function CumulativePanel({
  args,
  calculateConclusion,
  cumulativeProbability,
}: CumulativePanelProps) {
  return (
    <div className="sticky top-6 space-y-6">
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="bg-primary/10 border-b border-border">
          <CardTitle className="text-xl text-foreground">
            Cumulative Case
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Probability that at least one argument succeeds
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-primary mb-2">
              {cumulativeProbability.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">
              P(at least one) = 1 - P(all fail)
            </p>
          </div>

          <div className="w-full bg-secondary rounded-full h-4 mb-6 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(cumulativeProbability, 100)}%` }}
            />
          </div>

          <div className="space-y-3">
            {args.map((arg) => {
              const prob = calculateConclusion(arg);
              return (
                <div key={arg.id} className="flex items-center gap-3">
                  <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${Math.min(prob, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-20 text-right">
                    {arg.shortName}
                  </span>
                  <span className="text-sm font-semibold text-foreground w-12 text-right">
                    {prob.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Individual Arguments
            </h4>
            <p>
              Each argument{"'"}s conclusion probability is calculated by multiplying
              the probabilities of all its premises together.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Cumulative Probability
            </h4>
            <p>
              The cumulative case uses{" "}
              <span className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">
                1 - ∏(1 - Pᵢ)
              </span>{" "}
              to find the probability that at least one argument succeeds.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Epistemic Humility
            </h4>
            <p>
              These calculations assume independence between arguments. Real
              epistemic situations may involve dependencies and shared
              background assumptions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
