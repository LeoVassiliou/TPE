"use client";

import { useState } from "react";
import { ArgumentCard } from "@/components/argument-card";
import { CumulativePanel } from "@/components/cumulative-panel";
import { HeroSection } from "@/components/hero-section";
import { ArgumentNav } from "@/components/argument-nav";

export interface Argument {
  id: string;
  name: string;
  shortName: string;
  description: string;
  premises: Premise[];
  conclusionText: string;
  formula?: string;
}

export interface Premise {
  id: string;
  text: string;
  belief: number;
}

const initialArguments: Argument[] = [
  {
    id: "kalam",
    name: "Kalam Cosmological Argument",
    shortName: "Kalam",
    description:
      "This argument reasons from the beginning of the universe to a transcendent cause.",
    premises: [
      { id: "k1", text: "Everything that begins to exist has a cause.", belief: 50 },
      { id: "k2", text: "The universe began to exist.", belief: 50 },
    ],
    conclusionText: "Therefore, the universe has a cause.",
    formula: "P(Conclusion) = P(Premise 1) × P(Premise 2)",
  },
  {
    id: "fine-tuning",
    name: "Fine-Tuning Argument",
    shortName: "Fine-Tuning",
    description:
      "The physical constants of the universe appear precisely calibrated for life.",
    premises: [
      {
        id: "ft1",
        text: "The fine-tuning of the universe is due to either physical necessity, chance, or design.",
        belief: 50,
      },
      {
        id: "ft2",
        text: "The fine-tuning is not due to physical necessity.",
        belief: 50,
      },
      {
        id: "ft3",
        text: "The fine-tuning is not due to chance.",
        belief: 50,
      },
    ],
    conclusionText: "Therefore, the fine-tuning is due to design.",
    formula: "P(Conclusion) = P(P1) × P(P2) × P(P3)",
  },
  {
    id: "moral",
    name: "Moral Argument",
    shortName: "Moral",
    description:
      "This argument reasons from objective moral values to a transcendent moral lawgiver.",
    premises: [
      {
        id: "m1",
        text: "If God does not exist, objective moral values and duties do not exist.",
        belief: 50,
      },
      {
        id: "m2",
        text: "Objective moral values and duties do exist.",
        belief: 50,
      },
    ],
    conclusionText: "Therefore, God exists.",
    formula: "P(Conclusion) = P(Premise 1) × P(Premise 2)",
  },
  {
    id: "ontological",
    name: "Modal Ontological Argument",
    shortName: "Ontological",
    description:
      "Plantinga's modal version argues from the possibility of a maximally great being to its actual existence.",
    premises: [
      {
        id: "o1",
        text: "It is possible that a maximally great being exists.",
        belief: 50,
      },
      {
        id: "o2",
        text: "If it is possible that a maximally great being exists, then a maximally great being exists in some possible world.",
        belief: 50,
      },
      {
        id: "o3",
        text: "If a maximally great being exists in some possible world, then it exists in every possible world.",
        belief: 50,
      },
      {
        id: "o4",
        text: "If a maximally great being exists in every possible world, then it exists in the actual world.",
        belief: 50,
      },
    ],
    conclusionText: "Therefore, a maximally great being (God) exists.",
    formula: "P(Conclusion) = P(P1) × P(P2) × P(P3) × P(P4)",
  },
  {
    id: "resurrection",
    name: "Resurrection Argument",
    shortName: "Resurrection",
    description:
      "This historical argument examines evidence for Jesus's resurrection as support for Christian theism.",
    premises: [
      {
        id: "r1",
        text: "There are established historical facts concerning Jesus's fate (empty tomb, post-mortem appearances, disciples' belief).",
        belief: 50,
      },
      {
        id: "r2",
        text: "The resurrection hypothesis is the best explanation of these facts.",
        belief: 50,
      },
      {
        id: "r3",
        text: "If the resurrection is the best explanation, it probably occurred.",
        belief: 50,
      },
    ],
    conclusionText:
      "Therefore, Jesus probably rose from the dead, confirming his radical claims.",
    formula: "P(Conclusion) = P(P1) × P(P2) × P(P3)",
  },
  {
    id: "contingency",
    name: "Contingency Argument",
    shortName: "Contingency",
    description:
      "This argument reasons from the existence of contingent beings to a necessary being.",
    premises: [
      {
        id: "c1",
        text: "Everything that exists has an explanation of its existence (either in the necessity of its own nature or in an external cause).",
        belief: 50,
      },
      {
        id: "c2",
        text: "If the universe has an explanation of its existence, that explanation is God.",
        belief: 50,
      },
      {
        id: "c3",
        text: "The universe exists.",
        belief: 50,
      },
    ],
    conclusionText:
      "Therefore, the explanation of the universe's existence is God.",
    formula: "P(Conclusion) = P(P1) × P(P2) × P(P3)",
  },
];

export default function Home() {
  const [args, setArgs] = useState<Argument[]>(initialArguments);
  const [activeArg, setActiveArg] = useState<string>("kalam");

  const updatePremiseBelief = (
    argId: string,
    premiseId: string,
    value: number
  ) => {
    setArgs((prev) =>
      prev.map((arg) =>
        arg.id === argId
          ? {
              ...arg,
              premises: arg.premises.map((p) =>
                p.id === premiseId ? { ...p, belief: value } : p
              ),
            }
          : arg
      )
    );
  };

  const calculateConclusion = (arg: Argument): number => {
    const product = arg.premises.reduce(
      (acc, p) => acc * (p.belief / 100),
      1
    );
    return product * 100;
  };

  const calculateCumulative = (): number => {
    // Using: P(at least one) = 1 - P(none)
    // P(none) = product of (1 - P(each conclusion))
    const probNone = args.reduce((acc, arg) => {
      const conclusionProb = calculateConclusion(arg) / 100;
      return acc * (1 - conclusionProb);
    }, 1);
    return (1 - probNone) * 100;
  };

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ArgumentNav
          args={args}
          activeArg={activeArg}
          setActiveArg={setActiveArg}
          calculateConclusion={calculateConclusion}
        />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            {args
              .filter((arg) => arg.id === activeArg)
              .map((arg) => (
                <ArgumentCard
                  key={arg.id}
                  argument={arg}
                  conclusionProbability={calculateConclusion(arg)}
                  onPremiseChange={updatePremiseBelief}
                />
              ))}
          </div>

          <div className="lg:col-span-1">
            <CumulativePanel
              args={args}
              calculateConclusion={calculateConclusion}
              cumulativeProbability={calculateCumulative()}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
