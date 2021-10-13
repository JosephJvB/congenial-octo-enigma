import * as React from "react"
import { useRef } from "react"
import "../styles/main.css"
import { Coords, DragStates, PlaceholderComponentProps, PlaceholderNode } from "../types"

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
  const nodes: PlaceholderNode[] = [
    { zIndex: 11 + 1, top: '-4.5px', left: '-4.5px', direction: 'nw' },
    { zIndex: 11 + 1, top: '-4.5px', left: (w / 2) - 4.5 + 'px', direction: 'n' },
    { zIndex: 11 + 1, top: '-4.5px', left: w - 4.5 + 'px', direction: 'ne' },
    { zIndex: 11 + 1, top: (h / 2) - 4.5 + 'px', left: w - 4.5 + 'px', direction: 'e' },
    { zIndex: 11 + 1, top: h - 4.5 + 'px', left: w - 4.5 + 'px', direction: 'se' },
    { zIndex: 11 + 1, top: h - 4.5 + 'px', left: (w / 2) - 4.5 + 'px', direction: 's' },
    { zIndex: 11 + 1, top: h - 4.5 + 'px', left: '-4.5px', direction: 'sw' },
    { zIndex: 11 + 1, top: (h / 2) - 4.5 + 'px', left: '-4.5px', direction: 'w' },
  ]

  const placeholderRef = useRef<HTMLDivElement>(null)

  const placeholderMouseDown = (e: React.MouseEvent) => {
    console.log('placeholderMouseDown')
    if (!placeholderRef.current) {
      return
    }
    e.stopPropagation()
    props.setMouseDown(true)
    if (props.dragState == '') {
      const ds = 'translate:' + type
      props.updateDragState(ds as DragStates)
      console.log('setFOcxued', props.i)
      props.setFocusedIndex(props.i)
    }
    const coords: Coords = {
      x: e.clientX - placeholderRef.current.offsetLeft,
      y: e.clientY - placeholderRef.current.offsetTop,
    }
    props.setDragStart(coords)
  }
  const placeholderMouseUp = (e: React.MouseEvent) => {
    if (props.dragState.startsWith('c')) {
      return
    }
    console.log('placeholderMouseUp')
    e.stopPropagation()
    props.setMouseDown(false)
    props.updateDragState('')
  }
  console.log('prois.idex', props.i)
  return (
    // need to add nodes for drag/transform
    <div className={pClass} style={pStyle} ref={placeholderRef}
      onMouseDown={e => placeholderMouseDown(e)}
      onMouseUp={e => placeholderMouseUp(e)}
    >
      <div className="debugWrapper">
        <span>x: {left}</span>
        <span>y: {top}</span>
        <span>h: {h}</span>
        <span>w: {w}</span>
      </div>
      <div className="transformWrapper">
        <span style={{ zIndex: 11 + 1, top: '-4.5px', left: '-4.5px' }} className="transformNode nw"></span>
        {nodes.map(n => {
          const style = { zIndex: n.zIndex, top: n.top, left: n.left }
          const className = `transformNode ${n.direction}`
          return <span key={className} style={style} className={className}></span>
        })}
      </div>
    </div>
  )
}

export default PlaceholderComponent