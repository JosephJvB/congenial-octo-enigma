import * as React from "react"
import "../styles/main.css"
import { PlaceholderComponentProps } from "../types"

const PlaceholderComponent = (props: PlaceholderComponentProps) => {
  const {
    w,
    h,
    top,
    left,
    type,
  } = props.placeholder

  const pClass = `placeholder ${type}Placeholder`
  const pStyle = {
    width: w + 'px',
    height: h + 'px',
    top: top + 'px',
    left: left + 'px',
    zIndex: 10 + props.i,
  }
  return (
    // need to add nodes for drag/transform
    <div className={pClass} style={pStyle}
      onMouseDown={e => props.mouseDown(e, props.i)}
      onMouseUp={e => props.mouseUp(e, props.i)}>
      <div className="debugWrapper">
        <span>x: {left}</span>
        <span>y: {top}</span>
        <span>h: {h}</span>
        <span>w: {w}</span>
      </div>
      <div className="transformWrapper">
        <span style={{ zIndex: 11 + 1, top: '-4.5px', left: '-4.5px' }} className="transformNode nw"></span>
        <span style={{ zIndex: 11 + 1, top: '-4.5px', left: (w / 2) - 4.5 + 'px' }} className="transformNode n"></span>
        <span style={{ zIndex: 11 + 1, top: '-4.5px', left: w - 4.5 + 'px' }} className="transformNode ne"></span>
        <span style={{ zIndex: 11 + 1, top: (h / 2) - 4.5 + 'px', left: w - 4.5 + 'px' }} className="transformNode e"></span>
        <span style={{ zIndex: 11 + 1, top: h - 4.5 + 'px', left: w - 4.5 + 'px' }} className="transformNode se"></span>
        <span style={{ zIndex: 11 + 1, top: h - 4.5 + 'px', left: (w / 2) - 4.5 + 'px' }} className="transformNode s"></span>
        <span style={{ zIndex: 11 + 1, top: h - 4.5 + 'px', left: '-4.5px' }} className="transformNode se"></span>
        <span style={{ zIndex: 11 + 1, top: (h / 2) - 4.5 + 'px', left: '-4.5px' }} className="transformNode e"></span>
      </div>
    </div>
  )
}

export default PlaceholderComponent