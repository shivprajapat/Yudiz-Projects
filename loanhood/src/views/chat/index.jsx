import PageTitle from 'components/PageTitle'
import React, { useEffect, useState, Fragment } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { deepOrange } from '@material-ui/core/colors'
import Avatar from '@material-ui/core/Avatar'
import SendIcon from '@material-ui/icons/Send'
import Button from '@material-ui/core/Button'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { socketConnection } from 'layout/main-layout/index'
import { GetMessages } from 'state/actions/messages'
import { SendMessages } from 'state/actions/sendMessage'

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      height: '600px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'relative'
    },
    paper2: {
      width: '80vw',
      maxWidth: '500px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'relative'
    },

    container: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    messagesBody: {
      width: 'calc( 100% - 20px )',
      margin: 10,
      overflowY: 'scroll',
      height: 'calc( 100% - 80px )'
    },
    messageRow: {
      display: 'flex'
    },
    messageRowRight: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    messageGreen: {
      position: 'relative',
      marginLeft: '20px',
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#00AB55',
      width: '60%',
      textAlign: 'left',
      font: "400 .9em 'Open Sans', sans-serif",
      border: '1px solid #00AB55',
      borderRadius: '10px',
      '&:after': {
        content: "''",
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '15px solid #00AB55',
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        top: '0',
        left: '-15px'
      },
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '17px solid #00AB55',
        borderLeft: '16px solid transparent',
        borderRight: '16px solid transparent',
        top: '-1px',
        left: '-17px'
      }
    },
    SelfMessage: {
      position: 'relative',
      marginRight: '20px',
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#00AB55',
      width: 'auto',
      textAlign: 'left',
      font: "400 .9em 'Open Sans', sans-serif",
      border: '1px solid #00AB55',
      borderRadius: '10px',
      '&:after': {
        content: "''",
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '15px solid #00AB55',
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        top: '0',
        right: '-15px'
      },
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '17px solid #00AB55',
        borderLeft: '16px solid transparent',
        borderRight: '16px solid transparent',
        top: '-1px',
        right: '-17px'
      }
    },

    messageContent: {
      padding: 0,
      margin: 0
    },
    messageTimeStampRight: {
      position: 'absolute',
      fontSize: '.85em',
      fontWeight: '300',
      marginTop: '10px',
      bottom: '-3px',
      right: '5px'
    },

    avatar: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      width: theme.spacing(4),
      height: theme.spacing(4)
    },
    senderMessage: {
      position: 'absolute',
      right: '10px',
      top: '-20px',
      justifyContent: 'flex-end',
      alignItems: 'end'
    },
    avatarNothing: {
      color: 'transparent',
      backgroundColor: 'transparent',
      width: theme.spacing(4),
      height: theme.spacing(4)
    },
    displayName: {
      marginLeft: '20px'
    },
    wrapForm: {
      display: 'flex',
      justifyContent: 'center',
      width: '95%',
      margin: `${theme.spacing(0)} auto`
    },
    wrapText: {
      width: '100%'
    },
    button: {
      marginLeft: '20px'
    }
  })
)

function Chat() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { senderId, rentalTransactionId, receiverId } = useParams()

  const user = useSelector((state) => state.user.currentUser)
  const Messages = useSelector((state) => state.message.messages)
  const SentMessage = useSelector((state) => state.sendMessages.sendMessages)

  const [list, setList] = useState([])
  const [messageState, setMessageState] = useState('')
  const [offset, setOffset] = useState(0)
  const objDiv = document.getElementById('style-1')

  useEffect(() => {
    if (Messages) {
      if (offset === 0) {
        setList(Messages.rows.reverse())
        scrollToBottom()
      } else {
        setList([...Messages.rows.reverse(), ...list])
        const objDiv = document.getElementById(list[0].id)
        setTimeout(() => {
          objDiv.scrollIntoView()
        }, 100)
      }
    }
  }, [Messages])

  useEffect(() => {
    if (SentMessage) {
      socketConnection.emit('getDashMessages', { rentalTransactionId: rentalTransactionId, senderId: senderId })
      setList([...list, { ...SentMessage, sender: { userName: user.userName } }])
    }
  }, [SentMessage])

  useEffect(() => {
    if (list.length) {
      socketConnection.on('adminMessage', (data) => {
        data.data && setList([...list, data.data])
      })
      scrollToBottom()
    }
  }, [list])

  const handleChange = (e) => {
    setMessageState(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(
      SendMessages({
        receiverId: receiverId,
        rentalTransactionId: rentalTransactionId,
        message: messageState
      })
    )
    setMessageState('')
  }

  useEffect(() => {
    dispatch(GetMessages(rentalTransactionId, offset))
  }, [offset])

  function handleScroll(e) {
    if (!e.target.scrollTop && Messages.isMoreData) {
      setOffset(offset + 1)
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      objDiv && (objDiv.scrollTop = objDiv?.scrollHeight)
    }, 0)
  }

  return (
    <>
      <PageTitle title="Chat" />

      <Paper className={classes.paper}>
        <>
          <div onScroll={handleScroll} id="style-1" className={classes.messagesBody}>
            {list.map((chat) => (
              <Fragment key={chat.id}>
                {chat?.sender?.userName !== user?.userName ? (
                  <div className={classes.messageRow} id={chat.id}>
                    <Avatar alt="avatar" className={classes.avatar} src={chat.sender.avatarUrl}></Avatar>
                    <div>
                      <div className={classes.displayName}>{chat.sender.userName}</div>
                      <div className={classes.messageGreen}>
                        <p className={classes.messageContent}>{chat.message}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div id={chat.id} className={classes.messageRowRight} key={chat.id}>
                    <div>
                      <div className={classes.SelfMessage}>
                        <p className={classes.messageContent}>{chat.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
          <form
            className={classes.wrapForm}
            onSubmit={(e) => {
              handleSubmit(e)
            }}
          >
            <TextField
              label="Type your message here"
              className={classes.wrapText}
              name="message"
              variant="outlined"
              size="small"
              value={messageState}
              onChange={(e) => handleChange(e)}
            />
            <Button variant="contained" color="primary" type="submit" className={classes.button}>
              <SendIcon />
            </Button>
          </form>
        </>
      </Paper>
    </>
  )
}

export default Chat
