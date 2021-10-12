import * as React from "react"
import { useState } from "react"
import TemplateComponent from "../components/template"
import "../styles/main.css"
import { Template, ToolbarStates } from "../types"


const Studio = () => {
  const [toolbarState, setToolbarState] = useState<ToolbarStates>('')
  const [activeTemplate, setActiveTemplate] = useState<Template>({ placeholders: [] })

  const updateToolbarState = (t: ToolbarStates) => {
    console.log('updateToolbarState', t)
    if (toolbarState == t) {
      setToolbarState('')
    } else {
      setToolbarState(t)
    }
  }
  const updateTemplateState = (t: Template) => {
    setActiveTemplate(t)
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
              // setPendingPlaceholder(null)
              // setPlaceholders([])
              // setFocusedIndex(null)
              // setMouseDown(false)
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
      </div>
      {activeTemplate && <TemplateComponent
        update={updateTemplateState}
        placeholders={activeTemplate.placeholders}
        toolbarState={toolbarState} />}
    </main>
  )
}

export default Studio