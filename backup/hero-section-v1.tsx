export function HeroSection() {
  return (
    <section className="relative bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Philosophy of Religion
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Arguments for the
            <br />
            <span className="text-primary">Existence of God</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-pretty">
            Explore classical and contemporary arguments for theism. Input your
            credence in each premise to see how conclusions follow and calculate
            cumulative probability.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm text-secondary-foreground">
                6 Arguments
              </span>
            </div>
            <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-sm text-secondary-foreground">
                Interactive Sliders
              </span>
            </div>
            <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-chart-3" />
              <span className="text-sm text-secondary-foreground">
                Cumulative Analysis
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
