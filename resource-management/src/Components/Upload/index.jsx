import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { postUrl, preSignedUrl } from '../../Query/Upload/upload.query'

export default function Upload() {
  let formData = new FormData()
  const { refetch } = useQuery(['upload'], () => preSignedUrl(fileData), {
    enabled: false,
    onSuccess: (data) => {
      const promiseData = new Promise((resolve) => {
        formData.append('file', fileData)
        resolve(formData)
      })
      promiseData.then((data) => {
        console.log(data)
      })
      postUrl(data, formData)
    },
    select: (data) => {
      return data?.data.data
    },
  })
  // const url = data
  // console.log(url)
  const [fileData, setFileData] = useState()
  function Submit(e) {
    e.preventDefault()
    refetch()
  }
  return (
    <>
      <p id="status">Please select a file</p>
      <form onSubmit={Submit}>
        <input type="file" onChange={(e) => setFileData(e.target.files[0])} id="file-input" />
        <button>Submit</button>
      </form>
    </>
  )
}
