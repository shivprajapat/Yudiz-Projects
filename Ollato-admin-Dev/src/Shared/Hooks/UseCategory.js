import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllSubCategory, getAllTestCategory } from '../../Actions/Admin/Test/Question'

export const useCategory = (initialState = false) => {
  // Initialize the state
  const [mainCatid, setMainCatid] = useState()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')

  // useselector

  const testArray = useSelector((state) => state.question.testCategoryList)
  const subtestArray = useSelector((state) => state.question.testSubCategoryList)
  useEffect(() => {
    dispatch(getAllTestCategory(token))
  }, [])

  useEffect(() => {
    if (mainCatid) {
      dispatch(getAllSubCategory(token, mainCatid))
    }
  }, [mainCatid])

  return { mainCatid, setMainCatid, testArray, subtestArray }
}
