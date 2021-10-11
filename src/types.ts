import React from "react";

export type ToolbarStates = '' | 'text' | 'image';
export interface Coords {
  x: number
  y: number
}
export interface PositionCoords extends Coords {
  top: number
  left: number
}
export type PlaceholderTypes = 'text' | 'image'
export interface Placeholder {
  type: PlaceholderTypes
  top: number
  left: number
  h: number
  w: number
}
export interface PlaceholderComponentProps {
  placeholder: Placeholder
  index: number
  // Should pass callback functions also
  emitData: (d: PositionCoords) => null
}