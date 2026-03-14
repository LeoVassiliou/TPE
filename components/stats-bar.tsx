"use client"

import { Card } from "@/components/ui/card"
import type { ProbabilityEngine } from "@/hooks/use-probability-engine"

function formatPercent(val: number | null): string {
  if (val === null) return "—"
  return (val * 100).toFixed(1) + "%"
}

interface StatsBarProps {
  engine: ProbabilityEngine
}

export function StatsBar({ engine }: StatsBarProps) {
  const stats = engine.getStats()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
      <Card className="p-4 text-center border-border hover:border-primary/30 transition-colors">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          Strongest Argument
        </p>
        <p className="text-lg font-bold font-mono text-primary truncate">
          {stats.strongestVal !== null ? formatPercent(stats.strongestVal) : "—"}
        </p>
      </Card>

      <Card className="p-4 text-center border-border hover:border-primary/30 transition-colors">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          Avg Core Probability
        </p>
        <p className="text-lg font-bold font-mono text-amber-500">
          {formatPercent(stats.avgCore)}
        </p>
      </Card>

      <Card className="p-4 text-center border-border hover:border-primary/30 transition-colors">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          Properties Assessed
        </p>
        <p className="text-lg font-bold font-mono text-accent">
          {stats.propsAssessed} / {stats.totalProps}
        </p>
      </Card>

      <Card className="p-4 text-center border-border hover:border-primary/30 transition-colors">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          Cumulative Theism
        </p>
        <p className="text-lg font-bold font-mono text-violet-400">
          {formatPercent(stats.cumulativeTheism)}
        </p>
      </Card>

      <Card className="p-4 text-center border-border hover:border-primary/30 transition-colors col-span-2 sm:col-span-1">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          Arguments Rated
        </p>
        <p className="text-lg font-bold font-mono text-rose-400">
          {stats.argsRated} / {stats.totalArgs}
        </p>
      </Card>
    </div>
  )
}
