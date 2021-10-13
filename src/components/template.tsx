import * as React from "react"
import { useRef, useState } from "react"
import "../styles/main.css"

import { Coords, Placeholder, PlaceholderComponentProps, PlaceholderTypes, TemplateComponentProps } from "../types"
import PlaceholderComponent from "./placeholder"

const TemplateComponent = (props: TemplateComponentProps) => {
  const templateStyle = {
    cursor: props.dragState == '' ? 'default' : 'crosshair',
    margin: '0 auto',
  }
  const [dragStart, setDragStart] = useState<Coords>({ x: 0, y: 0 })
  const [mouseDown, setMouseDown] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const [pendingPlaceholder, setPendingPlaceholder] = useState<Placeholder | null>(null)
  const templateRef = useRef<HTMLDivElement>(null)

  const updatePlaceholders = (p: Placeholder[]) => {
    console.log('updatePlaceholders', p)
    props.setActiveTemplate({
      placeholders: p
    })
  }

  const templateMouseDown = (e: React.MouseEvent) => {
    if (!templateRef.current) {
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
  const templateMouseMove = (e: React.MouseEvent) => {
    if (!templateRef.current || props.dragState == '' || !mouseDown) {
      console.log('mouseDown', !templateRef.current, props.dragState == '', !mouseDown)
      return
    }
    const coords: Coords = {
      x: e.clientX - templateRef.current.offsetLeft,
      y: e.clientY - templateRef.current.offsetTop,
    }
    // console.log('templateMouseMove', props.dragState, coords)
    switch (props.dragState) {
      case 'create:image':
      case 'create:text':
        updatePendingPlaceholder(coords)
        break
      case 'translate:image':
      case 'translate:text':
        updateExistingPlaceholder(coords)
        break
      case 'transform:image':
      case 'transform:text':
        // todo
        console.log('templateMouseMove', props.dragState, 'not implemented')
        break
    }
  }
  const templateMouseUp = (e: React.MouseEvent) => {
    if (!templateRef.current) {
      return
    }
    setMouseDown(false)
    // setProps.DragState('')
    console.log('templateMouseUp', pendingPlaceholder, props.placeholders)
    if (pendingPlaceholder) {
      updatePlaceholders([...props.placeholders, pendingPlaceholder])
      setPendingPlaceholder(null)
    }
  }
  React.useEffect(() => {
    console.log('props.placeholdersChanged', props.placeholders)
  }, [props.placeholders])
  const updatePendingPlaceholder = (coords: Coords) => {
    const pendingParams: Placeholder = {
      type: props.dragState.split(':')[1] as PlaceholderTypes,
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
  const updateExistingPlaceholder = (coords: Coords) => {
    if (focusedIndex == null) {
      return
    }
    const copy = [...props.placeholders]
    copy[focusedIndex].left += coords.x - dragStart.x
    copy[focusedIndex].top += coords.y - dragStart.y
    updatePlaceholders(copy)
    setDragStart(coords)
  }

  const renderOnePlaceholder = (p: Placeholder, i: number) => {
    const componentProps: PlaceholderComponentProps = {
      i,
      placeholder: p,
      dragState: props.dragState,
      setMouseDown,
      updateDragState: props.updateDragState,
      setDragStart,
      setFocusedIndex,
    }
    console.log('render with', i)
    return (
      <PlaceholderComponent key={i} {...componentProps} />
    )
  }

  return (
    <div className="templateContainer">
      <div className="templateCanvas"
        style={templateStyle}
        ref={templateRef}
        onMouseDown={e => templateMouseDown(e)}
        onMouseMove={e => templateMouseMove(e)}
        onMouseUp={e => templateMouseUp(e)}>
        {props.placeholders.map((p, i) => renderOnePlaceholder(p, i))}
        {pendingPlaceholder && renderOnePlaceholder(pendingPlaceholder, 999)}
      </div>
    </div>
  )
}

export default TemplateComponent