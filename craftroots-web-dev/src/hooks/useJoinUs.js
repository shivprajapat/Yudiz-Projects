import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Compressor from 'compressorjs'
import useAsync from './useAsync'
import { setToastDataAction } from '@/actions/toastAction'
import { request } from '@/services/api.service'
import { JoinUsFormData } from '@/queries/homePageQueries'
import { trimString } from '@/helper'

export default function useJoinUs({ reset, setValue }) {
  const [selectedImages, setSelectedImages] = useState([])
  const joinUsData = useAsync(null, null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (joinUsData.state.isSuccess && !joinUsData.state.isLoading) {
      reset()
      setSelectedImages([])
      setValue('state', '')
      setValue('country', '')
      setValue('designation', '')
      dispatch(
        setToastDataAction({
          show: true,
          message: joinUsData.state.data?.joinUsForm?.message,
        })
      )
    }
  }, [joinUsData.state.data])

  const onSubmit = async (data) => {
    //compress images only
    let newArray = []
    await Promise.all(
      selectedImages.map(async (file) => {
        if (file.type !== 'application/pdf') {
          try {
            const blob = await new Promise((resolve, reject) => {
              new Compressor(file, {
                quality: 0.6,
                maxWidth: 1500,
                success: (compressedBlob) => resolve(compressedBlob),
                error: (error) => reject(error),
              })
            })
            newArray.push(blob)
          } catch (error) {
            console.error(
              'An error occurred while compressing the file:',
              error
            )
          }
        } else {
          return newArray.push(file)
        }
      })
    )
    //convert images to base64
    let base64Files = []
    try {
      base64Files = await Promise.all(
        newArray.map(async (file) => {
          try {
            const base64Data = await convertToBase64(file)
            return { base_64_images: base64Data }
          } catch (error) {
            console.error(
              'An error occurred while converting to base64:',
              error
            )
            return {}
          }
        })
      )
    } catch (err) {
      base64Files = []
    }

    //api call
    joinUsData.run(request, {
      ...JoinUsFormData,
      variables: {
        name: trimString(data?.name),
        email: trimString(data?.email),
        telephone: trimString(data?.phone),
        country: data?.country?.label,
        city: trimString(data?.city),
        state: data?.state?.label,
        images: base64Files,
        designations: data?.designation?.label,
      },
    })
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const handleImage = async (files) => {
    const arrayFiles = Array.from(files)?.filter((file) => {
      return !selectedImages.some(
        (selectedFile) => selectedFile.name === file.name
      )
    })

    //if any of image contain size more than 5 MB
    if (!arrayFiles.some((i) => i.size > 5000000)) {
      //max % image/pdf should allowed
      if (arrayFiles && selectedImages.length + arrayFiles.length <= 5) {
        setSelectedImages([...selectedImages, ...arrayFiles])
      } else {
        dispatch(
          setToastDataAction({
            show: true,
            message: 'Max 5 files allowed',
            error: true,
          })
        )
      }
    }
  }

  const removeImage = (name) => {
    const newArray = selectedImages?.filter((img) => img.name !== name) || []
    setSelectedImages(newArray)
  }

  return {
    onSubmit,
    handleImage,
    selectedImages,
    joinUsData,
    removeImage,
  }
}
