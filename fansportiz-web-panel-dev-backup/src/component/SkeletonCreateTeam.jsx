import React from 'react'
import Skeleton from 'react-loading-skeleton'

import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonCreateTeam () {
  return (
    Array(5).fill().map((item) => (
      <tr key={item}>
        <td><Skeleton className="p-img" /></td>
        <td>
          <Skeleton height={15} width={`${50}%`} />
          <Skeleton height={10} width={`${75}%`} />
          <Skeleton height={12} width={`${100}%`} />
        </td>
        <td className="text-center"><Skeleton height={20} width={30} /></td>
        <td className="text-center"><Skeleton height={20} width={30} /></td>
        <td><Skeleton height={20} width={30} /></td>
      </tr>
    ))
  )
}

export default SkeletonCreateTeam
