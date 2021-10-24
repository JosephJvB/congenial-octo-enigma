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