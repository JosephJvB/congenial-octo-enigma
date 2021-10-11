import * as React from "react"
import { useRef } from "react"
import "../styles/main.css"
import { PlaceholderComponentProps } from "../types"

const PlaceholderComponent = (props: PlaceholderComponentProps) => {
  const pClass = `placeholder ${props.placeholder.type}Placeholder`
  const pStyle = {
    width: props.placeholder.w + 'px',
    height: props.placeholder.h + 'px',
    top: props.placeholder.top + 'px',
    left: props.placeholder.left + 'px',
    zIndex: 10 + props.index,
  }

  const element = useRef<HTMLDivElement>(null)

  const mouseDown = (e: React.MouseEvent) => {

  }
  const mouseMove = (e: React.MouseEvent) => {

  }
  const mouseUp = (e: React.MouseEvent) => {

  }
  const emitData = () => {

  }
  return (
    // need to add nodes for drag/transform
    <div className={pClass} style={pStyle} key={props.index}
      ref={element}
      onMouseDown={e => mouseDown(e)}
      onMouseMove={e => mouseMove(e)}
      onMouseUp={e => mouseUp(e)}>
      <span>x: {props.placeholder.left}</span>
      <span>y: {props.placeholder.top}</span>
      <span>h: {props.placeholder.h}</span>
      <span>w: {props.placeholder.w}</span>
    </div>
  )
}

export default PlaceholderComponent