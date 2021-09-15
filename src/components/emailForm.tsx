import * as React from "react"
import { useState } from "react"
import axios from "axios"
import "../styles/main.css"

const lambdaUrl = "https://toirpbw29h.execute-api.ap-southeast-2.amazonaws.com/v1/email"

interface sendData {
  templateId: string
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
  const [sendDate, setSendDate] = useState("")
  const [sendTime, setSendTime] = useState("")
  const [subject, setSubject] = useState("")
  const [bodyText, setBodyText] = useState("")

  async function handleSend(): Promise<any> {
    try {
      await postData({
        templateId: 'd-c9fb10c0dd984cd49da8e209cd032b94',
        email,
        sendAt: new Date(sendDate || 0).getTime(),
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
              <input name="sendAtDate" type="date"
                onChange={e => setSendDate(e.target.value)} />
            </div>
            {/* firefox time picker is rubbish, find another solution!
            <div className="formElement">
              <label htmlFor="sendAtTime">email arrive time</label>
              <input name="sendAtTime" type="time"
                onChange={e => console.log('time change', e.target.value)}
                onInput={e => console.log('time change', e.target)}
                />
            </div> */}
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