import * as React from "react"
import { useState } from "react"
import "../styles/main.css"

import Tweet from "../components/tweet"
import EmailForm from "../components/emailForm"

const IndexPage = () => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main>
      <title>hello future lennie</title>
      <header>
        <h1 className="headerFont textCenter textOrange">hello future lennie</h1>
      </header>
      <Tweet />
      {
        modalOpen
        ? <EmailForm closeModal={() => setModalOpen(false)} />
        : <div className="row">
            <button className="orangeButton composeButton" onClick={() => setModalOpen(true)}>compose time capsule message</button>
          </div>
      }
    </main>
  )
}

export default IndexPage