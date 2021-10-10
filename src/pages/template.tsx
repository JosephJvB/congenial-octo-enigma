import * as React from "react"
import { useRef, useState } from "react"
import "../styles/main.css"

import { Coords, Placeholder, ToolbarStates } from "../types"

const Template = () => {
  const [toolbarState, setToolbarState] = useState<ToolbarStates>('')
  const canvasStyle = {
    cursor: toolbarState == '' ? 'default' : 'crosshair',
    margin: '0 auto',
  }
  const [startCoords, setStartCoords] = useState<Coords>({ x: 0, y: 0 })
  const [mouseDown, setMouseDown] = useState(false)
  const [pendingElement, setPendingElement] = useState<Placeholder | null>(null)
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (toolbarState == '' || !canvasRef.current) {
      return
    }
    setMouseDown(true)
    const coords: Coords = {
      x: e.clientX - canvasRef.current.offsetLeft,
      y: e.clientY - canvasRef.current.offsetTop,
    }
    console.log('handleMouseDown', coords)
    setStartCoords(coords)
  }
  const handleMouseUp = (e: React.MouseEvent) => {
    if (toolbarState == '' || !canvasRef.current) {
      return
    }
    setMouseDown(false)
    // setToolbarState('')
    // console.log('handleMouseUp', startCoords, endCoords)
    if (pendingElement) {
      setPlaceholders([...placeholders, pendingElement])
      setPendingElement(null)
    }
    // setStartCoords({
    //   x: 0,
    //   y: 0,
    // })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (toolbarState == '' || !mouseDown || !canvasRef.current) {
      return
    }

    const pendingParams: Placeholder = {
      type: toolbarState,
      left: startCoords.x,
      top: startCoords.y,
      w: e.clientX - canvasRef.current.offsetLeft - startCoords.x,
      h: e.clientY - canvasRef.current.offsetTop - startCoords.y,
    }
    if (pendingParams.w < 0) {
      pendingParams.w = Math.abs(pendingParams.w)
      pendingParams.left = startCoords.x - pendingParams.w
    }
    if (pendingParams.h < 0) {
      pendingParams.h = Math.abs(pendingParams.h)
      pendingParams.top = startCoords.y - pendingParams.h
    }
    console.log('handleMouseMove', pendingParams)
    if (pendingParams.w < 10 && pendingParams.h < 10) {
      return
    }
    setPendingElement(pendingParams)
  }

  const updateToolbarState = (t: ToolbarStates) => {
    console.log('before', toolbarState)
    if (toolbarState == t) {
      setToolbarState('')
    } else {
      setToolbarState(t)
    }
    console.log('after', toolbarState)
  }

  const renderPlaceholders = () => {
    const list = [...placeholders]
    if (pendingElement) {
      list.push(pendingElement)
    }
    return (
      list.map((p: Placeholder, i: number) => {
        const pClass = `placeholder ${p.type}Placeholder`
        const pStyle = {
          width: p.w + 'px',
          height: p.h + 'px',
          top: p.top + 'px',
          left: p.left + 'px',
          zIndex: 10 + i,
        }
        return (
          <div className={pClass} style={pStyle} key={i}>
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
        <h1 className="headerFont textCenter textOrange">hello future lennie</h1>
      </header>
      <div className="templateContainer">
        <div className="toolbar">
          <button
            style={toolbarState == '' ? {background: 'grey'} : {}}
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
          onMouseMove={e => handleMouseMove(e)}
          onMouseDown={e => handleMouseDown(e)}
          onMouseUp={e => handleMouseUp(e)}>
          {renderPlaceholders()}
        </div>
      </div>
    </main>
  )
}

export default Template