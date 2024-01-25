import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { trulioo } from 'modules/truliooKyc/redux/service'
import './style.scss'

const TruliooKyc = () => {
  const accessTokenURL = process.env.REACT_APP_API_URL
  const publicKey = process.env.REACT_APP_TRULIOO_PUBLIC_KEY

  const dispatch = useDispatch()

  useEffect(() => {
    const root = document.getElementById('root')
    const script = document.createElement('script')
    script.src = 'https://js.trulioo.com/latest/main.js'
    script.async = true
    script.onload = () => truliooClient()
    root.append(script)
    document.body.classList.add('overflow-hidden')

    return () => {
      script.remove()
    }
  }, [])

  const handleResponse = (res) => {
    dispatch(
      trulioo({
        experienceTransactionId: res.experienceTransactionId
      })
    )
    const truliooEmbedId = document.getElementById('trulioo-embedid')
    truliooEmbedId.remove()
    document.body.classList.remove('overflow-hidden')
  }

  const onInitialRenderComplete = (e) => {
    document.getElementById('preload').style.display = 'none'
  }

  const truliooClient = () => {
    // eslint-disable-next-line no-new
    new window.TruliooClient({
      publicKey,
      accessTokenURL,
      handleResponse,
      onInitialRenderComplete
    })
  }

  return (
    <>
      <div id="preload">
        <div id="loading-overlay"></div>
      </div>
      <div id="trulioo-embedid"></div>
    </>
  )
}

export default TruliooKyc
