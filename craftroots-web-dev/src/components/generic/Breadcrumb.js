import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import Image from 'next/image'
import { allRoutes } from '@/constants/allRoutes'
import { iconArrowRight } from '@/assets/images'

const Breadcrumb = ({ breadcrumb }) => {
  const breadCrumbLastChild = breadcrumb?.breadcrumbs
  const breadCrumbLabel =
    breadCrumbLastChild &&
    breadCrumbLastChild?.[
      breadCrumbLastChild?.length - 1
    ]?.category_url_path.split('/')
  return (
    <div className="hidden md:block bg-grey-200 pb-2 pt-2 md:pt-5">
      <div className="container">
        <ol className="flex items-center w-full overflow-hidden">
          <li className="pr-2.5">
            <Link
              className="capitalize font-medium text-sm text-secondary-800 transition duration-200 ease-in hover:text-secondary-200"
              href={allRoutes.home}
            >
              <FormattedMessage id="header.item.home" />
            </Link>
          </li>
          {breadCrumbLastChild?.length > 0 &&
            breadCrumbLastChild?.map((label, idx) => (
              <>
                <li
                  key={`${label}-img-${idx}`}
                  className="text-base text-body mt-0.5"
                >
                  <Image
                    src={iconArrowRight}
                    alt="iconArrowRight"
                    className="w-[12px] h-[12px]"
                  />
                </li>
                <li key={label.category_url_path} className="px-2.5">
                  <Link
                    className="capitalize font-medium text-sm text-secondary-800 transition duration-200 ease-in hover:text-secondary-200"
                    href={'/' + label?.category_url_path}
                  >
                    {breadCrumbLabel[idx]}
                  </Link>
                </li>
              </>
            ))}
        </ol>
      </div>
    </div>
  )
}

export default Breadcrumb
Breadcrumb.propTypes = {
  breadcrumb: PropTypes.object.isRequired,
}
