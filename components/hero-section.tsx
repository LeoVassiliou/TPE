export function HeroSection() {
  return (
    <div className="text-center py-10 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>
      <h1 className="relative text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance">
        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Theism Probability Engine
        </span>
      </h1>
      <p className="relative mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
        Evaluate classical arguments for theism, rate your confidence in each premise, 
        and watch the probabilities cascade into a unified cumulative case with divine property analysis.
      </p>
    </div>
  )
}
