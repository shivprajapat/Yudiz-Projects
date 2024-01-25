import React from 'react'
import { GlbViewer } from 'modules/3DFiles'
import { useLocation, useParams } from 'react-router-dom'
import { GLB, GLTF } from 'shared/constants'
import './index.scss'

const Index = () => {
  const location = useLocation()
  const params = useParams()
  const base = ' https://lessaclubs3.s3.amazonaws.com/'
  const assetURL = base + params.link
  const isThreeDAsset = [GLB, GLTF].includes(location.pathname.split('.')[1])

  return (
    <div className="asset-detail-page">
      <div className="asset-detail">
        {
          isThreeDAsset ? <GlbViewer artwork={assetURL} ignoreThumbnail /> : <img src={assetURL} alt={location.pathname} loading='lazy' />
        }
      </div>
    </div>
  )
}

export default Index
