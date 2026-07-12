export interface LocalModelRecommendation {
  tier: 'tiny' | 'small' | 'medium' | 'large'
  modelRange: string
  quantization: string
  explanation: string
  minimumFreeGb: number
}

export function estimateWeightMemoryGb(parametersBillions: number, bitsPerWeight: number) {
  if (!Number.isFinite(parametersBillions) || !Number.isFinite(bitsPerWeight) || parametersBillions <= 0 || bitsPerWeight <= 0) {
    throw new Error('Model size and bit width must be positive numbers.')
  }
  return Math.round((parametersBillions * bitsPerWeight / 8) * 100) / 100
}

export function recommendLocalModel(ramGb: number, vramGb = 0): LocalModelRecommendation {
  const safeRam = Number.isFinite(ramGb) ? Math.max(0, ramGb) : 0
  const safeVram = Number.isFinite(vramGb) ? Math.max(0, vramGb) : 0
  const usable = Math.max(safeVram, safeRam * 0.65)

  if (usable >= 24) {
    return {
      tier: 'large',
      modelRange: '20B–32B',
      quantization: '4-bit, benchmark context carefully',
      explanation: 'Enough headroom for a larger quantized model, but context cache and application memory still need measurement.',
      minimumFreeGb: 6,
    }
  }
  if (usable >= 10) {
    return {
      tier: 'medium',
      modelRange: '7B–14B',
      quantization: '4-bit or 5-bit',
      explanation: 'A strong local range for document assistance and structured tasks on modern desktops.',
      minimumFreeGb: 4,
    }
  }
  if (usable >= 4) {
    return {
      tier: 'small',
      modelRange: '1B–7B',
      quantization: '4-bit',
      explanation: 'Use a compact instruction model, shorter context and retrieval to focus the available capacity.',
      minimumFreeGb: 2,
    }
  }
  return {
    tier: 'tiny',
    modelRange: 'sub-1B–3B',
    quantization: '4-bit',
    explanation: 'Begin with a tiny educational model or upgrade memory before designing around a larger assistant.',
    minimumFreeGb: 1,
  }
}
