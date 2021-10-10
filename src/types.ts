export type ToolbarStates = '' | 'text' | 'image';
export interface Coords {
  x: number
  y: number
}
export type PlaceholderTypes = 'text' | 'image'
export interface Placeholder {
  type: PlaceholderTypes
  top: number
  left: number
  h: number
  w: number
}