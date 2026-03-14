"use client"

import { useState } from "react"
import { useProbabilityEngine } from "@/hooks/use-probability-engine"
import { HeroSection } from "@/components/hero-section"
import { StatsBar } from "@/components/stats-bar"
import { ArgumentsPanel } from "@/components/arguments-panel"
import { PropertiesPanel } from "@/components/properties-panel"
import { CombinatorPanel } from "@/components/combinator-panel"
import { HowItWorks } from "@/components/how-it-works"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Zap, Link, Sparkles, BookOpen } from "lucide-react"

export default function TheismProbabilityEngine() {
  const engine = useProbabilityEngine()
  const [activeTab, setActiveTab] = useState("arguments")

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 pb-20">
        <HeroSection />
        
        <StatsBar engine={engine} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
            <TabsTrigger 
              value="arguments" 
              className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-primary"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Arguments</span>
            </TabsTrigger>
            <TabsTrigger 
              value="properties"
              className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-primary"
            >
              <Link className="h-4 w-4" />
              <span className="hidden sm:inline">Properties</span>
            </TabsTrigger>
            <TabsTrigger 
              value="combinator"
              className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Combinator</span>
            </TabsTrigger>
            <TabsTrigger 
              value="howto"
              className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">How It Works</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="arguments" className="mt-6">
            <ArgumentsPanel engine={engine} />
          </TabsContent>

          <TabsContent value="properties" className="mt-6">
            <PropertiesPanel engine={engine} />
          </TabsContent>

          <TabsContent value="combinator" className="mt-6">
            <CombinatorPanel engine={engine} />
          </TabsContent>

          <TabsContent value="howto" className="mt-6">
            <HowItWorks />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
