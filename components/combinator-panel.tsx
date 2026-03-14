"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible"
import { ChevronDown, Sparkles, Calculator, BarChart3, PieChart, Users } from "lucide-react"
import { ARGUMENTS, PROP_META, WORLDVIEW_PRESETS } from "@/lib/arguments-data"
import type { ProbabilityEngine, WorldviewPreset } from "@/hooks/use-probability-engine"
import { cn } from "@/lib/utils"

function formatPercent(val: number | null): string {
  if (val === null) return "—"
  return (val * 100).toFixed(1) + "%"
}

interface CombinatorPanelProps {
  engine: ProbabilityEngine
}

export function CombinatorPanel({ engine }: CombinatorPanelProps) {
  const [showAdjust, setShowAdjust] = useState(false)
  const allPostFinals: { argId: string; title: string; val: number | null }[] = ARGUMENTS.map(a => ({
    argId: a.id,
    title: a.title,
    val: engine.getPostFinal(a.id)
  }))

  const stats = engine.getStats()
  const cumulativeTheism = stats.cumulativeTheism

  return (
    <div className="space-y-6">
      {/* Cumulative Result */}
      <Card className="p-6 border-primary/30 bg-gradient-to-br from-card to-primary/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Cumulative Theism Probability</h2>
            <p className="text-sm text-muted-foreground">
              Combined from all argument post-finals using noisy-OR
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-6">
          <span className="text-5xl font-black font-mono text-primary">
            {formatPercent(cumulativeTheism)}
          </span>
          {cumulativeTheism !== null && (
            <span className="text-muted-foreground text-sm">
              ({cumulativeTheism >= 0.5 ? "More likely than not" : "Less likely than not"})
            </span>
          )}
        </div>

        {/* Contribution bars */}
        <div className="mt-6 space-y-2">
          {allPostFinals.map(pf => {
            const arg = ARGUMENTS.find(a => a.id === pf.argId)
            if (!arg) return null

            return (
              <div key={pf.argId} className="flex items-center gap-3">
                <span className="w-28 truncate text-sm text-muted-foreground">{pf.title}</span>
                <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: pf.val !== null ? `${pf.val * 100}%` : '0%',
                      backgroundColor: arg.color
                    }}
                  />
                </div>
                <span className="w-14 text-right font-mono text-sm text-muted-foreground">
                  {formatPercent(pf.val)}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Independence Adjustments */}
      <Card className="border-border">
        <Collapsible open={showAdjust} onOpenChange={setShowAdjust}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-accent" />
                <span className="font-semibold">Independence Adjustments</span>
              </div>
              <ChevronDown className={cn(
                "w-5 h-5 text-muted-foreground transition-transform",
                showAdjust && "rotate-180"
              )} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Adjust how independent each argument is from the others. Lower independence 
              means the evidence is more correlated (less additional support when combined).
            </p>
            <div className="space-y-4">
              {ARGUMENTS.map(arg => (
                <div key={arg.id} className="flex items-center gap-4">
                  <span className="w-32 truncate text-sm">{arg.title}</span>
                  <Slider
                    value={[engine.state.independence[arg.id] ?? 100]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={([v]) => engine.setIndependence(arg.id, v)}
                    className="flex-1"
                  />
                  <span className="w-12 text-right font-mono text-sm text-muted-foreground">
                    {engine.state.independence[arg.id] ?? 100}%
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Prior Adjustment */}
      <Card className="p-4 border-border">
        <div className="flex items-center gap-3 mb-4">
          <PieChart className="w-5 h-5 text-amber-500" />
          <span className="font-semibold">Prior Probability of Theism</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Your starting probability for theism before considering any arguments (e.g., 50% = agnostic prior).
        </p>
        <div className="flex items-center gap-4">
          <Slider
            value={[engine.state.prior]}
            min={1}
            max={99}
            step={1}
            onValueChange={([v]) => engine.setPrior(v)}
            className="flex-1"
          />
          <span className="min-w-[56px] text-center font-mono font-bold text-amber-500">
            {engine.state.prior}%
          </span>
        </div>
      </Card>

      {/* Worldview Presets */}
      <Card className="p-4 border-border">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-violet-400" />
          <span className="font-semibold">Worldview Presets</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Load preset slider positions representing different philosophical perspectives:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {WORLDVIEW_PRESETS.map(preset => (
            <Button
              key={preset.id}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => engine.applyPreset(preset)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Explanation */}
      <Card className="p-4 border-border">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span className="font-semibold">How It&apos;s Calculated</span>
        </div>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>
            <strong>Core Probability:</strong> Product of all activated core premise confidences.
          </li>
          <li>
            <strong>Post-Argument Properties:</strong> Each post-premise contributes (core × post-premise value) 
            to its targeted property, scaled by 0.85×.
          </li>
          <li>
            <strong>Entailments:</strong> Some properties (e.g., personal) automatically contribute 
            evidence to related properties (e.g., morally good) at 0.7× weight.
          </li>
          <li>
            <strong>Property Aggregation:</strong> All contributions to a property combine via noisy-OR: 
            P = 1 − ∏(1 − p<sub>i</sub>).
          </li>
          <li>
            <strong>Cumulative Theism:</strong> Post-finals from all arguments aggregate via noisy-OR, 
            then adjusted by the prior using Bayes' theorem.
          </li>
        </ul>
      </Card>
    </div>
  )
}
