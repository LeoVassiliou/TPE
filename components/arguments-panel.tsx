"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible"
import { 
  ChevronDown, 
  ChevronRight, 
  Orbit, 
  Target, 
  Scale, 
  RefreshCw, 
  Gem, 
  Cross, 
  Compass,
  Sparkles,
  Zap
} from "lucide-react"
import { ARGUMENTS, PROP_META, ENTAILMENT_MAP } from "@/lib/arguments-data"
import type { ProbabilityEngine } from "@/hooks/use-probability-engine"
import { cn } from "@/lib/utils"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Orbit,
  Target,
  Scale,
  RefreshCw,
  Gem,
  Cross,
  Compass
}

function formatPercent(val: number | null): string {
  if (val === null) return "—"
  return (val * 100).toFixed(1) + "%"
}

interface ArgumentsPanelProps {
  engine: ProbabilityEngine
}

export function ArgumentsPanel({ engine }: ArgumentsPanelProps) {
  const [openArgs, setOpenArgs] = useState<Record<string, boolean>>({})

  const toggleArg = (id: string) => {
    setOpenArgs(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-4">
      {ARGUMENTS.map(arg => {
        const Icon = ICONS[arg.icon] || Orbit
        const isOpen = openArgs[arg.id] || false
        const coreProb = engine.getCoreProb(arg.id)
        const postFinal = engine.getPostFinal(arg.id)

        return (
          <Card 
            key={arg.id} 
            className={cn(
              "border-border overflow-hidden transition-colors",
              isOpen && "border-primary/30"
            )}
          >
            <Collapsible open={isOpen} onOpenChange={() => toggleArg(arg.id)}>
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: arg.color + "18", color: arg.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">{arg.title}</h3>
                      <p className="text-xs text-muted-foreground">Click to expand</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs font-mono font-semibold bg-primary/10 text-primary">
                      Core: {formatPercent(coreProb)}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-mono font-semibold bg-violet-500/10 text-violet-400">
                      Post: {formatPercent(postFinal)}
                    </span>
                    <ChevronDown className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform",
                      isOpen && "rotate-180"
                    )} />
                  </div>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-6">
                  {/* Core Premises */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Core Premises
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <div className="space-y-3">
                      {arg.corePremises.map((premise, idx) => (
                        <PremiseCard
                          key={premise.id}
                          number={idx + 1}
                          text={premise.text}
                          evidence={premise.evidence}
                          value={engine.state.corePremises[arg.id]?.[premise.id]?.value ?? 50}
                          activated={engine.state.corePremises[arg.id]?.[premise.id]?.activated ?? false}
                          onChange={(v) => engine.setCoreValue(arg.id, premise.id, v)}
                          color={arg.color}
                        />
                      ))}
                    </div>

                    {/* Core Conclusion */}
                    <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{arg.coreConclusionText}</p>
                        <span className="font-mono font-bold text-lg text-primary">
                          {formatPercent(coreProb)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post-Argument Properties */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Post-Argument Properties
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                      Given the conclusion, how likely is each property of the cause?
                    </p>

                    {/* Entailment notice */}
                    {arg.postPremises.some(pp => ENTAILMENT_MAP[pp.propKey]) && (
                      <div className="mb-3 p-3 rounded-lg bg-violet-500/5 border border-violet-500/20 text-xs text-violet-300">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        <strong>Entailment active:</strong> Some properties below automatically contribute to other properties.
                      </div>
                    )}

                    <div className="space-y-3">
                      {arg.postPremises.map(pp => {
                        const contribution = engine.getContribution(arg.id, pp.id)
                        const entails = ENTAILMENT_MAP[pp.propKey]
                        const meta = PROP_META[pp.propKey]

                        return (
                          <PostPremiseCard
                            key={pp.id}
                            text={pp.text}
                            propKey={pp.propKey}
                            propLabel={meta?.label || pp.propKey}
                            evidence={pp.evidence}
                            value={engine.state.postPremises[arg.id]?.[pp.id]?.value ?? 50}
                            activated={engine.state.postPremises[arg.id]?.[pp.id]?.activated ?? false}
                            onChange={(v) => engine.setPostValue(arg.id, pp.id, v)}
                            contribution={contribution}
                            entails={entails}
                          />
                        )
                      })}
                    </div>

                    {/* Post Conclusion */}
                    <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-violet-500/5 to-purple-500/5 border border-violet-500/20">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">All properties from {arg.title}</p>
                        <span className="font-mono font-bold text-lg text-violet-400">
                          {formatPercent(postFinal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )
      })}
    </div>
  )
}

interface PremiseCardProps {
  number: number
  text: string
  evidence: string[]
  value: number
  activated: boolean
  onChange: (value: number) => void
  color: string
}

function PremiseCard({ number, text, evidence, value, activated, onChange, color }: PremiseCardProps) {
  const [showEvidence, setShowEvidence] = useState(false)

  return (
    <div className="p-3 rounded-lg bg-secondary/50 border border-transparent hover:border-border transition-colors">
      <div className="flex items-start gap-3">
        <span 
          className="px-2 py-0.5 rounded text-[10px] font-bold font-mono shrink-0"
          style={{ backgroundColor: color + "18", color }}
        >
          P{number}
        </span>
        <p className="text-sm leading-relaxed flex-1">{text}</p>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <Slider
          value={[value]}
          min={0}
          max={100}
          step={1}
          onValueChange={([v]) => onChange(v)}
          className="flex-1"
        />
        <span className={cn(
          "min-w-[56px] text-center font-mono font-bold text-sm px-2 py-1 rounded bg-card border border-border",
          activated ? "text-primary" : "text-muted-foreground"
        )}>
          {activated ? `${value}%` : "—"}
        </span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-2 h-7 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => setShowEvidence(!showEvidence)}
      >
        <ChevronRight className={cn("w-3 h-3 mr-1 transition-transform", showEvidence && "rotate-90")} />
        Evidence & Analysis
      </Button>

      {showEvidence && (
        <ul className="mt-2 ml-4 space-y-2 text-xs text-muted-foreground">
          {evidence.map((e, i) => (
            <li key={i} className="list-disc ml-2">{e}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface PostPremiseCardProps {
  text: string
  propKey: string
  propLabel: string
  evidence: string[]
  value: number
  activated: boolean
  onChange: (value: number) => void
  contribution: number | null
  entails?: string[]
}

function PostPremiseCard({ 
  text, 
  propKey, 
  propLabel, 
  evidence, 
  value, 
  activated, 
  onChange, 
  contribution,
  entails 
}: PostPremiseCardProps) {
  const [showEvidence, setShowEvidence] = useState(false)

  return (
    <div className="p-3 rounded-lg bg-secondary/50 border-l-2 border-violet-500 hover:border-border hover:border-l-violet-500 transition-colors">
      <div className="flex items-start gap-2 flex-wrap">
        <p className="text-sm leading-relaxed flex-1">{text}</p>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400">
          {propLabel}
        </span>
        {entails && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400">
            <Zap className="w-2.5 h-2.5 inline mr-0.5" />
            Entails {entails.length}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mt-3">
        <Slider
          value={[value]}
          min={0}
          max={100}
          step={1}
          onValueChange={([v]) => onChange(v)}
          className="flex-1"
        />
        <span className={cn(
          "min-w-[56px] text-center font-mono font-bold text-sm px-2 py-1 rounded bg-card border border-border",
          activated ? "text-violet-400" : "text-muted-foreground"
        )}>
          {activated ? `${value}%` : "—"}
        </span>
      </div>

      <div className="mt-2 text-xs font-mono text-muted-foreground">
        Contribution to {propLabel}: {formatPercent(contribution)}
        {entails && contribution !== null && (
          <span className="text-purple-400 ml-2">
            (also flows to: {entails.map(e => PROP_META[e]?.label || e).join(", ")})
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-1 h-7 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => setShowEvidence(!showEvidence)}
      >
        <ChevronRight className={cn("w-3 h-3 mr-1 transition-transform", showEvidence && "rotate-90")} />
        Evidence & Analysis
      </Button>

      {showEvidence && (
        <ul className="mt-2 ml-4 space-y-2 text-xs text-muted-foreground">
          {evidence.map((e, i) => (
            <li key={i} className="list-disc ml-2">{e}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
