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
  console.log('render', props.i)
  return (
    // need to add nodes for drag/transform
    <div className={pClass} style={pStyle} key={props.i} data-key={props.i}
      onMouseDown={e => props.mouseDown(e, props.i)}
      onMouseUp={e => props.mouseUp(e, props.i)}>
      <div className="debugWrapper">
        <span>x: {left}</span>
        <span>y: {top}</span>
        <span>h: {h}</span>
        <span>w: {w}</span>
      </div>
      <div className="transformWrapper">
        <span style={{ zIndex: 11 + 1, top: '-4.5px', left: '-4.5px' }} className="transformNode topLeft"></span>
        <span style={{ zIndex: 11 + 1, top: '-4.5px', left: (w / 2) - 4.5 + 'px' }} className="transformNode topMid"></span>
        <span style={{ zIndex: 11 + 1, top: '-4.5px', left: w - 4.5 + 'px' }} className="transformNode topRight"></span>
        <span style={{ zIndex: 11 + 1, top: (h / 2) - 4.5 + 'px', left: w - 4.5 + 'px' }} className="transformNode midRight"></span>
        <span style={{ zIndex: 11 + 1, top: h - 4.5 + 'px', left: w - 4.5 + 'px' }} className="transformNode botRight"></span>
        <span style={{ zIndex: 11 + 1, top: h - 4.5 + 'px', left: (w / 2) - 4.5 + 'px' }} className="transformNode botMid"></span>
        <span style={{ zIndex: 11 + 1, top: h - 4.5 + 'px', left: '-4.5px' }} className="transformNode botLeft"></span>
        <span style={{ zIndex: 11 + 1, top: (h / 2) - 4.5 + 'px', left: '-4.5px' }} className="transformNode midLeft"></span>
      </div>
    </div>
  )
}

export default PlaceholderComponent