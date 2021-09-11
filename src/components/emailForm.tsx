import * as React from "react"
import { useState } from "react"
import axios from "axios"
import "../styles/main.css"

const lambdaUrl = ""

interface sendData {
  email: string
  sendAt: number
  subject: string
  bodyText: string
}

function postData(data: sendData): Promise<any> {
  console.log("postData", data)
  return axios({
    method: "post",
    url: lambdaUrl,
    data
  })
}

interface emailFormProps {
  closeModal: () => void
}

const EmailForm = (props: emailFormProps) => {
  const [email, setEmail] = useState("")
  const [sendAt, setSendAt] = useState("")
  const [subject, setSubject] = useState("")
  const [bodyText, setBodyText] = useState("")

  async function handleSend(): Promise<any> {
    try {
      await postData({
        email,
        sendAt: new Date(sendAt).getTime(),
        subject,
        bodyText
      })
    } catch (e) {
      console.error(e)
    }
    props.closeModal()
  }
  return (
    <>
      <div className="modalBackground" onClick={() => props.closeModal()}></div>
      <div className="modalContainer">
        <h3 className="modalHeader headerFont textOrange textCenter">dear future me...</h3>
        <form onSubmit={e => e.preventDefault()}>
          <div className="row" style={{justifyContent:'space-between'}}>
            <div className="formElement w50">
              <label htmlFor="Email">email address</label>
              <input type="email" name="Email" onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="formElement">
              <label htmlFor="sendAtDate">email arrive date</label>
              <input type="date" name="sendAtDate" onChange={e => setSendAt(e.target.value)} />
            </div>
          </div>
          <div className="formElement w50">
            <label htmlFor="subject">subject</label>
            <input type="text" name="subject" onChange={e => setSubject(e.target.value)} />
          </div>
          <div className="formElement row">
            <label htmlFor="bodyText">email body text</label>
            <textarea
              name="bodyText"
              onChange={e => setBodyText(e.target.value)}
              // cols="30"
              rows={10}
              ></textarea>
          </div>
          <div className="formElement row">
            <button className="orangeButton sendButton" onClick={() => handleSend()}>send</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EmailForm