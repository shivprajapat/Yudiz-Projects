import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeLanguage } from '../../redux/actions/setting'

function Setting (Component) {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const language = useSelector(state => state.settings.language)

    useEffect(() => {
      dispatch(changeLanguage(language))
    }, [])

    return (
      <Component
        {...props}
        language={language}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default Setting
