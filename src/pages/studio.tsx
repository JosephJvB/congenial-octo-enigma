import * as React from "react"
import { useRef, useState } from "react"
import "../styles/main.css"

import { Coords, Placeholder, PlaceholderTypes, ToolbarStates } from "../types"

const Template = () => {
  const [toolbarState, setToolbarState] = useState<ToolbarStates>('')
  const canvasStyle = {
    cursor: toolbarState == '' ? 'default' : 'crosshair',
    margin: '0 auto',
  }
  const [dragStart, setDragStart] = useState<Coords>({ x: 0, y: 0 })
  const [mouseDown, setMouseDown] = useState(false)
  const [pendingPlaceholder, setPendingPlaceholder] = useState<Placeholder | null>(null)
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const canvasMouseDown = (e: React.MouseEvent) => {
    if (toolbarState == '' || !canvasRef.current) {
      return
    }
    setMouseDown(true)
    const coords: Coords = {
      x: e.clientX - canvasRef.current.offsetLeft,
      y: e.clientY - canvasRef.current.offsetTop,
    }
    console.log('canvasMouseDown', coords)
    setDragStart(coords)
  }
  const canvasMouseUp = (e: React.MouseEvent) => {
    if (!canvasRef.current) {
      return
    }
    setMouseDown(false)
    // setToolbarState('')
    if (pendingPlaceholder) {
      setPlaceholders([...placeholders, pendingPlaceholder])
      setPendingPlaceholder(null)
    }
  }
  const canvasMouseMove = (e: React.MouseEvent) => {
    if (!mouseDown || !canvasRef.current) {
      return
    }

    // console.log('canvasMouseMove')
    const coords: Coords = {
      x: e.clientX - canvasRef.current.offsetLeft,
      y: e.clientY - canvasRef.current.offsetTop,
    }
    console.log('canvasMouseMove', coords)
    if (toolbarState == '' && focusedIndex != null) {
      const copy = [...placeholders]
      copy[focusedIndex].left += coords.x - dragStart.x
      copy[focusedIndex].top += coords.y - dragStart.y
      setPlaceholders(copy)
      setDragStart(coords)
      return
    }

    const pendingParams: Placeholder = {
      type: toolbarState as PlaceholderTypes,
      left: dragStart.x,
      top: dragStart.y,
      w: coords.x - dragStart.x,
      h: coords.y - dragStart.y,
    }
    if (pendingParams.w < 0) {
      pendingParams.w = Math.abs(pendingParams.w)
      pendingParams.left = dragStart.x - pendingParams.w
    }
    if (pendingParams.h < 0) {
      pendingParams.h = Math.abs(pendingParams.h)
      pendingParams.top = dragStart.y - pendingParams.h
    }
    // console.log('canvasMouseMove', pendingParams)
    if (pendingParams.w < 10 && pendingParams.h < 10) {
      return
    }
    setPendingPlaceholder(pendingParams)
  }

  const placeholderMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current || !(e.target instanceof HTMLElement)) {
      return
    }
    e.stopPropagation()
    setMouseDown(true)
    setToolbarState('')
    const coords: Coords = {
      x: e.clientX - canvasRef.current.offsetLeft,
      y: e.clientY - canvasRef.current.offsetTop,
    }
    setDragStart(coords)
    const index = Number(e.target?.dataset.idx)
    if (placeholders[index]) {
      setFocusedIndex(index)
    }
    console.log('placeholderMouseDown')
  }
  const placeholderMouseUp = (e: React.MouseEvent) => {
    console.log('placeholderMouseUp')
    setMouseDown(false)
    setFocusedIndex(null)
  }

  const updateToolbarState = (t: ToolbarStates) => {
    console.log('updateToolbarState', t)
    if (toolbarState == t) {
      setToolbarState('')
    } else {
      setToolbarState(t)
    }
  }

  const renderPlaceholders = () => {
    const copy = [...placeholders]
    if (pendingPlaceholder) {
      copy.push(pendingPlaceholder)
    }
    return (
      copy.map((p: Placeholder, i: number) => {
        const pClass = `placeholder ${p.type}Placeholder`
        const pStyle = {
          width: p.w + 'px',
          height: p.h + 'px',
          top: p.top + 'px',
          left: p.left + 'px',
          zIndex: 10 + i,
        }
        return (
          // need to add nodes for drag/transform
          <div data-idx={i} className={pClass} style={pStyle} key={i}
            onMouseDown={e => placeholderMouseDown(e)}
            onMouseUp={e => placeholderMouseUp(e)}>
            <span>x: {p.left}</span>
            <span>y: {p.top}</span>
            <span>h: {p.h}</span>
            <span>w: {p.w}</span>
          </div>
        )
      })
    )
  }

  return (
    <main>
      <header>
        <h1 className="headerFont textCenter textOrange">email design studio</h1>
      </header>
      <div className="templateContainer">
        <div className="toolbar">
          <button
            onClick={() => {
              setPendingPlaceholder(null)
              setPlaceholders([])
              setFocusedIndex(null)
              setMouseDown(false)
            }}
            className="clearIcon">C</button>
          <button
            style={toolbarState == '' ? {background: 'grey'} : {}}
            onClick={() => updateToolbarState('')}
            className="pointerIcon">P</button>
          <button
            style={toolbarState == 'text' ? {background: 'grey'} : {}}
            onClick={() => updateToolbarState('text')}
            className="addTextIcon">A</button>
          <button
            style={toolbarState == 'image' ? {background: 'grey'} : {}}
            onClick={() => updateToolbarState('image')}
            className="addImageIcon">Img</button>
        </div>
        <div className="templateCanvas"
          style={canvasStyle}
          ref={canvasRef}
          onMouseMove={e => canvasMouseMove(e)}
          onMouseDown={e => canvasMouseDown(e)}
          onMouseUp={e => canvasMouseUp(e)}>
          {renderPlaceholders()}
        </div>
      </div>
    </main>
  )
}

export default Template