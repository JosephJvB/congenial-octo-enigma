import * as React from "react"
import { useEffect, useRef, useState } from "react"
import {
  Coords,
  PlaceholderComponentProps,
  PlaceholderCoords,
  PlaceholderNode,
  TransformDirections
} from "../types"
import "../styles/main.css"

const PlaceholderComponent = (props: PlaceholderComponentProps) => {
  const {
    type,
    pending,
    coords,
  } = props.placeholder
  const placeholderRef = useRef<HTMLDivElement>(null)
  const [mouseDown, setMouseDown] = useState<Boolean>(false)
  const [dragStart, setDragStart] = useState<Coords>({ x: 0, y: 0 })
  // using own coords is good for handling updates within the component
  // dont have to rerender all components on single component update
  // harder: how to get coords from within all components to SAVE
  const [ownCoords, setOwnCoords] = useState<PlaceholderCoords>(coords)
  useEffect(() => {
    // pendingPlaceholder will have it's own prop coords change regularly
    // console.log('props.placeholder changed', props.placeholder)
    setOwnCoords(props.placeholder.coords)
  }, [props.placeholder.coords])

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
    setDragStart(coords)
    setMouseDown(true)
  }
  const placeholderMouseMove = (e: React.MouseEvent) => {
    if (!placeholderRef.current || pending || !mouseDown) {
      return
    }
    e.stopPropagation()
    const coords: Coords = {
      x: e.clientX - placeholderRef.current.offsetLeft,
      y: e.clientY - placeholderRef.current.offsetTop,
    }
    setOwnCoords({
      ...ownCoords,
      x: ownCoords.x - dragStart.x + coords.x,
      y: ownCoords.y - dragStart.y + coords.y,
    })
  }
  const placeholderMouseUp = (e: React.MouseEvent) => {
    if (pending || !mouseDown) {
      return
    }
    console.log('placeholderMouseUp')
    e.stopPropagation()
    setMouseDown(false)
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
    setDragStart(coords)
    setMouseDown(true)
  }
  // wip: node move transforms placeholders
  const nodeMouseMove = (e: React.MouseEvent, d: TransformDirections) => {
    if (!placeholderRef.current || pending || !mouseDown) {
      return
    }
    e.stopPropagation()
    const coords: Coords = {
      x: e.clientX - placeholderRef.current.offsetLeft,
      y: e.clientY - placeholderRef.current.offsetTop,
    }
    const nextCoords: PlaceholderCoords = {...ownCoords}
    switch (d) {
      case 'ne':
      case 'nw':
      case 'sw':
      case 'se':
        nextCoords.w += coords.x - dragStart.x
        nextCoords.h += coords.y - dragStart.y
        break
      case 's':
      case 'n':
        // reset x
        nextCoords.h += coords.y - dragStart.y
        break
      case 'e':
      case 'w':
        // reset y
        nextCoords.w += ((ownCoords.x + ownCoords.w) - dragStart.x)
        break
    }
    if (nextCoords.w < 0) {
      nextCoords.w = Math.abs(nextCoords.w)
      nextCoords.x = dragStart.x - nextCoords.w
    }
    if (nextCoords.h < 0) {
      nextCoords.h = Math.abs(nextCoords.h)
      nextCoords.y = dragStart.y - nextCoords.h
    }
    setDragStart(coords)
    setOwnCoords(nextCoords)
  }
  const nodeMouseUp = (e: React.MouseEvent) => {
    console.log('nodeMouseUp')
    e.stopPropagation()
    setMouseDown(false)
  }

  const { w, h, x, y, } = ownCoords
  const pClass = `placeholder ${type}Placeholder`
  const pStyle = {
    width: w + 'px',
    height: h + 'px',
    top: y + 'px',
    left: x + 'px',
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
  return (
    // need to add nodes for drag/transform
    <div className={pClass} style={pStyle} ref={placeholderRef}
      onMouseDown={e => placeholderMouseDown(e)}
      onMouseMove={e => placeholderMouseMove(e)}
      onMouseUp={e => placeholderMouseUp(e)}>
      <div className="debugWrapper">
        <span>x: {x}</span>
        <span>y: {y}</span>
        <span>h: {h}</span>
        <span>w: {w}</span>
      </div>
      <div className="transformWrapper">
        {!pending && nodes.map(n => {
          const style = { zIndex: 11 + props.i, top: n.top, left: n.left }
          const className = `transformNode ${n.direction}`
          return <span key={className} style={style} className={className}
            onMouseDown={e => nodeMouseDown(e)}
            onMouseMove={e => nodeMouseMove(e, n.direction)}
            onMouseUp={e => nodeMouseUp(e)}></span>
        })}
      </div>
    </div>
  )
}

export default PlaceholderComponent