"use client"

import { useState, useCallback, useMemo } from 'react'
import { 
  ARGUMENTS, 
  buildPropertyRegistry, 
  WORLDVIEW_TIERS,
  type WorldviewPreset 
} from '@/lib/arguments-data'

export type { WorldviewPreset }

export interface SliderState {
  value: number
  activated: boolean
}

export interface ProbabilityState {
  // Core premise values: argId -> premiseId -> state
  corePremises: Record<string, Record<string, SliderState>>
  // Post premise values: argId -> postPremiseId -> state
  postPremises: Record<string, Record<string, SliderState>>
}

export interface Contribution {
  argId: string
  postId: string
  val: number
  entailed: boolean
  sourceProp?: string
}

export interface CombinedProperty {
  combined: number
  contributions: Contribution[]
}

export function useProbabilityEngine() {
  const [state, setState] = useState<ProbabilityState>(() => {
    const initial: ProbabilityState = { corePremises: {}, postPremises: {} }
    ARGUMENTS.forEach(arg => {
      initial.corePremises[arg.id] = {}
      arg.corePremises.forEach(p => {
        initial.corePremises[arg.id][p.id] = { value: 50, activated: false }
      })
      initial.postPremises[arg.id] = {}
      arg.postPremises.forEach(pp => {
        initial.postPremises[arg.id][pp.id] = { value: 50, activated: false }
      })
    })
    return initial
  })

  const propertyRegistry = useMemo(() => buildPropertyRegistry(), [])

  // Update a core premise
  const setCoreValue = useCallback((argId: string, premiseId: string, value: number) => {
    setState(prev => ({
      ...prev,
      corePremises: {
        ...prev.corePremises,
        [argId]: {
          ...prev.corePremises[argId],
          [premiseId]: { value, activated: true }
        }
      }
    }))
  }, [])

  // Update a post premise
  const setPostValue = useCallback((argId: string, postId: string, value: number) => {
    setState(prev => ({
      ...prev,
      postPremises: {
        ...prev.postPremises,
        [argId]: {
          ...prev.postPremises[argId],
          [postId]: { value, activated: true }
        }
      }
    }))
  }, [])

  // Calculate core probability for an argument (product of premises)
  const getCoreProb = useCallback((argId: string): number | null => {
    const arg = ARGUMENTS.find(a => a.id === argId)
    if (!arg) return null
    
    const coreState = state.corePremises[argId]
    if (!coreState) return null
    
    const vals: number[] = []
    for (const p of arg.corePremises) {
      const s = coreState[p.id]
      if (!s || !s.activated) return null
      vals.push(s.value)
    }
    
    return vals.reduce((acc, v) => acc * (v / 100), 1)
  }, [state.corePremises])

  // Get contribution from a specific post-premise
  const getContribution = useCallback((argId: string, postId: string): number | null => {
    const core = getCoreProb(argId)
    if (core === null) return null
    
    const postState = state.postPremises[argId]
    if (!postState) return null
    
    const s = postState[postId]
    if (!s || !s.activated) return null
    
    return core * (s.value / 100)
  }, [getCoreProb, state.postPremises])

  // Calculate final post-argument probability (core * all post premises)
  const getPostFinal = useCallback((argId: string): number | null => {
    const core = getCoreProb(argId)
    if (core === null) return null
    
    const arg = ARGUMENTS.find(a => a.id === argId)
    if (!arg) return null
    
    const postState = state.postPremises[argId]
    if (!postState) return null
    
    let prod = core
    for (const pp of arg.postPremises) {
      const s = postState[pp.id]
      if (!s || !s.activated) return null
      prod *= s.value / 100
    }
    
    return prod
  }, [getCoreProb, state.postPremises])

  // Calculate combined property across all arguments using noisy-OR
  const getCombinedProperty = useCallback((propKey: string): CombinedProperty | null => {
    const reg = propertyRegistry[propKey]
    if (!reg) return null
    
    const contributions: Contribution[] = []
    
    // Direct contributors
    reg.contributors.forEach(c => {
      const v = getContribution(c.argId, c.postId)
      if (v !== null) {
        contributions.push({ argId: c.argId, postId: c.postId, val: v, entailed: false })
      }
    })
    
    // Entailed contributors
    if (reg.entailedContributors) {
      reg.entailedContributors.forEach(c => {
        const v = getContribution(c.argId, c.postId)
        if (v !== null) {
          const isDupe = contributions.some(
            existing => existing.argId === c.argId && existing.postId === c.postId
          )
          if (!isDupe) {
            contributions.push({ 
              argId: c.argId, 
              postId: c.postId, 
              val: v, 
              entailed: true, 
              sourceProp: c.sourceProp 
            })
          }
        }
      })
    }
    
    if (contributions.length === 0) return null
    
    // Noisy-OR: combined = 1 - product(1 - contribution)
    const combined = 1 - contributions.reduce((acc, c) => acc * (1 - c.val), 1)
    
    return { combined, contributions }
  }, [getContribution, propertyRegistry])

  // Calculate cumulative theism probability (at least one argument succeeds)
  const getCumulativeTheism = useCallback((): number | null => {
    const coreProbs: number[] = []
    ARGUMENTS.forEach(arg => {
      const p = getCoreProb(arg.id)
      if (p !== null) coreProbs.push(p)
    })
    
    if (coreProbs.length === 0) return null
    
    // P(at least one) = 1 - product(1 - P_i)
    return 1 - coreProbs.reduce((acc, p) => acc * (1 - p), 1)
  }, [getCoreProb])

  // Calculate worldview tier probability
  const getWorldviewProb = useCallback((tierId: string): number | null => {
    const tier = WORLDVIEW_TIERS.find(t => t.id === tierId)
    if (!tier) return null
    
    let prob = 1
    for (const propKey of tier.requiredProps) {
      const res = getCombinedProperty(propKey)
      if (!res) return null
      prob *= res.combined
    }
    
    return prob
  }, [getCombinedProperty])

  // Get all property keys
  const allPropertyKeys = useMemo(() => Object.keys(propertyRegistry), [propertyRegistry])

  // Get stats
  const getStats = useCallback(() => {
    let coresComputed = 0
    let coreSum = 0
    let strongestName = "—"
    let strongestVal = -1
    let propsWithData = 0
    
    ARGUMENTS.forEach(arg => {
      const core = getCoreProb(arg.id)
      if (core !== null) {
        coresComputed++
        coreSum += core
        if (core > strongestVal) {
          strongestVal = core
          strongestName = arg.title
        }
      }
    })
    
    allPropertyKeys.forEach(pk => {
      const res = getCombinedProperty(pk)
      if (res) propsWithData++
    })
    
    return {
      argsRated: coresComputed,
      totalArgs: ARGUMENTS.length,
      avgCore: coresComputed > 0 ? coreSum / coresComputed : null,
      strongestArg: strongestName,
      strongestVal: strongestVal >= 0 ? strongestVal : null,
      propsAssessed: propsWithData,
      totalProps: allPropertyKeys.length,
      cumulativeTheism: getCumulativeTheism()
    }
  }, [getCoreProb, getCombinedProperty, getCumulativeTheism, allPropertyKeys])

  // Reset all values
  const resetAll = useCallback(() => {
    const initial: ProbabilityState = { corePremises: {}, postPremises: {} }
    ARGUMENTS.forEach(arg => {
      initial.corePremises[arg.id] = {}
      arg.corePremises.forEach(p => {
        initial.corePremises[arg.id][p.id] = { value: 50, activated: false }
      })
      initial.postPremises[arg.id] = {}
      arg.postPremises.forEach(pp => {
        initial.postPremises[arg.id][pp.id] = { value: 50, activated: false }
      })
    })
    setState(initial)
  }, [])

  return {
    state,
    setCoreValue,
    setPostValue,
    getCoreProb,
    getPostFinal,
    getContribution,
    getCombinedProperty,
    getCumulativeTheism,
    getWorldviewProb,
    getStats,
    resetAll,
    propertyRegistry,
    allPropertyKeys
  }
}

export type ProbabilityEngine = ReturnType<typeof useProbabilityEngine>
