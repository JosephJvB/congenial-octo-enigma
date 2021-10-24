import * as React from "react"
import { useRef } from "react"
import "../styles/main.css"
import { Coords, PlaceholderComponentProps, PlaceholderNode } from "../types"

const PlaceholderComponent = (props: PlaceholderComponentProps) => {
  const {
    w,
    h,
    top,
    left,
    type,
    pending,
  } = props.placeholder

  const pClass = `placeholder ${type}Placeholder`
  const pStyle = {
    width: w + 'px',
    height: h + 'px',
    top: top + 'px',
    left: left + 'px',
    zIndex: 10 + props.i,
  }
  const nodes: PlaceholderNode[] = [
    { top: '-4.5px', left: '-4.5px', direction: 'nw' },
    { top: '-4.5px', left: (w / 2) - 4.5 + 'px', direction: 'n' },
    { top: '-4.5px', left: w - 4.5 + 'px', direction: 'ne' },
    { top: (h / 2) - 4.5 + 'px', left: w - 4.5 + 'px', direction: 'e' },
    { top: h - 4.5 + 'px', left: w - 4.5 + 'px', direction: 'se' },
    { top: h - 4.5 + 'px', left: (w / 2) - 4.5 + 'px', direction: 's' },
    { top: h - 4.5 + 'px', left: '-4.5px', direction: 'sw' },
    { top: (h / 2) - 4.5 + 'px', left: '-4.5px', direction: 'w' },
  ]

  const placeholderRef = useRef<HTMLDivElement>(null)

  // placeholder listeners
  const placeholderMouseDown = (e: React.MouseEvent) => {
    if (pending) {
      return
    }
    console.log('placeholderMouseDown')
    if (!placeholderRef.current) {
      return
    }
    e.stopPropagation()
    const coords: Coords = {
      x: e.clientX - placeholderRef.current.offsetLeft,
      y: e.clientY - placeholderRef.current.offsetTop,
    }
  }
  const placeholderMouseMove = (e: React.MouseEvent) => {
    if (pending) {
      return
    }
    e.stopPropagation()
  }
  const placeholderMouseUp = (e: React.MouseEvent) => {
    if (pending) {
      return
    }
    console.log('placeholderMouseUp')
    e.stopPropagation()
  }
  // node listeners
  const nodeMouseDown = (e: React.MouseEvent) => {
    console.log('nodeMouseDown')
    if (!placeholderRef.current) {
      return
    }
    e.stopPropagation()
    const coords: Coords = {
      x: e.clientX - placeholderRef.current.offsetLeft,
      y: e.clientY - placeholderRef.current.offsetTop,
    }
  }
  const nodeMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  const nodeMouseUp = (e: React.MouseEvent) => {
    console.log('nodeMouseUp')
    e.stopPropagation()
  }
  return (
    // need to add nodes for drag/transform
    <div className={pClass} style={pStyle} ref={placeholderRef}
      onMouseDown={e => placeholderMouseDown(e)}
      onMouseMove={e => placeholderMouseMove(e)}
      onMouseUp={e => placeholderMouseUp(e)}>
      <div className="debugWrapper">
        <span>x: {left}</span>
        <span>y: {top}</span>
        <span>h: {h}</span>
        <span>w: {w}</span>
      </div>
      <div className="transformWrapper">
        {!pending && nodes.map(n => {
          const style = { zIndex: 11 + props.i, top: n.top, left: n.left }
          const className = `transformNode ${n.direction}`
          return <span key={className} style={style} className={className}
            onMouseDown={e => nodeMouseDown(e)}
            onMouseMove={e => nodeMouseMove(e)}
            onMouseUp={e => nodeMouseUp(e)}></span>
        })}
      </div>
    </div>
  )
}

export default PlaceholderComponent