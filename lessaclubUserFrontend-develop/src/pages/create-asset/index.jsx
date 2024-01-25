import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import './style.scss'
import StepOne from 'pages/create-asset/components/form-steps/StepOne'
import StepTwo from 'pages/create-asset/components/form-steps/StepTwo'

import useAssetCreation from './hooks/use-asset-creation'
import CommonModal from 'shared/components/common-modal'
import { checkBallIcon, createAssetLogoIcon } from 'assets/images'
import { allRoutes } from 'shared/constants/allRoutes'
import UploadArtwork from 'pages/create-asset/components/upload-artwork'
import WithAuth from 'shared/components/with-auth'

const CreateAsset = () => {
  const { id } = useParams()
  const exclusiveAssetText = 'You have created an exclusive asset, which will be available for sale after admin approves it. Thank you'

  const {
    step,
    artwork,
    thumbnailArtwork,
    artworkMediaType,
    thumbnailArtworkMediaType,
    show,
    drop,
    loading,
    stepOneField,
    stepOneSubmit,
    stepOneErrors,
    watch,
    stepOneValue,
    stepOneControl,
    stepTwoField,
    stepTwoSubmit,
    stepTwoErrors,
    control,
    stepTwoWatch,
    setStepTwoValue,
    changeStep,
    handleArtworkChange,
    handleThumbnailChange,
    onFirstStepSubmit,
    onSecondStepSubmit,
    goBack,
    setValue,
    category,
    stepTwoClearErrors,
    stepOneResetField,
    setArtwork,
    setThumbnailArtwork,
    assetFileSize,
    handle3DAssetsChange,
    threeDAssetData,
    assetFile,
    isExclusive
  } = useAssetCreation()

  return (
    <>
      {show && (
        <CommonModal
          show={show}
          icon={checkBallIcon}
          titleId={id ? 'assetPlacedOnSaleSuccessfully' : 'assetCreatedSuccessfully'}
          btnTxtId="backToHome"
          btnLink={allRoutes.home}
          background
          description={isExclusive ? exclusiveAssetText : null}
        />
      )}
      <div className="create-asset-page">
        <Container>
          <Row className="align-items-start">
            <Col md={6}>
              <div className="artwork-title d-flex align-items-center">
                <h4>
                  <FormattedMessage id={id ? 'resellYourArtwork' : 'createYourArtwork'} />
                </h4>
              </div>
              <StepOne
                register={stepOneField}
                errors={stepOneErrors}
                watch={watch}
                values={stepOneValue()}
                hidden={step !== 1}
                control={stepOneControl}
                setValue={setValue}
                category={category}
                resetField={stepOneResetField}
              />
              <StepTwo
                register={stepTwoField}
                errors={stepTwoErrors}
                control={control}
                setValue={setStepTwoValue}
                hidden={step !== 2}
                submit={stepTwoSubmit}
                watch={stepTwoWatch}
                stepOneValue={stepOneValue()}
                clearErrors={stepTwoClearErrors}
              />
            </Col>

            <Col md={6}>
              <div className="upload-artwork">
                <UploadArtwork
                  stepOneField={stepOneField}
                  handleArtworkChange={handleArtworkChange}
                  handle3DAssetsChange={handle3DAssetsChange}
                  threeDAssetData={threeDAssetData}
                  handleThumbnailChange={handleThumbnailChange}
                  artworkMediaType={artworkMediaType}
                  thumbnailArtworkMediaType={thumbnailArtworkMediaType}
                  drop={drop}
                  artwork={artwork}
                  thumbnailArtwork={thumbnailArtwork}
                  stepOneErrors={stepOneErrors}
                  setArtwork={setArtwork}
                  setThumbnailArtwork={setThumbnailArtwork}
                  assetFileSize={assetFileSize}
                  assetFile={assetFile}
                />
                <div className="upload-end-btns d-flex justify-content-between">
                  {step === 1 ? (
                    <>
                      <Button className="white-border-btn" onClick={goBack}>
                        <FormattedMessage id="cancel" />
                      </Button>
                      <Button className="white-btn" type="submit" form="stepOneForm" onClick={stepOneSubmit(onFirstStepSubmit)}>
                        <FormattedMessage id="continue" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="white-border-btn" onClick={() => changeStep(1)} disabled={loading}>
                        <FormattedMessage id="back" />
                      </Button>
                      <Button
                        className="white-btn"
                        type="submit"
                        form="stepTwoForm"
                        onClick={stepTwoSubmit(onSecondStepSubmit)}
                        disabled={loading}
                      >
                        <FormattedMessage id="submit" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <img src={createAssetLogoIcon} alt="logo-img" className="img-fluid" />
      </div>
    </>
  )
}

export default WithAuth(CreateAsset)
