import { Card } from "@/components/ui/card"
import { Lightbulb, ArrowRight, Zap, Link2, Sparkles } from "lucide-react"

export function HowItWorks() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">How to Use This Tool</h2>
        <p className="text-sm text-muted-foreground">
          Understand the methodology behind this probability engine and how to interpret results.
        </p>
      </div>

      {/* Main workflow */}
      <Card className="p-6 border-border">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold">The Workflow</h3>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Step 
            num={1}
            title="Rate Core Premises"
            desc="For each argument, set your confidence (0–100%) in each foundational premise. The conclusion probability is the product of all premise confidences."
          />
          <Step 
            num={2}
            title="Rate Post-Argument Properties"
            desc="Given the conclusion, how likely is each divine property? These assessments build the detailed picture of what kind of cause exists."
          />
          <Step 
            num={3}
            title="View Aggregated Properties"
            desc="Multiple arguments supporting the same property combine via noisy-OR, giving stronger evidence when converging from independent sources."
          />
          <Step 
            num={4}
            title="See Cumulative Result"
            desc="All post-finals aggregate into a single cumulative theism probability, adjusted by your prior belief."
          />
        </div>
      </Card>

      {/* Key Concepts */}
      <Card className="p-6 border-border">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Key Concepts</h3>
        </div>

        <div className="space-y-4 text-sm">
          <Concept 
            title="Core Premises"
            desc="The foundational propositions of each argument. If you accept all premises of a valid argument, you must accept the conclusion."
          />
          <Concept 
            title="Post-Argument Properties"
            desc="Even if an argument's conclusion is true, it may not fully establish theism. These sliders assess how likely each divine attribute (omnipotence, moral goodness, etc.) is given the conclusion."
          />
          <Concept 
            title="Entailments"
            desc="Some properties logically or probabilistically support others. For example, evidence for a 'personal' cause provides some evidence for 'morally good' since personhood is typically required for moral agency."
          />
          <Concept 
            title="Noisy-OR Aggregation"
            desc="When multiple independent pieces of evidence support the same conclusion, the probability grows faster than simple averaging: P = 1 − ∏(1 − pᵢ). This rewards convergent evidence from diverse sources."
          />
          <Concept 
            title="Independence Factor"
            desc="If two arguments share similar evidence (e.g., both rely on observations of fine-tuning), their contributions should be partially correlated, reducing the combined boost. Adjust independence to model this."
          />
        </div>
      </Card>

      {/* Why It Matters */}
      <Card className="p-6 border-border">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <h3 className="font-semibold">Why This Approach?</h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Traditional discussions of theistic arguments often treat them in isolation, asking only 
          &ldquo;Does this argument prove God exists?&rdquo; But this misses two key points: (1) arguments 
          rarely provide 100% certainty—they shift probabilities, and (2) multiple arguments can 
          combine cumulatively. This tool lets you:
        </p>

        <ul className="mt-4 text-sm space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            Express nuanced credences rather than binary accept/reject.
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            See how partial confidence in multiple arguments can still produce high cumulative probability.
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            Track which divine properties have the most evidential support.
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            Understand how entailments between properties strengthen the overall case.
          </li>
        </ul>
      </Card>

      {/* Disclaimer */}
      <Card className="p-6 border-border bg-secondary/30">
        <div className="flex items-center gap-3 mb-2">
          <Link2 className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">Disclaimer</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This tool is an educational exploration, not a definitive calculator of metaphysical truth. 
          The slider defaults, entailment weights, and aggregation methods embody reasonable but 
          debatable modeling choices. Use it to clarify your own thinking and explore how different 
          assumptions affect conclusions.
        </p>
      </Card>
    </div>
  )
}

function Step({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-4xl font-black text-primary/20 mb-2">{num}</span>
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  )
}

function Concept({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-3 rounded-lg bg-secondary/50">
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  )
}
