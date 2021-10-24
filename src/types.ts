import React from "react";

export interface Coords {
  x: number
  y: number
}
export interface PlaceholderCoords extends Coords {
  h: number
  w: number
}
export type ToolbarStates = '' | 'text' | 'image'
export type PlaceholderTypes = 'text' | 'image'
export type TransformDirections = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
export interface Placeholder {
  type: PlaceholderTypes
  pending: boolean
  coords: PlaceholderCoords
}
export interface PlaceholderNode extends Coords {
  direction: TransformDirections
}
export interface TemplateComponentProps {
  placeholders: Placeholder[]
  setPlaceholders: (p: Placeholder[]) => void
  toolbarState: ToolbarStates
}
export interface PlaceholderComponentProps {
  placeholder: Placeholder
  i: number
  setMouseMoveFn: (fn: noop | null) => void
}
export type noop = (...args: any) => void