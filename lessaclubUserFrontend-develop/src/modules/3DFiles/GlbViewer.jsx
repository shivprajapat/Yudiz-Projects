import React, { Suspense, useMemo, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import PropTypes from 'prop-types'

import './style.scss'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ThreeDIcon } from 'assets/images/icon-components/icons'

const Object = ({ url, position, ...props }) => {
  const { scene } = useLoader(GLTFLoader, url)
  const copiedScene = useMemo(() => scene.clone(), [scene])

  return (
    <group>
      <primitive object={copiedScene} position={position} />
    </group>
  )
}

Object.propTypes = {
  url: PropTypes.string,
  position: PropTypes.string
}

const GlbViewer = ({ artwork, thumbnail, showThumbnail, assetId, ignoreThumbnail, setCurrentSelectedId, isShare, ignore3DRender }) => {
  const [isClicked, setIsClicked] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const threeDClickHandler = () => {
    if (ignore3DRender) {
      return false
    }
    if (showThumbnail) {
      setIsClicked(true)
      setCurrentSelectedId && setCurrentSelectedId(assetId)
    }
  }

  const isShowThreeD = ignoreThumbnail || (isClicked || isFocused)
  const isShowPlaceholder = showThumbnail && !thumbnail

  const renderImage = () => {
    if (isShowThreeD) {
      return (
        <Canvas pixelRatio={[1, 2]} camera={{ position: [-10, 15, 15], fov: 50 }} frameloop="demand">
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Object url={artwork} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      )
    }
    if (isShowPlaceholder) {
      return <ThreeDIcon />
    }
    if (!ignoreThumbnail) {
      return <img src={thumbnail} alt="detail-img" className="img-fluid p-4" loading='lazy' />
    }
    return null
  }

  return (
    <div
      className={`h-100 overflow-hidden text-center ${isShare ? 'w-25' : ''}`}
      onClick={threeDClickHandler}
      tabIndex='-1'
      style={isShare ? { marginLeft: '13rem' } : {}}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {renderImage()}
    </div>
  )
}

GlbViewer.propTypes = {
  artwork: PropTypes.string,
  thumbnail: PropTypes.string,
  showThumbnail: PropTypes.bool,
  ignoreThumbnail: PropTypes.bool,
  isShare: PropTypes.bool,
  ignore3DRender: PropTypes.bool,
  assetId: PropTypes.number,
  setCurrentSelectedId: PropTypes.func
}

export default GlbViewer
