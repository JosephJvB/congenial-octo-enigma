import React from "react";

export interface Coords {
  x: number
  y: number
}
export interface PositionCoords extends Coords {
  top: number
  left: number
}
export type ToolbarStates = '' | 'text' | 'image';
export enum PlaceholderTypes {
  text = 'text',
  image = 'image'
}
export type dragTypes = 'createPlaceholder'
  | 'translatePlaceholder'
  | 'transformPlaceholder'
export type transformDirections = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
export interface Template {
  placeholders: Placeholder[]
}
export interface Placeholder {
  type: PlaceholderTypes
  top: number
  left: number
  h: number
  w: number
}
export interface TemplateComponentProps {
  placeholders: Placeholder[]
  toolbarState: ToolbarStates
  update: (t: Template) => void
}
export interface PlaceholderComponentProps {
  placeholder: Placeholder
  i: number
  mouseDown: (e: React.MouseEvent, i: number) => void
  mouseUp: (e: React.MouseEvent, i: number) => void
}