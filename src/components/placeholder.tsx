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
  // using own coords is good for handling updates within the component
  // dont have to rerender all components on single component update
  // harder: how to get coords from within all components to SAVE
  const [ownCoords, setOwnCoords] = useState<PlaceholderCoords>(coords)
  useEffect(() => {
    // pendingPlaceholder will have it's own prop coords change regularly
    // console.log('props.placeholder changed', props.placeholder)
    setOwnCoords(coords)
  }, [props.placeholder.coords])

  // placeholder listeners
  const placeholderMouseDown = (e: React.MouseEvent) => {
    if (!placeholderRef.current || pending) {
      return
    }
    e.stopPropagation()
    console.log('placeholderMouseDown')
    const mDownCoords: Coords = {
      x: e.clientX - placeholderRef.current.offsetLeft,
      y: e.clientY - placeholderRef.current.offsetTop,
    }
    props.setMouseMoveFn(() => (e: React.MouseEvent) => placeholderMouseMove(e, mDownCoords))
  }
  const placeholderMouseMove = (e: React.MouseEvent, mDownCoords: Coords) => {
    if (!placeholderRef.current || pending) {
      return
    }
    e.stopPropagation()
    const mMoveCoords: Coords = {
      x: e.clientX - placeholderRef.current.offsetLeft,
      y: e.clientY - placeholderRef.current.offsetTop,
    }
    const diff: Coords = {
      x: mMoveCoords.x - mDownCoords.x,
      y: mMoveCoords.y - mDownCoords.y,
    }
    // only works properly mutating ownCoords, not updating new values
    // no idea why, can't be bothered with it right now
    ownCoords.x += diff.x
    ownCoords.y += diff.y
    setOwnCoords({
      ...ownCoords,
      // this does not work
      // x: ownCoords.x + diff.x,
      // y: ownCoords.y + diff.y,
    })
  }
  const placeholderMouseUp = (e: React.MouseEvent) => {
    if (pending) {
      return
    }
    e.stopPropagation()
    console.log('placeholderMouseUp')
    props.setMouseMoveFn(null)
  }

  // node listeners
  const nodeMouseDown = (e: React.MouseEvent, n: PlaceholderNode) => {
    if (!placeholderRef.current || pending) {
      return
    }
    e.stopPropagation()
    const mDownCoords: Coords = {
      x: e.clientX - placeholderRef.current.offsetLeft,
      y: e.clientY - placeholderRef.current.offsetTop,
    }
    console.log('nodeMouseDown', coords)
    props.setMouseMoveFn(() => (e: React.MouseEvent) => nodeMouseMove(e, n, mDownCoords))
  }
  // wip: node move transforms placeholders
  const nodeMouseMove = (e: React.MouseEvent, n: PlaceholderNode, mDownCoords: Coords) => {
    e.stopPropagation()
    if (!placeholderRef.current || pending) {
      return
    }
    const mMoveCoords: Coords = {
      x: e.clientX - placeholderRef.current.offsetLeft,
      y: e.clientY - placeholderRef.current.offsetTop,
    }
    let nextCoords: PlaceholderCoords = {...ownCoords}
    switch (n.direction) {
      case 'ne':
      case 'nw':
      case 'sw':
      case 'se':
        break
      case 's':
        nextCoords.h += mMoveCoords.y - mDownCoords.y
        break
      case 'n':
        break
      case 'e': // works - inverting breaks
        nextCoords.w += mMoveCoords.x - mDownCoords.x
        break
      case 'w': // works - inverting breaks
        nextCoords = ownCoords // no idea why but this works. See placeholderMouseMove
        const wDiff = mMoveCoords.x - mDownCoords.x
        nextCoords.x += wDiff
        nextCoords.w -= wDiff
        break
    }
    // if (nextCoords.w < 0) {
    //   console.log('width zero', nextCoords.w)
    //   nextCoords.w = Math.abs(nextCoords.w)
    //   nextCoords.x = ownCoords.x - nextCoords.w
    // }
    if (nextCoords.h < 0) {
      nextCoords.h = Math.abs(nextCoords.h)
      nextCoords.y = ownCoords.y - nextCoords.h
    }
    setOwnCoords({...nextCoords})
  }
  const nodeMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('nodeMouseUp')
    props.setMouseMoveFn(null)
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
              onMouseDown={e => nodeMouseDown(e, n)}
              onMouseUp={e => nodeMouseUp(e)}>
            </span>
        })}
      </div>
    </div>
  )
}

export default PlaceholderComponent