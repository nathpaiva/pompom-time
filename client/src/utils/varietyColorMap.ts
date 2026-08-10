import { Variety_Enum } from '@graph/types'

export const varietyColorMap: Record<
  Variety_Enum,
  { background: string; text: string }
> = {
  [Variety_Enum.Pulse]: { background: '#D885A3', text: '#FFFFFF' },
  [Variety_Enum.Intensity]: { background: '#7897AB', text: '#FFFFFF' },
  [Variety_Enum.Resistance]: { background: '#655D8A', text: '#FFFFFF' },
  [Variety_Enum.Strength]: { background: '#F2C6B6', text: '#2E2438' },
}
