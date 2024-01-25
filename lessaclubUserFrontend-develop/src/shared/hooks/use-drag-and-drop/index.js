import { useEffect, useRef, useState } from 'react'

/**
 * Handles drag and drop events
 * @param {Function} handleDroppedItem callback function to get the dropped files
 * @param {Boolean} isDisabled boolean to disable the drop area
 * @returns {Ref} ref to the drop area
 * @returns {Boolean} isDragging - true if the user is dragging to the area
 */
const useDragAndDrop = (handleDroppedItem, isDisabled) => {
  const dropRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (isDisabled) return null
    const currentDrop = dropRef.current
    currentDrop.addEventListener('dragleave', handleDragLeave)
    currentDrop.addEventListener('dragover', handleDragOver)
    currentDrop.addEventListener('drop', handleDrop)

    return () => {
      currentDrop.addEventListener('dragleave', handleDragLeave)
      currentDrop.removeEventListener('dragover', handleDragOver)
      currentDrop.removeEventListener('drop', handleDrop)
    }
  }, [])

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { files } = e.dataTransfer

    if (files && files.length) {
      handleDroppedItem(files, true)
    }
    setIsDragging(false)
  }
  return { dropRef, isDragging }
}

export default useDragAndDrop
