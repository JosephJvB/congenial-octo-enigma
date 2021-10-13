import * as React from "react"
import { useState } from "react"
import TemplateComponent from "../components/template"
import "../styles/main.css"
import { DragStates, Template } from "../types"


const Studio = () => {
  const [dragState, setDragState] = useState<DragStates>('')
  const [activeTemplate, setActiveTemplate] = useState<Template>({ placeholders: [] })

  const updateDragState = (t: DragStates) => {
    console.log('updateDragState', t)
    if (dragState == t) {
      setDragState('')
    } else {
      setDragState(t)
    }
  }

  return (
    <main className="">
      <header>
        <h1 className="headerFont textCenter textOrange">email design studio</h1>
      </header>
      <div className="toolbarContainer">
        <div className="toolbar">
          <button
            onClick={() => {
              setActiveTemplate({ placeholders: [] })
              setDragState('')
            }}
            className="clearIcon">C</button>
          <button
            style={dragState == '' || dragState.startsWith('t') ? {background: 'grey'} : {}}
            onClick={() => updateDragState('')}
            className="pointerIcon">P</button>
          <button
            style={dragState == 'create:text' ? {background: 'grey'} : {}}
            onClick={() => updateDragState('create:text')}
            className="addTextIcon">A</button>
          <button
            style={dragState == 'create:image' ? {background: 'grey'} : {}}
            onClick={() => updateDragState('create:image')}
            className="addImageIcon">Img</button>
        </div>
      </div>
      {activeTemplate && <TemplateComponent
        setActiveTemplate={setActiveTemplate}
        updateDragState={updateDragState}
        placeholders={activeTemplate.placeholders}
        dragState={dragState} />}
    </main>
  )
}

export default Studio