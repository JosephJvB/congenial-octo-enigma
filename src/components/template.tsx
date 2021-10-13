import * as React from "react"
import { useRef, useState } from "react"
import "../styles/main.css"

import { Coords, Placeholder, PlaceholderComponentProps, PlaceholderTypes, TemplateComponentProps } from "../types"
import PlaceholderComponent from "./placeholder"

const TemplateComponent = (props: TemplateComponentProps) => {
  const templateStyle = {
    cursor: props.toolbarState == '' ? 'default' : 'crosshair',
    margin: '0 auto',
  }
  const [dragStart, setDragStart] = useState<Coords>({ x: 0, y: 0 })
  const [mouseDown, setMouseDown] = useState(false)
  const [pendingPlaceholder, setPendingPlaceholder] = useState<Placeholder | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const templateRef = useRef<HTMLDivElement>(null)

  const updatePlaceholders = (p: Placeholder[]) => {
    props.update({
      placeholders: p
    })
  }
  const templateMouseDown = (e: React.MouseEvent) => {
    if (props.toolbarState == '' || !templateRef.current) {
      return
    }
    setMouseDown(true)
    const coords: Coords = {
      x: e.clientX - templateRef.current.offsetLeft,
      y: e.clientY - templateRef.current.offsetTop,
    }
    console.log('templateMouseDown', coords)
    setDragStart(coords)
  }
  const templateMouseUp = (e: React.MouseEvent) => {
    if (!templateRef.current) {
      return
    }
    setMouseDown(false)
    // setProps.ToolbarState('')
    if (pendingPlaceholder) {
      updatePlaceholders([...props.placeholders, pendingPlaceholder])
      setPendingPlaceholder(null)
    }
  }
  const templateMouseMove = (e: React.MouseEvent) => {
    if (!mouseDown || !templateRef.current) {
      return
    }

    const coords: Coords = {
      x: e.clientX - templateRef.current.offsetLeft,
      y: e.clientY - templateRef.current.offsetTop,
    }
    // console.log('templateMouseMove', coords)
    if (props.toolbarState == '' && focusedIndex != null) {
      const copy = [...props.placeholders]
      copy[focusedIndex].left += coords.x - dragStart.x
      copy[focusedIndex].top += coords.y - dragStart.y
      updatePlaceholders(copy)
      setDragStart(coords)
      return
    }

    const pendingParams: Placeholder = {
      type: props.toolbarState as PlaceholderTypes,
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
    // console.log('templateMouseMove', pendingParams)
    if (pendingParams.w < 10 && pendingParams.h < 10) {
      return
    }
    setPendingPlaceholder(pendingParams)
  }

  const placeholderMouseDown = (e: React.MouseEvent, i: number) => {
    if (!templateRef.current) {
      return
    }
    e.stopPropagation()
    setMouseDown(true)
    const coords: Coords = {
      x: e.clientX - templateRef.current.offsetLeft,
      y: e.clientY - templateRef.current.offsetTop,
    }
    setDragStart(coords)
    if (props.placeholders[i]) {
      setFocusedIndex(i)
    }
    console.log('placeholderMouseDown')
  }
  const placeholderMouseUp = (e: React.MouseEvent, i: number) => {
    console.log('placeholderMouseUp')
    setMouseDown(false)
    setFocusedIndex(null)
  }

  const renderOnePlaceholder = (p: Placeholder, i: number) => {
    const props: PlaceholderComponentProps = {
      i,
      placeholder: p,
      mouseDown: placeholderMouseDown,
      mouseUp: placeholderMouseUp,
    }
    return (
      <PlaceholderComponent {...props} key={i} />
    )
  }

  return (
    <div className="templateContainer">
      <div className="templateCanvas"
        style={templateStyle}
        ref={templateRef}
        onMouseMove={e => templateMouseMove(e)}
        onMouseDown={e => templateMouseDown(e)}
        onMouseUp={e => templateMouseUp(e)}>
        {props.placeholders.map((p, i) => renderOnePlaceholder(p, i + 5))}
        {pendingPlaceholder && renderOnePlaceholder(pendingPlaceholder, 999)}
      </div>
    </div>
  )
}

export default TemplateComponent