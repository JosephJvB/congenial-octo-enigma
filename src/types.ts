import React from "react";

export interface Coords {
  x: number
  y: number
}
export interface PositionCoords extends Coords {
  top: number
  left: number
}
export type ToolbarStates = '' | 'text' | 'image'
export type PlaceholderTypes = 'text' | 'image'
export type TransformDirections = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
export interface Placeholder {
  type: PlaceholderTypes
  top: number
  left: number
  h: number
  w: number
  pending: boolean
}
export interface PlaceholderNode {
  direction: TransformDirections
  top: string
  left: string
}
export interface TemplateComponentProps {
  imagePlaceholders: Placeholder[]
  textPlaceholders: Placeholder[]
  setImagePlaceholders: (p: Placeholder[]) => void
  setTextPlaceholders: (p: Placeholder[]) => void
  toolbarState: ToolbarStates
}
export interface PlaceholderComponentProps {
  placeholder: Placeholder
  i: number
  updatePlaceholders: (p: Placeholder[]) => void
}