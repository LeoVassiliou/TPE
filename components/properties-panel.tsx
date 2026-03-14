"use client"

import { Card } from "@/components/ui/card"
import { 
  Globe, 
  Brain, 
  Zap, 
  Sparkles, 
  Lightbulb, 
  Scale, 
  Crown, 
  Cross, 
  Compass,
  Heart
} from "lucide-react"
import { ARGUMENTS, PROP_META } from "@/lib/arguments-data"
import type { ProbabilityEngine } from "@/hooks/use-probability-engine"

const PROP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Brain,
  Zap,
  Sparkles,
  Lightbulb,
  Scale,
  Crown,
  Cross,
  Compass,
  Heart
}

function formatPercent(val: number | null): string {
  if (val === null) return "—"
  return (val * 100).toFixed(1) + "%"
}

interface PropertiesPanelProps {
  engine: ProbabilityEngine
}

export function PropertiesPanel({ engine }: PropertiesPanelProps) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Global Divine Properties</h2>
        <p className="text-sm text-muted-foreground">
          These properties aggregate evidence from all arguments. Multiple arguments supporting 
          the same property combine via noisy-OR aggregation — the more independent evidence, 
          the higher the probability.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {engine.allPropertyKeys.map(propKey => {
          const meta = PROP_META[propKey]
          if (!meta) return null
          
          const result = engine.getCombinedProperty(propKey)
          const IconComponent = PROP_ICONS[meta.icon] || Sparkles

          return (
            <Card key={propKey} className="p-4 border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{meta.label}</h3>
                    <p className="text-xs text-muted-foreground">{meta.desc}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-lg text-accent">
                  {result ? formatPercent(result.combined) : "—"}
                </span>
              </div>

              {result && result.contributions.length > 0 && (
                <div className="space-y-1 border-t border-border pt-2">
                  {result.contributions.map((contrib, idx) => {
                    const arg = ARGUMENTS.find(a => a.id === contrib.argId)
                    if (!arg) return null

                    return (
                      <div 
                        key={idx}
                        className="flex items-center justify-between text-xs py-1"
                      >
                        <span className={contrib.entailed ? "text-purple-400 italic" : "text-muted-foreground"}>
                          {arg.title}
                          {contrib.entailed && contrib.sourceProp && (
                            <span className="ml-1 px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px]">
                              via {PROP_META[contrib.sourceProp]?.label || contrib.sourceProp}
                            </span>
                          )}
                        </span>
                        <span className={`font-mono ${contrib.entailed ? "text-purple-400" : "text-primary"}`}>
                          {formatPercent(contrib.val)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {!result && (
                <p className="text-xs text-muted-foreground border-t border-border pt-2">
                  Complete relevant arguments to see contributions.
                </p>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
