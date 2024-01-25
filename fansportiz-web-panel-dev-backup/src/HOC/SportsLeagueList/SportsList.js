import React from 'react'
import useActiveSports from '../../api/activeSports/queries/useActiveSports'

function SportsList (Component) {
  const MyComponent = (props) => {
    const { data: activeSports } = useActiveSports()

    return (
      <Component
        {...props}
        activeSports={activeSports}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default SportsList
