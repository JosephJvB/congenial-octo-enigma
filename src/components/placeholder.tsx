import * as React from "react"
import { useEffect, useRef, useState } from "react"
import {
  Coords,
  PlaceholderComponentProps,
  PlaceholderCoords,
  PlaceholderNode,
} from "../types"
import "../styles/main.css"

const PlaceholderComponent = (props: PlaceholderComponentProps) => {
  const {
    type,
    pending,
    coords,
  } = props.placeholder
  const placeholderRef = useRef<HTMLDivElement>(null)
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
    props.setMouseMoveFn(() => placeholderMouseMove)
  }
  const placeholderMouseMove = (e: React.MouseEvent) => {
    if (!placeholderRef.current || pending) {
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
    if (pending) {
      return
    }
    console.log('placeholderMouseUp')
    e.stopPropagation()
    props.setMouseMoveFn(null)
  }

  // node listeners
  const nodeMouseDown = (e: React.MouseEvent, n: PlaceholderNode) => {
    if (!placeholderRef.current) {
      return
    }
    e.stopPropagation()
    const coords: Coords = {
      x: e.clientX - placeholderRef.current.offsetLeft,
      y: e.clientY - placeholderRef.current.offsetTop,
    }
    console.log('nodeMouseDown', coords)
    setDragStart(coords)
  }
  // wip: node move transforms placeholders
  const nodeMouseMove = (e: React.MouseEvent, n: PlaceholderNode) => {
    if (!placeholderRef.current || pending) {
      return
    }
    e.stopPropagation()
    const coords: Coords = {
      x: e.clientX - placeholderRef.current.offsetLeft,
      y: e.clientY - placeholderRef.current.offsetTop,
    }
    console.log('nodeMouseMove', coords)
    const nextCoords: PlaceholderCoords = {...ownCoords}
    let x = 0, y = 0, w= 0, h = 0
    switch (n.direction) {
      case 'ne':
      case 'nw':
      case 'sw':
      case 'se':
        nextCoords.w += coords.x - dragStart.x
        nextCoords.h += coords.y - dragStart.y
        break
      case 's':
      case 'n':
        break
      case 'e':
        w = coords.x - dragStart.x
        break
      case 'w':
        break
    }
    nextCoords.x += x
    nextCoords.y += y
    nextCoords.w += w
    nextCoords.h += h
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
    { y: -4.5, x: -4.5, direction: 'nw' },
    { y: -4.5, x: (w / 2) - 4.5, direction: 'n' },
    { y: -4.5, x: w - 4.5, direction: 'ne' },
    { y: (h / 2) - 4.5, x: w - 4.5, direction: 'e' },
    { y: h - 4.5, x: w - 4.5, direction: 'se' },
    { y: h - 4.5, x: (w / 2) - 4.5, direction: 's' },
    { y: h - 4.5, x: -4.5, direction: 'sw' },
    { y: (h / 2) - 4.5, x: -4.5, direction: 'w' },
  ]
  return (
    // need to add nodes for drag/transform
    <div className={pClass} style={pStyle} ref={placeholderRef}
      onMouseDown={e => placeholderMouseDown(e)}
      onMouseUp={e => placeholderMouseUp(e)}>
      <div className="debugWrapper">
        <span>x: {x}</span>
        <span>y: {y}</span>
        <span>h: {h}</span>
        <span>w: {w}</span>
      </div>
      <div className="transformWrapper">
        {!pending && nodes.map(n => {
          const style = { zIndex: 11 + props.i, top: n.y + 'px', left: n.x + 'px' }
          const className = `transformNode ${n.direction}`
          return <span key={className} style={style} className={className}
              onMouseUp={e => nodeMouseUp(e)}
              onMouseDown={e => nodeMouseDown(e, n)}>
            </span>
        })}
      </div>
    </div>
  )
}

export default PlaceholderComponent