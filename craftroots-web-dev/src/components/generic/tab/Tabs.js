import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const Tabs = ({ children, defaultActiveKey, onSelect }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  useEffect(() => {
    if (defaultActiveKey != null) {
      React.Children.forEach(children, (child, index) => {
        if (child?.props?.eventKey === defaultActiveKey) {
          setActiveTabIndex(index)
        }
      })
    }
  }, [defaultActiveKey, children])

  const handleTabClick = (index) => {
    setActiveTabIndex(index)
    const eventKey = React.Children.toArray(children)[index]?.props?.eventKey
    onSelect(eventKey)
  }
  const tabStyle = 'text-grey-500 text-base font-medium cursor-pointer'

  return (
    <div className="tabs">
      <div className="tab-buttons border-b border-grey-400 pb-4 mb-6 ">
        {React.Children.map(children, (child, index) => (
          <button
            className={`tab-button pr-[24px] capitalize  ${tabStyle} ${
              activeTabIndex === index ? 'active text-secondary-800' : ''
            }`}
            onClick={() => handleTabClick(index)}
          >
            {child?.props?.label}
          </button>
        ))}
      </div>
      <div className="tab-contents ">
        {React.Children.map(children, (child, index) => (
          <div className={` ${activeTabIndex === index ? 'active' : 'hidden'}`}>
            {child?.props?.children}
          </div>
        ))}
      </div>
    </div>
  )
}

Tabs.propTypes = {
  children: PropTypes.any,
  activeKey: PropTypes.string,
  defaultActiveKey: PropTypes.string,
  onSelect: PropTypes.func,
}

export default Tabs
