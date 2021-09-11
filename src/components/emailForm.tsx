import * as React from "react"
import { useState } from "react"
import axios from "axios"
import "../styles/main.css"

const lambdaUrl = ""

interface sendData {
  to: string
  from: string
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
  const [toEmail, setToEmail] = useState("")
  const [fromEmail, setFromEmail] = useState("")
  const [sendAt, setSendAt] = useState("")
  const [subject, setSubject] = useState("")
  const [bodyText, setBodyText] = useState("")

  function handleSend(): Promise<any> {
    return postData({
      to: toEmail,
      from: fromEmail,
      sendAt: new Date(sendAt).getTime(),
      subject,
      bodyText
    })
  }
  return (
    <>
      <div className="modalBackground" onClick={() => props.closeModal()}></div>
      <div className="modalContainer">
        <h3 className="modalHeader headerFont textOrange textCenter">dear future me...</h3>
        <form onSubmit={e => e.preventDefault()}>
          <div className="row" style={{justifyContent:'space-between'}}>
            <div className="formElement w50">
              <label htmlFor="senderEmail">sender email address</label>
              <input type="email" name="senderEmail" onChange={e => setFromEmail(e.target.value)} />
            </div>
            <div className="formElement">
              <label htmlFor="sendAtDate">email arrive date</label>
              <input type="date" name="sendAtDate" onChange={e => setSendAt(e.target.value)} />
            </div>
          </div>
          <div className="formElement w50">
            <label htmlFor="recipientEmail">recipient email address</label>
            <input type="email" name="recipientEmail" onChange={e => setToEmail(e.target.value)} />
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