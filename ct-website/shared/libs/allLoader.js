import React from 'react'
import { Col, Spinner } from 'react-bootstrap'

import Skeleton from '@shared/components/skeleton'
import ArticleSkeleton from '@shared/components/skeleton/components/articleSkeleton'
import AuthorListSkeleton from '@shared/components/skeleton/components/authorListSkeleton'
import ArticleListSkeleton from '@shared/components/skeleton/components/articleListSkeleton'

export function articleLoader(type) {
  return type.map((t, i) => <ArticleSkeleton key={i} type={t} />)
}

export function authorListLoader(loaderCount) {
  const loaders = [1]
  while (loaderCount > loaders.length) {
    loaders.push(loaders.length + 1)
  }
  return loaders.map((loader) => <AuthorListSkeleton key={loader} />)
}

export function archiveSeriesLoader(loaderCount) {
  const loaders = [1]
  while (loaderCount > loaders.length) {
    loaders.push(loaders.length + 1)
  }
  return <div className="bg-white p-3 rounded">
    {loaders.map((loader) =>
      <React.Fragment key={loader}>
        <div className="d-flex justify-content-between" key={loader}>
          <Skeleton width={'40%'} />
          <Skeleton width={'15%'} />
        </div>
        <hr />
      </React.Fragment>
    )}
  </div>
}

export function articleListLoader(loaderCount) {
  const loaders = [1]
  while (loaderCount > loaders.length) {
    loaders.push(loaders.length + 1)
  }
  return loaders.map((loader) => <ArticleListSkeleton key={loader} />)
}

export function fixtureLoader() {
  return (
    <>
      {[0, 1].map((e, i) => {
        return (
          <React.Fragment key={i}>
            <div className="d-flex bg-white p-3 rounded mb-2">
              <div className="w-50 d-flex justify-content-center flex-wrap">
                <Skeleton height={'10px'} width={'50%'} />
                <Skeleton height={'10px'} width={'70%'} className={'my-3'} />
                <Skeleton height={'10px'} width={'50%'} />
              </div>
              <div className="vr"></div>
              <div className="w-50 d-flex justify-content-center flex-wrap">
                <Skeleton height={'10px'} width={'50%'} />
                <Skeleton height={'10px'} width={'70%'} className={'my-3'} />
                <Skeleton height={'10px'} width={'50%'} />
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </>
  )
}

export function tableLoader() {
  return (
    <div className="bg-white rounded p-3 mb-2">
      {[0, 1, 2, 3].map((e, i) => {
        return (
          <React.Fragment key={e}>
            <div className="d-flex justify-content-between">
              <Skeleton width={'20%'} />
              <Skeleton width={'20%'} />
              <Skeleton width={'20%'} />
              <Skeleton width={'20%'} />
            </div>
            {i !== 3 && <hr />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export function fantasyTipsLoader() {
  return (
    <div className="bg-white p-2 d-flex rounded mb-2">
      <div className="d-flex w-50 p-2">
        <Skeleton height={'36px'} className="m-1" radius="5px" />
        <Skeleton height={'36px'} className="m-1" radius="5px" />
      </div>
      <div className="vr"></div>
      <div className="d-flex w-50 p-2">
        <Skeleton height={'36px'} className="m-1" radius="5px" />
        <Skeleton height={'36px'} className="m-1" radius="5px" />
      </div>
    </div>
  )
}

export function pageHeaderLoader() {
  return (
    <div className="bg-white rounded p-3 mb-3">
      <Skeleton width={'50%'} height={'25px'} />
      <Skeleton width={'75%'} className={'mt-2'} />
      <hr />
      <Skeleton />
      <Skeleton className={'my-2'} />
      <Skeleton width={'50%'} />
    </div>
  )
}

export function navLoader() {
  return (
    <div className="bg-white p-2 d-flex rounded-pill mb-3">
      <Skeleton className={'mx-1'} />
      <Skeleton className={'mx-1'} />
      <Skeleton className={'mx-1'} />
      <Skeleton className={'mx-1'} />
    </div>
  )
}

export function formLoader() {
  return (
    <>
      <Skeleton height={'10px'} width={'100px'} />
      <Skeleton height={'35px'} className={'mt-2 mb-4'} />
    </>
  )
}

export function statsLoader() {
  return (
    <div className="row">
      <div className="col-md-3">
        <Skeleton className={'my-4'} height={'20px'} />
        <Skeleton className={'my-4'} height={'20px'} />
        <Skeleton className={'my-4'} height={'20px'} />
        <Skeleton className={'my-4'} height={'20px'} />
      </div>
      <div className="col-md-9">{tableLoader()}</div>
    </div>
  )
}

export function pageLoading() {
  return (
    <div className="vh-50 d-flex align-items-center justify-content-center">
      <Spinner animation="border" size="md" />
    </div>
  )
}

export function commentaryLoading() {
  return (
    <>
      <div className="bg-white p-2 rounded-3">
        {[0, 1, 2].map((e, i) => {
          return (
            <React.Fragment key={e}>
              <div className="row">
                <div className="col-md-1">
                  <Skeleton className={'my-4 ms-2'} height={'20px'} />
                </div>
                <div className="col-md-1">
                  <Skeleton height="20px" width="20px" radius="10px" className="mt-4 ms-2" />
                </div>
                <div className="col-md-10">
                  <Skeleton className={'my-4'} height={'20px'} />
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </>

  )
}

export function oversLoader() {
  return (
    <>
      {[0, 1].map((e, i) => {
        return (
          <>
            <div className="d-flex bg-white p-4 rounded mb-2 rounded-3">
              <Col className="d-flex justify-content-center flex-column align-items-center" xs={2}>
                <Skeleton height={'10px'} width={'80%'} radius={'2px'} />
                <Skeleton height={'24px'} width={'100%'} radius={'4px'} className={'mt-3'} />
              </Col>
              <Col xs={1} className="d-flex justify-content-center">
                <div className="vr"></div>
              </Col>
              <Col className="d-flex flex-wrap">
                <Skeleton height={'10px'} width={'70%'} className={'mb-3'} radius={'2px'} xs={9} />
                <div className="d-flex">
                  <Skeleton height="30px" width="30px" radius="30px" className={'mx-1'} />
                  <Skeleton height="30px" width="30px" radius="30px" className={'mx-1'} />
                  <Skeleton height="30px" width="30px" radius="30px" className={'mx-1'} />
                  <Skeleton height="30px" width="30px" radius="30px" className={'mx-1'} />
                  <Skeleton height="30px" width="30px" radius="30px" className={'mx-1'} />
                  <Skeleton height="30px" width="30px" radius="30px" className={'mx-1'} />
                </div>
              </Col>
            </div>
          </>)
      })}
    </>
  )
}

export function scoreCardNavLoader() {
  return (
    <div className="d-flex container justify-content-center mt-01 mb-2 my-sm-2 overflow-hidden">
      <div className="bg-white rounded p-1 p-sm-2 me-1 my-1" style={{ width: '130px' }}>
        <Skeleton height={'18px'} width={'100%'} />
      </div>
      {Array.from(Array(4)).map((e, i) => {
        return (
          <div key={`sNavL${i}`} className="p-1 p-sm-2 me-1 my-1" style={{ width: '120px' }}>
            <Skeleton height={'18px'} width={'100%'} />
          </div>
        )
      })}
    </div>
  )
}

export function scoreCardSliderLoader(isSeriesTitle) {
  return (
    <div className="d-flex container overflow-hidden">
      {Array.from(Array(5)).map((e, i) => {
        return (
          <div key={`sLoader${i}`} className="bg-white rounded p-2 me-3" style={{ width: '300px', flexShrink: '0' }}>
            <Skeleton width={'40%'} />
            <Skeleton height={'14px'} width={'60%'} className={'mt-2'} />
            <div className="d-flex justify-content-between mt-3">
              <Skeleton height={'17px'} width={'60px'} />
              <Skeleton height={'17px'} width={'50px'} />
            </div>
            <div className="d-flex justify-content-between my-2">
              <Skeleton height={'17px'} width={'60px'} />
              <Skeleton height={'17px'} width={'50px'} />
            </div>
            <Skeleton className={'mt-3'} />
            {
              isSeriesTitle &&
              <div className="d-flex justify-content-between mt-2">
                <div className="w-50 me-2">
                  <Skeleton height={'18px'} />
                </div>
                <div className="w-50 ms-2">
                  <Skeleton height={'18px'} />
                </div>
              </div>
            }
          </div>
        )
      })}
    </div>
  )
}

export function teamLoader() {
  return (
    <div className="row">
      <div className="col-xl-3 col-md-4 col-sm-6">
        <ArticleSkeleton type={'g'} />
      </div>
      <div className="col-xl-3 col-md-4 col-sm-6">
        <ArticleSkeleton type={'g'} />
      </div>
      <div className="col-xl-3 col-md-4 col-sm-6">
        <ArticleSkeleton type={'g'} />
      </div>
      <div className="col-xl-3 col-md-4 col-sm-6">
        <ArticleSkeleton type={'g'} />
      </div>
    </div>
  )
}
