import React, { useState } from 'react'
import Image from 'next/image'

import { iconClose, iconUpload } from '@/assets/images'

const UploadTicketItem = () => {
  const [file, setFile] = useState([])

  function uploadSingleFile(e) {
    let ImagesArray = Object.entries(e.target.files).map((e) =>
      URL.createObjectURL(e[1])
    )
    setFile([...file, ...ImagesArray])
  }

  function deleteFile(e) {
    const s = file.filter((item, index) => index !== e)
    setFile(s)
  }
  return (
    <div className="flex items-center gap-2 flex-wrap mt-6">
      {file.length > 0 &&
        file.map((item, index) => {
          return (
            <div
              key={item}
              className="w-[53px] h-[53px] sm:w-14 sm:h-14 relative p-1 border border-grey-400"
            >
              <img src={item} alt="" className="w-full h-full" />
              <button
                type="button"
                onClick={() => deleteFile(index)}
                className="absolute -top-1 -right-1  border-grey-400 border rounded-full bg-grey-100"
              >
                <Image src={iconClose} alt="close" className="w-4" />
              </button>
            </div>
          )
        })}
      <div className="w-14 h-14 relative p-1 border border-grey-400">
        <input
          className="w-full h-full absolute bg-red-50 inset-0 opacity-0 cursor-pointer z-10"
          type="file"
          disabled={file.length === 5}
          onChange={uploadSingleFile}
          multiple
        />
        <div className="w-full h-full bg-grey-100 opacity-40 grid place-items-center p-2 cursor-pointer">
          <Image src={iconUpload} alt="upload" className="w-7 h-7" />
        </div>
      </div>
    </div>
  )
}

export default UploadTicketItem
