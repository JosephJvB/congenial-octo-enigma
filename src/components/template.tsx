import * as React from "react"
import { useRef, useState } from "react"
import "../styles/main.css"

import { Coords, Placeholder, PlaceholderComponentProps, TemplateComponentProps } from "../types"
import PlaceholderComponent from "./placeholder"

const TemplateComponent = (props: TemplateComponentProps) => {
  const templateStyle = {
    cursor: props.toolbarState == '' ? 'default' : 'crosshair',
    margin: '0 auto',
  }
  const [dragStart, setDragStart] = useState<Coords>({ x: 0, y: 0 })
  const [mouseDown, setMouseDown] = useState(false)
  const [pendingPlaceholder, setPendingPlaceholder] = useState<Placeholder | null>(null)
  const templateRef = useRef<HTMLDivElement>(null)

  // log changes
  React.useEffect(() => {
    console.log('props.textPlaceholdersChanged', props.textPlaceholders)
  }, [props.textPlaceholders])
  React.useEffect(() => {
    console.log('props.imagePlaceholdersChanged', props.imagePlaceholders)
  }, [props.imagePlaceholders])

  // mousedown, mousemove, mouseup
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
    if (!templateRef.current || props.toolbarState == '' || !mouseDown) {
      return
    }
    const pendingType = pendingPlaceholder?.type || props.toolbarState
    if (pendingType != 'image' && pendingType != 'text') {
      return
    }
    const coords: Coords = {
      x: e.clientX - templateRef.current.offsetLeft,
      y: e.clientY - templateRef.current.offsetTop,
    }
    const pendingParams: Placeholder = {
      pending: true,
      type: pendingType,
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
    if (pendingParams.w < 10 && pendingParams.h < 10) {
      return
    }
    setPendingPlaceholder(pendingParams)
  }
  const templateMouseUp = (e: React.MouseEvent) => {
    console.log('templateMouseUp')
    setMouseDown(false)
    if (!pendingPlaceholder) {
      return
    }
    pendingPlaceholder.pending = false
    if (props.toolbarState == 'image') {
      props.setImagePlaceholders([...props.imagePlaceholders, pendingPlaceholder])
    }
    if (props.toolbarState == 'text') {
      props.setTextPlaceholders([...props.textPlaceholders, pendingPlaceholder])
    }
    setPendingPlaceholder(null)
  }

  const renderOnePlaceholder = (p: Placeholder, i: number) => {
    const updateFn: (p: Placeholder[]) => void = {
      text: props.setTextPlaceholders,
      image: props.setImagePlaceholders,
    }[p.type]
    const componentProps: PlaceholderComponentProps = {
      i,
      placeholder: p,
      updatePlaceholders: updateFn
    }
    // if I create different components for Image/Text
    // const component = {
    //   'image': ImagePlaceholder
    // }[p.type]
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
        {props.imagePlaceholders.map((p, i) => renderOnePlaceholder(p, i))}
        {props.textPlaceholders.map((p, i) => renderOnePlaceholder(p, i))}
        {pendingPlaceholder && renderOnePlaceholder(pendingPlaceholder, 999)}
      </div>
    </div>
  )
}

export default TemplateComponent