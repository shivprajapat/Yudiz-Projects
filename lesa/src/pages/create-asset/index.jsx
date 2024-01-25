import React from 'react'
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap'
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
  const {
    step,
    artwork,
    artworkMediaType,
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
    onFirstStepSubmit,
    onSecondStepSubmit,
    goBack,
    setValue,
    category,
    stepTwoClearErrors
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
        />
      )}
      <div className="create-asset-page">
        <Container>
          <div className="artwork-title d-flex align-items-center">
            <h4>
              <FormattedMessage id={id ? 'resellYourArtwork' : 'createYourArtwork'} />
            </h4>
          </div>
          <Row className="align-items-end">
            <Col md={6}>
              <StepOne
                register={stepOneField}
                errors={stepOneErrors}
                watch={watch}
                values={stepOneValue()}
                hidden={step !== 1}
                control={stepOneControl}
                setValue={setValue}
                category={category}
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
                  artworkMediaType={artworkMediaType}
                  drop={drop}
                  artwork={artwork}
                  stepOneErrors={stepOneErrors}
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
                        {loading && <Spinner animation="border" size="sm" />}
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
