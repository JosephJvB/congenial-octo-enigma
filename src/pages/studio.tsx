import * as React from "react"
import { useState } from "react"
import TemplateComponent from "../components/template"
import "../styles/main.css"
import { ToolbarStates, Placeholder } from "../types"


const Studio = () => {
  const [toolbarState, setToolbarState] = useState<ToolbarStates>('')
  const [imagePlaceholders, setImagePlaceholders] = useState<Placeholder[]>([])
  const [textPlaceholders, setTextPlaceholders] = useState<Placeholder[]>([])

  const updateToolbarState = (t: ToolbarStates) => {
    console.log('updateToolbarState', t)
    if (toolbarState == t) {
      setToolbarState('')
    } else {
      setToolbarState(t)
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
              setImagePlaceholders([])
              setTextPlaceholders([])
              setToolbarState('')
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
      <TemplateComponent
        imagePlaceholders={imagePlaceholders}
        textPlaceholders={textPlaceholders}
        setImagePlaceholders={setImagePlaceholders}
        setTextPlaceholders={setTextPlaceholders}
        toolbarState={toolbarState} />
    </main>
  )
}

export default Studio