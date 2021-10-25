import * as React from "react"
import { useRef, useState } from "react"
import "../styles/main.css"

import { Coords, noop, Placeholder, PlaceholderComponentProps, TemplateComponentProps } from "../types"
import PlaceholderComponent from "./placeholder"

const TemplateComponent = (props: TemplateComponentProps) => {
  const templateStyle = {
    cursor: props.toolbarState == '' ? 'default' : 'crosshair',
    margin: '0 auto',
  }
  const [pendingPlaceholder, setPendingPlaceholder] = useState<Placeholder | null>(null)
  // https://stackoverflow.com/questions/55621212/is-it-possible-to-react-usestate-in-react
  // try to handle all mouseMoves from here because listening for MouseMove inside a v small html element is hard
  // eg: placeholder transform node
  const [mouseMoveFn, setMouseMoveFn] = useState<noop | null>(null)
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
  React.useEffect(() => {
    console.log('mouseMoveFn changed', mouseMoveFn?.name)
  }, [mouseMoveFn])

  // mousedown, mousemove, mouseup
  const templateMouseDown = (e: React.MouseEvent) => {
    if (!templateRef.current || props.toolbarState == '') {
      return
    }
    console.log('setMouseMoveFn', templateMouseMove.name)
    const coords: Coords = {
      x: e.clientX - templateRef.current.offsetLeft,
      y: e.clientY - templateRef.current.offsetTop,
    }
    console.log('templateMouseDown', coords)
    const nextPlaceholder = {
      pending: true,
      type: props.toolbarState,
      coords: {
        ...coords,
        w: 0,
        h: 0,
      }
    }
    setPendingPlaceholder(nextPlaceholder)
    setMouseMoveFn(() => (e: React.MouseEvent) => templateMouseMove(e, nextPlaceholder))
  }
  // issue with pendingPlaceholder undefined, setState function clojure?
  const templateMouseMove = (e: React.MouseEvent, mDownPlaceholder: Placeholder) => {
    if (!templateRef.current || !mDownPlaceholder) {
      return
    }
    const mMoveCoords: Coords = {
      x: e.clientX - templateRef.current.offsetLeft,
      y: e.clientY - templateRef.current.offsetTop,
    }
    const nextCoords = {...mDownPlaceholder.coords}
    nextCoords.w = mMoveCoords.x - nextCoords.x
    nextCoords.h = mMoveCoords.y - nextCoords.y
    if (nextCoords.w < 0) {
      nextCoords.w = Math.abs(nextCoords.w)
      nextCoords.x = nextCoords.x - nextCoords.w
    }
    if (nextCoords.h < 0) {
      nextCoords.h = Math.abs(nextCoords.h)
      nextCoords.y = nextCoords.y - nextCoords.h
    }
    setPendingPlaceholder({
      ...mDownPlaceholder,
      coords: nextCoords
    })
  }
  const templateMouseUp = (e: React.MouseEvent) => {
    console.log('templateMouseUp')
    setMouseMoveFn(null)
    setPendingPlaceholder(null)
    if (!pendingPlaceholder) {
      return
    }
    // dont add placeholders that are too small
    if (pendingPlaceholder.coords.w < 10 && pendingPlaceholder.coords.h < 10) {
      return
    }
    if (props.toolbarState == '') {
      return
    }
    pendingPlaceholder.pending = false
    props.placeholders.push(pendingPlaceholder)
    props.setPlaceholders(props.placeholders)
  }

  const renderOnePlaceholder = (p: Placeholder, i: number) => {
    const componentProps: PlaceholderComponentProps = {
      i,
      placeholder: p,
      setMouseMoveFn: setMouseMoveFn,
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
        onMouseMove={e => mouseMoveFn && mouseMoveFn(e)}
        onMouseUp={e => templateMouseUp(e)}>
        {props.placeholders.map((p, i) => renderOnePlaceholder(p, i))}
        {pendingPlaceholder && renderOnePlaceholder(pendingPlaceholder, props.placeholders.length)}
      </div>
    </div>
  )
}

export default TemplateComponent