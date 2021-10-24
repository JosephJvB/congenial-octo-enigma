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
  // React.useEffect(() => {
  //   console.log('props.textPlaceholdersChanged', props.textPlaceholders)
  // }, [props.textPlaceholders])
  // React.useEffect(() => {
  //   console.log('props.imagePlaceholdersChanged', props.imagePlaceholders)
  // }, [props.imagePlaceholders])
  // React.useEffect(() => {
  //   console.log('pendingPlaceholder changed', pendingPlaceholder)
  // }, [pendingPlaceholder])

  // mousedown, mousemove, mouseup
  const templateMouseDown = (e: React.MouseEvent) => {
    if (!templateRef.current || props.toolbarState == '') {
      return
    }
    setMouseDown(true)
    const coords: Coords = {
      x: e.clientX - templateRef.current.offsetLeft,
      y: e.clientY - templateRef.current.offsetTop,
    }
    console.log('templateMouseDown', coords)
    setDragStart(coords)
    setPendingPlaceholder({
      pending: true,
      type: props.toolbarState,
      ...coords,
      w: 0,
      h: 0,
    })
  }
  const templateMouseMove = (e: React.MouseEvent) => {
    if (!templateRef.current || props.toolbarState == '' || !mouseDown || !pendingPlaceholder) {
      return
    }
    const coords: Coords = {
      x: e.clientX - templateRef.current.offsetLeft,
      y: e.clientY - templateRef.current.offsetTop,
    }
    const p = {...pendingPlaceholder}
    p.w = coords.x - dragStart.x
    p.h = coords.y - dragStart.y
    if (p.w < 0) {
      p.w = Math.abs(p.w)
      p.x = dragStart.x - p.w
    }
    if (p.h < 0) {
      p.h = Math.abs(p.h)
      p.y = dragStart.y - p.h
    }
    // console.log('updatependingcoords', pendingPlaceholder)
    setPendingPlaceholder(p)
  }
  const templateMouseUp = (e: React.MouseEvent) => {
    console.log('templateMouseUp')
    setMouseDown(false)
    if (!pendingPlaceholder) {
      return
    }
    setPendingPlaceholder(null)
    // dont add placeholders that are too small
    if (pendingPlaceholder.w < 10 && pendingPlaceholder.h < 10) {
      return
    }
    pendingPlaceholder.pending = false
    if (props.toolbarState == 'image') {
      props.imagePlaceholders.push(pendingPlaceholder)
      props.setImagePlaceholders(props.imagePlaceholders)
    }
    if (props.toolbarState == 'text') {
      props.textPlaceholders.push(pendingPlaceholder)
      props.setTextPlaceholders(props.textPlaceholders)
    }
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