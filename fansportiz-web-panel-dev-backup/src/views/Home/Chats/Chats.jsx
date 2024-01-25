import React from 'react'
import { Button, Form, Input } from 'reactstrap'

function Chats () {
  return (
    <>
      <div className="user-container">
        <ul className="m-0 chat-history">
          <li>
            <div className="msg-box">
              <h4>Sofie Hubert</h4>
              <p>This is a fantastic match !</p>
              <span>12:45 AM</span>
            </div>
          </li>
          <li className="text-end">
            <div className="msg-box">
              <p>Looks like India will win it.</p>
              <span>12:50 AM</span>
            </div>
          </li>
          <li>
            <div className="msg-box">
              <h4>Pratima Mukhopadhyay</h4>
              <p>I just lot a huge amount of money !</p>
              <span>01:00 AM</span>
            </div>
          </li>
        </ul>
      </div>
      <div className="chat-footer">
        <Form className="d-flex">
          <Input placeholder="Type something ..." type="text" />
          <Button className="icon-send bg-transparent" type="submit" />
        </Form>
      </div>
    </>
  )
}
export default Chats
