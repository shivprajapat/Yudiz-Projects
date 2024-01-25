import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Description from './Description'
import AdditionalInformation from './AdditionalInformation'

function ProductInfoTab({
  getActiveClass,
  handleProductInfoTab,
  description,
  additionalInfo,
}) {
  const tabs = []
  if (description?.html) {
    tabs.push({
      name: 'description',
      labelId: 'page.productDetails.description',
      content: description,
      component: <Description description={description} />,
    })
  }
  if (additionalInfo?.moreInfoProducts?.data?.length > 0) {
    tabs.push({
      name: 'additionalInformation',
      labelId: 'page.productDetails.additionalInformation',
      content: additionalInfo,
      component: <AdditionalInformation additionalInfo={additionalInfo} />,
    })
  }
  return (
    tabs?.length > 0 && (
      <>
        <ul className="tab-list mt-10 lg:mt-12">
          {tabs.map((tab, tabIndex) => (
            <li
              key={`product-desc-tab-${tab.name}`}
              className={`tabs ${getActiveClass(tabIndex + 1, 'active-tabs')}`}
              onClick={() => handleProductInfoTab(tabIndex + 1)}
            >
              <FormattedMessage id={tab.labelId} />
            </li>
          ))}
        </ul>
        <div className="content-container">
          {tabs.map((tab, tabIndex) => (
            <div
              key={`product-desc-tab-content-${tabIndex + 1}`}
              className={`content ${getActiveClass(
                tabIndex + 1,
                'active-content'
              )}`}
            >
              {tab.component}
            </div>
          ))}
        </div>
      </>
    )
  )
}

ProductInfoTab.propTypes = {
  getActiveClass: PropTypes.func,
  handleProductInfoTab: PropTypes.func,
  description: PropTypes.object,
  additionalInfo: PropTypes.object,
}
ProductInfoTab.defaultProps = {
  getActiveClass: () => {},
  handleProductInfoTab: () => {},
  description: null,
  additionalInfo: null,
}

export default ProductInfoTab
