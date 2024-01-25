import React from 'react'
import PropTypes from 'prop-types'

import { useNetwork } from '@/hooks/useNetwork'

const NoInternet = ({ children }) => {
  const isOnline = useNetwork()
  return isOnline ? (
    children
  ) : (
    <section className="h-screen w-full grid place-items-center section-padding">
      <div className="text-center w-[375px] max-w-full px-3">
        <div className="mb-6">
          <svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <rect width="150" height="150" fill="white" />
            <path
              d="M129 75.5C129 105.6 104.6 130 74.5 130C44.4005 130 20 105.6 20 75.5C20 45.4005 44.4005 21 74.5 21C104.6 21 129 45.4005 129 75.5Z"
              fill="#FEFAF6"
            />
            <circle
              cx="24.5"
              cy="110.5"
              r="3.5"
              stroke="#E59238"
              strokeWidth="2"
            />
            <circle
              cx="129.5"
              cy="63.5"
              r="3.5"
              stroke="#E59238"
              strokeWidth="2"
            />
            <circle cx="109" cy="103" r="2.5" stroke="#C8AA5D" />
            <circle cx="44" cy="37" r="2.5" stroke="#C8AA5D" />
            <path
              d="M71.7501 75.0005C71.7501 75.8624 72.0925 76.6891 72.702 77.2986C73.3115 77.9081 74.1382 78.2505 75.0001 78.2505C75.8621 78.2505 76.6887 77.9081 77.2982 77.2986C77.9077 76.6891 78.2501 75.8624 78.2501 75.0005C78.2501 74.1385 77.9077 73.3119 77.2982 72.7024C76.6887 72.0929 75.8621 71.7505 75.0001 71.7505C74.1382 71.7505 73.3115 72.0929 72.702 72.7024C72.0925 73.3119 71.7501 74.1385 71.7501 75.0005Z"
              stroke="#704E2A"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M90.002 81.2525C91.0316 78.783 91.4354 76.0976 91.1778 73.4345C90.9201 70.7715 90.0089 68.2133 88.525 65.987C87.0412 63.7607 85.0305 61.9352 82.6717 60.6727C80.3129 59.4101 77.6788 58.7495 75.0033 58.7495C72.3278 58.7495 69.6937 59.4101 67.3349 60.6727C64.9761 61.9352 62.9654 63.7607 61.4816 65.987C59.9977 68.2133 59.0865 70.7715 58.8288 73.4345C58.5712 76.0976 58.975 78.783 60.0045 81.2525"
              stroke="#704E2A"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M101.998 86.274C103.85 81.829 104.576 76.9954 104.112 72.2024C103.648 67.4093 102.007 62.805 99.3362 58.7982C96.6652 54.7913 93.0462 51.506 88.8005 49.2337C84.5548 46.9614 79.8138 45.7725 74.9983 45.7725C70.1828 45.7725 65.4418 46.9614 61.1961 49.2337C56.9504 51.506 53.3314 54.7913 50.6604 58.7982C47.9893 62.805 46.3488 67.4093 45.8846 72.2024C45.4203 76.9954 46.1466 81.829 47.9989 86.274"
              stroke="#704E2A"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M65.25 104.25L75 75L84.75 104.25"
              stroke="#704E2A"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M68.4999 97.7495H81.4999"
              stroke="#704E2A"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M94 37L98.125 34L102.25 37L106.375 34L110.5 37L114.625 34L118.75 37L122.875 34L127 37"
              stroke="#E59238"
              strokeWidth="2"
            />
            <rect
              x="42"
              y="128"
              width="12.5581"
              height="2.7907"
              rx="1.39535"
              fill="#FBE6D7"
            />
            <rect
              x="33"
              y="123"
              width="12.5581"
              height="2.7907"
              rx="1.39535"
              fill="#FBE6D7"
            />
          </svg>
        </div>
        <h6 className="text-grey-800 font-semibold text-xl font-jost mb-1">
          Whoops!!
        </h6>
        <p className="text-grey-500 fontLight text-lg">
          No Internet connection was found. Check your connection or try again.
        </p>
      </div>
    </section>
  )
}
export default NoInternet

NoInternet.propTypes = {
  children: PropTypes.array.isRequired,
}
