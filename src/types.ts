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
export type DragStates = ''
  | 'create:image'
  | 'translate:image'
  | 'transform:image'
  | 'create:text'
  | 'translate:text'
  | 'transform:text'
export type TransformDirections = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
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
export interface PlaceholderNode {
  direction: TransformDirections
  top: string
  left: string
  zIndex: number
}
export interface TemplateComponentProps {
  placeholders: Placeholder[]
  dragState: DragStates
  setActiveTemplate: (t: Template) => void
  updateDragState: (t: DragStates) => void
}
export interface PlaceholderComponentProps {
  placeholder: Placeholder
  i: number
  dragState: DragStates
  updateDragState: (ds: DragStates) => void
  setDragStart: (coords: Coords) => void
  setMouseDown: (b: boolean) => void
  setFocusedIndex: (i: number) => void
}