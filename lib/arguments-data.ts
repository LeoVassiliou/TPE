// ===========================
// WORLDVIEW PRESET TYPE  
// ===========================

export interface WorldviewPreset {
  id: string
  name: string
  prior: number
  coreValues: Record<string, Record<string, number>>
  postValues: Record<string, Record<string, number>>
}

// ===========================
// PROPERTY DEFINITIONS
// ===========================

export interface PropertyMeta {
  label: string
  desc: string
  icon: string
}

export const PROP_META: Record<string, PropertyMeta> = {
  transcendent: {
    label: "Transcendent",
    desc: "Beyond physical spacetime",
    icon: "Globe"
  },
  immaterial: {
    label: "Immaterial",
    desc: "Non-physical in nature",
    icon: "Sparkles"
  },
  personal: {
    label: "Personal",
    desc: "Has mind, will, intention",
    icon: "Brain"
  },
  powerful: {
    label: "Extremely Powerful",
    desc: "Capable of creating universes",
    icon: "Zap"
  },
  intelligent: {
    label: "Intelligent",
    desc: "Designs with purpose and foresight",
    icon: "Lightbulb"
  },
  morally_good: {
    label: "Morally Good",
    desc: "Source or ground of moral values",
    icon: "Scale"
  },
  necessary: {
    label: "Necessary Being",
    desc: "Cannot fail to exist",
    icon: "Crown"
  },
  interacts: {
    label: "Interacts with Creation",
    desc: "Engages with the world",
    icon: "Compass"
  },
  loving: {
    label: "Loving",
    desc: "Cares for creatures",
    icon: "Heart"
  },
  revealed: {
    label: "Self-Revealing",
    desc: "Makes existence known",
    icon: "Cross"
  }
}

// ===========================
// ENTAILMENT MAP
// Properties that probabilistically support other properties
// ===========================

export const ENTAILMENT_MAP: Record<string, string[]> = {
  personal: ["morally_good", "intelligent"],
  intelligent: ["personal"],
  morally_good: ["personal"],
  necessary: ["powerful", "transcendent"],
  loving: ["personal", "morally_good", "interacts"],
  revealed: ["personal", "interacts"]
}

export const ENTAILMENT_WEIGHT = 0.7

// ===========================
// WORLDVIEW TIERS
// ===========================

export interface WorldviewTier {
  id: string
  name: string
  color: string
  requiredProps: string[]
  desc: string
}

export const WORLDVIEW_TIERS: WorldviewTier[] = [
  {
    id: "deism",
    name: "Deism",
    color: "#6366f1",
    requiredProps: ["transcendent", "powerful", "intelligent"],
    desc: "A creator god who does not intervene in the world"
  },
  {
    id: "theism",
    name: "Theism",
    color: "#10b981",
    requiredProps: ["transcendent", "powerful", "intelligent", "personal"],
    desc: "A personal god who interacts with creation"
  },
  {
    id: "perfect_being",
    name: "Perfect Being Theism",
    color: "#f59e0b",
    requiredProps: ["transcendent", "powerful", "intelligent", "personal", "morally_good", "necessary"],
    desc: "A maximally great being with all perfections"
  },
  {
    id: "christian",
    name: "Christian Theism",
    color: "#ec4899",
    requiredProps: ["transcendent", "powerful", "intelligent", "personal", "morally_good", "necessary", "loving", "revealed"],
    desc: "The Christian God who reveals himself and loves creation"
  }
]

// ===========================
// PROPERTY REGISTRY BUILDER
// ===========================

export interface PropertyContributor {
  argId: string
  postId: string
  sourceProp?: string
}

export interface PropertyRegistryEntry {
  contributors: PropertyContributor[]
  entailedContributors?: PropertyContributor[]
}

export function buildPropertyRegistry(): Record<string, PropertyRegistryEntry> {
  const registry: Record<string, PropertyRegistryEntry> = {}
  
  // Initialize all property keys
  Object.keys(PROP_META).forEach(key => {
    registry[key] = { contributors: [], entailedContributors: [] }
  })
  
  // Collect direct contributors from arguments
  ARGUMENTS.forEach(arg => {
    arg.postPremises.forEach(pp => {
      if (registry[pp.propKey]) {
        registry[pp.propKey].contributors.push({
          argId: arg.id,
          postId: pp.id
        })
      }
    })
  })
  
  // Build entailed contributors
  Object.entries(ENTAILMENT_MAP).forEach(([sourceProp, targetProps]) => {
    const sourceContributors = registry[sourceProp]?.contributors || []
    targetProps.forEach(targetProp => {
      if (registry[targetProp]) {
        sourceContributors.forEach(c => {
          registry[targetProp].entailedContributors?.push({
            argId: c.argId,
            postId: c.postId,
            sourceProp
          })
        })
      }
    })
  })
  
  return registry
}

// ===========================
// CORE PREMISE INTERFACE
// ===========================

export interface CorePremise {
  id: string
  text: string
  evidence: string[]
}

// ===========================
// POST-ARGUMENT PREMISE INTERFACE
// ===========================

export interface PostPremise {
  id: string
  text: string
  propKey: string
  evidence: string[]
}

// ===========================
// ARGUMENT INTERFACE
// ===========================

export interface Argument {
  id: string
  title: string
  icon: string
  color: string
  corePremises: CorePremise[]
  coreConclusionText: string
  postPremises: PostPremise[]
}

// ===========================
// ALL ARGUMENTS
// ===========================

export const ARGUMENTS: Argument[] = [
  // ===========================
  // COSMOLOGICAL ARGUMENT
  // ===========================
  {
    id: "cosmological",
    title: "Cosmological Argument",
    icon: "Orbit",
    color: "#6366f1",
    corePremises: [
      {
        id: "c1",
        text: "Everything that begins to exist has a cause.",
        evidence: [
          "Causal principle underlies all of science",
          "Ex nihilo nihil fit - 'from nothing, nothing comes'",
          "Denial leads to arbitrary emergence of things from nothing",
          "Confirmed in every observable instance"
        ]
      },
      {
        id: "c2",
        text: "The universe began to exist.",
        evidence: [
          "Big Bang cosmology: spacetime had an origin ~13.8 billion years ago",
          "Borde-Guth-Vilenkin theorem: any expanding universe is past-incomplete",
          "Thermodynamic arrow of time implies finite past",
          "Actual infinities may be metaphysically impossible"
        ]
      }
    ],
    coreConclusionText: "Therefore, the universe has a cause.",
    postPremises: [
      {
        id: "p1",
        text: "The cause of spacetime must exist outside spacetime.",
        propKey: "transcendent",
        evidence: [
          "Creating spacetime requires existing without spacetime",
          "Cause cannot be subject to what it creates"
        ]
      },
      {
        id: "p2",
        text: "The cause is immaterial (without matter/energy from this universe).",
        propKey: "immaterial",
        evidence: [
          "Matter and energy began with the Big Bang",
          "Cause precedes its effect metaphysically"
        ]
      },
      {
        id: "p3",
        text: "Creating a universe requires immense power.",
        propKey: "powerful",
        evidence: [
          "Total energy content of universe is staggering",
          "Creating from nothing requires unlimited causal potency"
        ]
      },
      {
        id: "p4",
        text: "A timeless, immaterial cause that produces a temporal effect is plausibly personal (agent causation).",
        propKey: "personal",
        evidence: [
          "Impersonal causes produce effects necessarily and immediately",
          "A timeless cause producing a temporal effect suggests libertarian free will",
          "Agent causation explains the asymmetry"
        ]
      }
    ]
  },

  // ===========================
  // TELEOLOGICAL ARGUMENT
  // ===========================
  {
    id: "teleological",
    title: "Fine-Tuning Argument",
    icon: "Target",
    color: "#f59e0b",
    corePremises: [
      {
        id: "t1",
        text: "The universe is fine-tuned for the existence of intelligent life.",
        evidence: [
          "Cosmological constants (e.g., gravitational constant) in extraordinarily narrow range",
          "Ratio of electromagnetic to gravitational force: 1 in 10^40",
          "Initial entropy: 1 in 10^(10^123) (Penrose)",
          "Strong/weak nuclear force ratios, cosmological constant, etc."
        ]
      },
      {
        id: "t2",
        text: "Fine-tuning is due to physical necessity, chance, or design.",
        evidence: [
          "These exhaust the logical possibilities",
          "Theory of Everything would show physical necessity",
          "No evidence physical constants couldn't have been different"
        ]
      },
      {
        id: "t3",
        text: "Fine-tuning is not due to physical necessity or chance.",
        evidence: [
          "No successful Theory of Everything constraining constants",
          "Chance: probability is vanishingly small",
          "Multiverse hypothesis is speculative and may itself require explanation"
        ]
      }
    ],
    coreConclusionText: "Therefore, fine-tuning is due to design.",
    postPremises: [
      {
        id: "p1",
        text: "The designer must have extraordinary intelligence to calibrate constants.",
        propKey: "intelligent",
        evidence: [
          "Setting dozens of independent parameters requires vast knowledge",
          "Understanding consequences of each value combination"
        ]
      },
      {
        id: "p2",
        text: "The designer must be immensely powerful to implement the design.",
        propKey: "powerful",
        evidence: [
          "Creating a universe with precise parameters requires enormous power",
          "Sustaining the design through cosmic history"
        ]
      },
      {
        id: "p3",
        text: "Designing for life suggests purposive intention.",
        propKey: "personal",
        evidence: [
          "Design implies a designer with intentions",
          "Purpose implies mind and will"
        ]
      },
      {
        id: "p4",
        text: "The designer transcends the physical universe designed.",
        propKey: "transcendent",
        evidence: [
          "Cannot be part of what was designed",
          "Exists independently of the designed system"
        ]
      }
    ]
  },

  // ===========================
  // MORAL ARGUMENT
  // ===========================
  {
    id: "moral",
    title: "Moral Argument",
    icon: "Scale",
    color: "#10b981",
    corePremises: [
      {
        id: "m1",
        text: "If God does not exist, objective moral values and duties do not exist.",
        evidence: [
          "Naturalism struggles to ground objective 'oughtness'",
          "Evolution explains moral beliefs, not moral truths",
          "Without transcendent standard, morality is relative or subjective",
          "Moral realism requires a foundation beyond nature"
        ]
      },
      {
        id: "m2",
        text: "Objective moral values and duties do exist.",
        evidence: [
          "Torturing innocents for fun is objectively wrong",
          "Human rights presuppose objective moral truths",
          "Moral progress implies objective standard",
          "Near-universal condemnation of certain acts"
        ]
      }
    ],
    coreConclusionText: "Therefore, God exists.",
    postPremises: [
      {
        id: "p1",
        text: "God is the ground of moral goodness.",
        propKey: "morally_good",
        evidence: [
          "If God grounds objective morality, God must be good",
          "Divine nature is the standard of goodness"
        ]
      },
      {
        id: "p2",
        text: "A moral lawgiver must be personal (having will and intentions).",
        propKey: "personal",
        evidence: [
          "Moral duties are owed to persons",
          "Commands require a commander",
          "Impersonal forces don't issue obligations"
        ]
      },
      {
        id: "p3",
        text: "God transcends the natural world to ground objective morality.",
        propKey: "transcendent",
        evidence: [
          "Natural facts alone don't yield 'oughts'",
          "Transcendent ground needed for universal applicability"
        ]
      }
    ]
  },

  // ===========================
  // CONTINGENCY ARGUMENT
  // ===========================
  {
    id: "contingency",
    title: "Contingency Argument",
    icon: "RefreshCw",
    color: "#8b5cf6",
    corePremises: [
      {
        id: "co1",
        text: "Everything that exists has an explanation of its existence (either in the necessity of its own nature or in an external cause).",
        evidence: [
          "Principle of Sufficient Reason (Leibniz)",
          "Denial leads to brute, unexplained facts",
          "Science assumes explicability",
          "Explanatory coherence is a rational ideal"
        ]
      },
      {
        id: "co2",
        text: "The universe exists.",
        evidence: [
          "Self-evident",
          "We observe the universe exists"
        ]
      },
      {
        id: "co3",
        text: "The universe does not exist by the necessity of its own nature.",
        evidence: [
          "Universe could have been different or not existed at all",
          "Physical constants are contingent",
          "Possible worlds with different universes are conceivable"
        ]
      }
    ],
    coreConclusionText: "Therefore, the universe has an external cause that exists necessarily.",
    postPremises: [
      {
        id: "p1",
        text: "A necessary being cannot fail to exist.",
        propKey: "necessary",
        evidence: [
          "By definition of necessity",
          "Exists in all possible worlds"
        ]
      },
      {
        id: "p2",
        text: "The necessary being transcends the contingent universe.",
        propKey: "transcendent",
        evidence: [
          "External to what it explains",
          "Not subject to contingent conditions"
        ]
      },
      {
        id: "p3",
        text: "A necessary being grounding all contingent reality is immensely powerful.",
        propKey: "powerful",
        evidence: [
          "Sustains all contingent existence",
          "Source of all derived being"
        ]
      },
      {
        id: "p4",
        text: "The necessary ground is plausibly immaterial.",
        propKey: "immaterial",
        evidence: [
          "Material things are contingent",
          "Necessity implies independence from material conditions"
        ]
      }
    ]
  },

  // ===========================
  // ONTOLOGICAL ARGUMENT
  // ===========================
  {
    id: "ontological",
    title: "Ontological Argument",
    icon: "Gem",
    color: "#ec4899",
    corePremises: [
      {
        id: "o1",
        text: "It is possible that a maximally great being exists.",
        evidence: [
          "The concept is coherent and involves no contradiction",
          "Maximal greatness is conceivable",
          "Burden of proof is on those denying possibility"
        ]
      },
      {
        id: "o2",
        text: "If it is possible that a maximally great being exists, then it exists in some possible world.",
        evidence: [
          "By definition of possibility in modal logic (S5)",
          "Possible existence means existence in at least one possible world"
        ]
      },
      {
        id: "o3",
        text: "A maximally great being, if it exists in any possible world, exists in all possible worlds.",
        evidence: [
          "Maximal greatness includes necessary existence",
          "A being that could fail to exist is not maximally great",
          "Necessary existence is greater than contingent existence"
        ]
      },
      {
        id: "o4",
        text: "If a maximally great being exists in all possible worlds, it exists in the actual world.",
        evidence: [
          "The actual world is a possible world",
          "S5 modal logic: ◇□P → □P"
        ]
      }
    ],
    coreConclusionText: "Therefore, a maximally great being exists in the actual world.",
    postPremises: [
      {
        id: "p1",
        text: "A maximally great being is omnipotent.",
        propKey: "powerful",
        evidence: [
          "Power is a great-making property",
          "Maximal greatness implies maximal power"
        ]
      },
      {
        id: "p2",
        text: "A maximally great being is omniscient.",
        propKey: "intelligent",
        evidence: [
          "Knowledge is a great-making property",
          "Maximal greatness implies maximal knowledge"
        ]
      },
      {
        id: "p3",
        text: "A maximally great being is morally perfect.",
        propKey: "morally_good",
        evidence: [
          "Moral goodness is a great-making property",
          "Maximal greatness implies moral perfection"
        ]
      },
      {
        id: "p4",
        text: "A maximally great being exists necessarily.",
        propKey: "necessary",
        evidence: [
          "Necessary existence is a great-making property",
          "Already established by the argument structure"
        ]
      }
    ]
  },

  // ===========================
  // RELIGIOUS EXPERIENCE
  // ===========================
  {
    id: "experience",
    title: "Religious Experience",
    icon: "Cross",
    color: "#06b6d4",
    corePremises: [
      {
        id: "re1",
        text: "Millions of people across cultures and history report experiences of the divine.",
        evidence: [
          "Cross-cultural phenomenon spanning millennia",
          "Mystical experiences share common features",
          "Not limited to one religion or culture",
          "Include visions, answered prayers, transformations"
        ]
      },
      {
        id: "re2",
        text: "In the absence of defeaters, it is rational to trust experiences as generally reliable (principle of credulity).",
        evidence: [
          "We trust sense experience by default",
          "Consistency and transformative effects provide corroboration",
          "Total skepticism is self-undermining"
        ]
      },
      {
        id: "re3",
        text: "There are no universal defeaters for religious experience.",
        evidence: [
          "Neurological explanations don't disprove veridicality",
          "Wish-fulfillment theory doesn't apply universally",
          "Many experiences are unwanted or surprising"
        ]
      }
    ],
    coreConclusionText: "Therefore, religious experiences provide evidence for the divine.",
    postPremises: [
      {
        id: "p1",
        text: "The divine encountered is personal (responds, communicates).",
        propKey: "personal",
        evidence: [
          "Experiencers report relationship, communication",
          "Sense of being known and loved",
          "Interactive rather than impersonal force"
        ]
      },
      {
        id: "p2",
        text: "The divine actively reveals itself.",
        propKey: "revealed",
        evidence: [
          "Experiences are often unsought",
          "Sense of being encountered, not just discovered"
        ]
      },
      {
        id: "p3",
        text: "The divine interacts with creation.",
        propKey: "interacts",
        evidence: [
          "Answered prayers, guidance, transformation",
          "Not deistic absence"
        ]
      },
      {
        id: "p4",
        text: "The divine is experienced as loving and caring.",
        propKey: "loving",
        evidence: [
          "Common report of overwhelming love",
          "Sense of being accepted and valued"
        ]
      }
    ]
  },

  // ===========================
  // CONSCIOUSNESS ARGUMENT
  // ===========================
  {
    id: "consciousness",
    title: "Consciousness Argument",
    icon: "Compass",
    color: "#f97316",
    corePremises: [
      {
        id: "con1",
        text: "Consciousness (subjective experience, qualia) exists.",
        evidence: [
          "Indubitable from first-person perspective",
          "'Cogito ergo sum' – I think, therefore I am",
          "The hard problem of consciousness acknowledges this"
        ]
      },
      {
        id: "con2",
        text: "Consciousness cannot be fully explained by physical processes alone.",
        evidence: [
          "The 'hard problem' of consciousness (Chalmers)",
          "Explanatory gap between brain states and subjective experience",
          "Knowledge argument (Mary's Room)",
          "Conceivability of zombies"
        ]
      },
      {
        id: "con3",
        text: "The existence of consciousness is better explained by theism than naturalism.",
        evidence: [
          "If ultimate reality is mental/personal, consciousness is expected",
          "If ultimate reality is purely physical, consciousness is surprising",
          "God as supreme consciousness makes our consciousness unsurprising"
        ]
      }
    ],
    coreConclusionText: "Therefore, theism better explains consciousness.",
    postPremises: [
      {
        id: "p1",
        text: "God as supreme consciousness grounds all derivative consciousness.",
        propKey: "personal",
        evidence: [
          "Mind comes from Mind",
          "Consciousness as fundamental feature of reality"
        ]
      },
      {
        id: "p2",
        text: "The source of consciousness is immaterial.",
        propKey: "immaterial",
        evidence: [
          "If consciousness is non-physical, its source likely is too",
          "Dualism points to immaterial reality"
        ]
      },
      {
        id: "p3",
        text: "Creating conscious beings requires immense power and knowledge.",
        propKey: "intelligent",
        evidence: [
          "Consciousness is the most complex known phenomenon",
          "Designing sentient beings implies supreme intelligence"
        ]
      }
    ]
  }
]

// ===========================
// WORLDVIEW PRESETS
// ===========================

export const WORLDVIEW_PRESETS: WorldviewPreset[] = [
  {
    id: "agnostic",
    name: "Agnostic Neutral",
    prior: 50,
    coreValues: {
      cosmological: { c1: 70, c2: 65 },
      teleological: { t1: 75, t2: 95, t3: 50 },
      moral: { m1: 50, m2: 80 },
      contingency: { co1: 70, co2: 99, co3: 75 },
      ontological: { o1: 40, o2: 95, o3: 85, o4: 99 },
      experience: { re1: 90, re2: 65, re3: 45 },
      consciousness: { con1: 99, con2: 55, con3: 45 }
    },
    postValues: {
      cosmological: { p1: 85, p2: 80, p3: 90, p4: 55 },
      teleological: { p1: 80, p2: 85, p3: 70, p4: 80 },
      moral: { p1: 75, p2: 70, p3: 70 },
      contingency: { p1: 90, p2: 85, p3: 80, p4: 70 },
      ontological: { p1: 95, p2: 95, p3: 95, p4: 95 },
      experience: { p1: 65, p2: 60, p3: 60, p4: 60 },
      consciousness: { p1: 70, p2: 65, p3: 70 }
    }
  },
  {
    id: "skeptic",
    name: "Skeptic",
    prior: 15,
    coreValues: {
      cosmological: { c1: 40, c2: 50 },
      teleological: { t1: 60, t2: 95, t3: 25 },
      moral: { m1: 25, m2: 70 },
      contingency: { co1: 45, co2: 99, co3: 60 },
      ontological: { o1: 15, o2: 95, o3: 85, o4: 99 },
      experience: { re1: 85, re2: 40, re3: 20 },
      consciousness: { con1: 99, con2: 30, con3: 20 }
    },
    postValues: {
      cosmological: { p1: 60, p2: 55, p3: 70, p4: 30 },
      teleological: { p1: 55, p2: 60, p3: 45, p4: 55 },
      moral: { p1: 50, p2: 45, p3: 50 },
      contingency: { p1: 70, p2: 60, p3: 55, p4: 45 },
      ontological: { p1: 85, p2: 85, p3: 85, p4: 85 },
      experience: { p1: 30, p2: 25, p3: 30, p4: 35 },
      consciousness: { p1: 35, p2: 30, p3: 35 }
    }
  },
  {
    id: "theist",
    name: "Classical Theist",
    prior: 65,
    coreValues: {
      cosmological: { c1: 95, c2: 85 },
      teleological: { t1: 90, t2: 95, t3: 80 },
      moral: { m1: 85, m2: 95 },
      contingency: { co1: 90, co2: 99, co3: 90 },
      ontological: { o1: 70, o2: 95, o3: 90, o4: 99 },
      experience: { re1: 95, re2: 85, re3: 75 },
      consciousness: { con1: 99, con2: 85, con3: 80 }
    },
    postValues: {
      cosmological: { p1: 95, p2: 95, p3: 95, p4: 85 },
      teleological: { p1: 95, p2: 95, p3: 90, p4: 95 },
      moral: { p1: 95, p2: 90, p3: 90 },
      contingency: { p1: 98, p2: 95, p3: 95, p4: 90 },
      ontological: { p1: 99, p2: 99, p3: 99, p4: 99 },
      experience: { p1: 90, p2: 85, p3: 85, p4: 90 },
      consciousness: { p1: 90, p2: 85, p3: 90 }
    }
  },
  {
    id: "naturalist",
    name: "Naturalist",
    prior: 10,
    coreValues: {
      cosmological: { c1: 30, c2: 55 },
      teleological: { t1: 70, t2: 95, t3: 20 },
      moral: { m1: 20, m2: 75 },
      contingency: { co1: 35, co2: 99, co3: 50 },
      ontological: { o1: 10, o2: 95, o3: 85, o4: 99 },
      experience: { re1: 80, re2: 30, re3: 15 },
      consciousness: { con1: 99, con2: 25, con3: 15 }
    },
    postValues: {
      cosmological: { p1: 50, p2: 45, p3: 60, p4: 20 },
      teleological: { p1: 40, p2: 50, p3: 35, p4: 45 },
      moral: { p1: 40, p2: 35, p3: 40 },
      contingency: { p1: 60, p2: 50, p3: 45, p4: 35 },
      ontological: { p1: 80, p2: 80, p3: 80, p4: 80 },
      experience: { p1: 20, p2: 15, p3: 20, p4: 25 },
      consciousness: { p1: 25, p2: 20, p3: 25 }
    }
  },
  {
    id: "plantinga",
    name: "Reformed Epistemology",
    prior: 60,
    coreValues: {
      cosmological: { c1: 85, c2: 75 },
      teleological: { t1: 80, t2: 95, t3: 70 },
      moral: { m1: 80, m2: 90 },
      contingency: { co1: 85, co2: 99, co3: 85 },
      ontological: { o1: 75, o2: 95, o3: 90, o4: 99 },
      experience: { re1: 95, re2: 90, re3: 85 },
      consciousness: { con1: 99, con2: 80, con3: 75 }
    },
    postValues: {
      cosmological: { p1: 90, p2: 85, p3: 90, p4: 80 },
      teleological: { p1: 85, p2: 85, p3: 80, p4: 85 },
      moral: { p1: 90, p2: 85, p3: 85 },
      contingency: { p1: 95, p2: 90, p3: 90, p4: 85 },
      ontological: { p1: 98, p2: 98, p3: 98, p4: 98 },
      experience: { p1: 95, p2: 90, p3: 90, p4: 95 },
      consciousness: { p1: 85, p2: 80, p3: 85 }
    }
  },
  {
    id: "deist",
    name: "Deist",
    prior: 45,
    coreValues: {
      cosmological: { c1: 85, c2: 80 },
      teleological: { t1: 85, t2: 95, t3: 70 },
      moral: { m1: 55, m2: 80 },
      contingency: { co1: 80, co2: 99, co3: 85 },
      ontological: { o1: 50, o2: 95, o3: 85, o4: 99 },
      experience: { re1: 75, re2: 45, re3: 30 },
      consciousness: { con1: 99, con2: 60, con3: 55 }
    },
    postValues: {
      cosmological: { p1: 90, p2: 85, p3: 90, p4: 50 },
      teleological: { p1: 90, p2: 90, p3: 60, p4: 85 },
      moral: { p1: 55, p2: 45, p3: 60 },
      contingency: { p1: 90, p2: 85, p3: 85, p4: 80 },
      ontological: { p1: 90, p2: 90, p3: 70, p4: 90 },
      experience: { p1: 35, p2: 20, p3: 20, p4: 30 },
      consciousness: { p1: 55, p2: 60, p3: 60 }
    }
  }
]
