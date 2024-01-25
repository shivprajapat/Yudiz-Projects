import React, { useState } from 'react'

// component
import MedicalQuestion from 'Components/LifeCycle/MedicalQuestion'
import DietQuestion from 'Components/LifeCycle/DietQuestion'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'

// query
import { getSpecificLifeCycle } from 'Query/LifeCycle/lifecycle.query'
import { getQuestionsList } from 'Query/Questions/questions.query'
import { addLifeCycle } from 'Query/LifeCycle/lifecycle.mutation'
import { useMutation, useQuery } from 'react-query'
import { queryClient } from 'queryClient'

// helper
import { FoodType, MaritalStatus, SmokeType, convertTo12HourFormat, convertTo24HourFormat, toaster } from 'helpers'

// hook
import usePageType from 'Hooks/usePageType'
import { useForm } from 'react-hook-form'


import { useNavigate } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'

import './style.scss'
import LifeCycleBasic from '../Basic-Details'


function LifeCyclesList() {

  const { id } = usePageType()
  const navigate = useNavigate()

  const { control, handleSubmit, watch, reset } = useForm()

  const [quesType, setQuesType] = useState({
    dietValue: [],
    medicalValue: []
  })
  const [newData, setNewData] = useState({
    dietValue: [],
    medicalValue: []
  })

  // get questionList
  const { data: questionList } = useQuery({
    queryKey: ['questionList'],
    queryFn: () => getQuestionsList({ limit: 50 }),
    select: (data) => data.data.data.aQuestionList,
  })

  // get lifecycle by ID
  useQuery({
    queryKey: ['lifeCycleDetailsByID', id],
    queryFn: () => getSpecificLifeCycle(id),
    enabled: !!id,
    select: (data) => data.data.data,
    onSuccess: (data) => {
      setQuesType(prev => ({
        ...prev,
        dietValue: data?.aDietQuestions,
        medicalValue: data?.aMedicalQuestions
      }))
      reset({
        sWeight: data?.sWeight,
        sHeight: data?.sHeight,
        eMaritalStatus: MaritalStatus?.find(item => item?.value === data?.eMaritalStatus),
        sCaste: data?.sCaste,
        eType: FoodType?.find(item => item?.value === data?.oFoodInfo?.eType),
        foodInfoDescription: data?.oFoodInfo?.sDescription,
        sWakeUpTime: Object.entries(data?.oSleepInfo)?.length <= 0 ? undefined : convertTo24HourFormat(data?.oSleepInfo?.sWakeUpTime),
        sBedTime: Object.entries(data?.oSleepInfo)?.length <= 0 ? undefined : convertTo24HourFormat(data?.oSleepInfo?.sBedTime),
        sleepInfoDescription: data?.oSleepInfo?.sDescription,
        bIsSmoking: SmokeType?.find(item => item?.value === data?.oSmokeInfo?.bIsSmoking),
        smokeInfoDescription: data?.oSmokeInfo?.sDescription,
        sOccupation: data?.oWorkInfo?.sOccupation,
        sDesignation: data?.oWorkInfo?.sDesignation,
        sStartTime: Object.entries(data?.oWorkInfo?.oWorkingTime)?.length <= 0 ? undefined : convertTo24HourFormat(data?.oWorkInfo?.oWorkingTime?.sStartTime),
        sEndTime: Object.entries(data?.oWorkInfo?.oWorkingTime)?.length <= 0 ? undefined : convertTo24HourFormat(data?.oWorkInfo?.oWorkingTime?.sEndTime),
        workInfoDescription: data?.oWorkInfo?.sDescription,
      })
    },
    onError: () => {
      toaster('')
    }
  })

  // update lifecycle
  const mutation = useMutation(addLifeCycle, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('customers')
      toaster(data.data.message)
    },
  })


  const selectedDietQuestion = questionList?.filter(item => item?.eCategory === 'D')
  const selectedMedicalQuestion = questionList?.filter(item => item?.eCategory === 'M')

  function handleTabSelect() {

    const dietResult = []
    if (selectedDietQuestion?.length) {
      for (const question of selectedDietQuestion) {
        const matchingItem = (quesType?.dietValue)?.find(item => item?.iQuestionId === question?._id)
        if (!matchingItem) {
          dietResult.push(question)
        } else {
          matchingItem.nPriority = question.nPriority
        }
      }
    }
    const updatedDietValue = ((quesType?.dietValue)?.concat(dietResult))?.sort((a, b) => a.nPriority - b.nPriority)
    
    const medicalResult = []
    if (selectedMedicalQuestion?.length) {
      for (const question1 of selectedMedicalQuestion) {
        const matchingItem = (quesType?.medicalValue)?.find(item => item?.iQuestionId === question1?._id)
        if (!matchingItem) {
          medicalResult.push(question1)
        } else {
          matchingItem.nPriority = question1.nPriority
        }
      }
    }
    const updatedMedicalValue = ((quesType?.medicalValue)?.concat(medicalResult))?.sort((a, b) => a.nPriority - b.nPriority)

    setNewData({
      dietValue: updatedDietValue,
      medicalValue: updatedMedicalValue
    })
  }

  function handleCancel() {
    navigate('/customers')
  }

  function handleClear(id, type) {
    if (type === 'D') {
      const data = (newData?.dietValue)?.filter((item) => item?._id !== id)
      setNewData(prev => ({
        ...prev,
        dietValue: data
      }))
    }
    if (type === 'M') {
      const data = (newData?.medicalValue)?.filter((item) => item?._id !== id)
      setNewData(prev => ({
        ...prev,
        medicalValue: data
      }))
    }
  }


  function onSubmit(data) {

    const newDietQues = (newData?.dietValue)?.map(item => (watch(`question-${item?._id}-desc`) && {
      sQuestion: item?.sQuestion,
      sAnswer: watch(`question-${item?._id}-desc`),
      iQuestionId: item?.iQuestionId ? item?.iQuestionId : item?._id
    }))?.filter((item) => item)

    const newMedicalQues = (newData?.medicalValue)?.map(item => (watch(`medical-question-${item?._id}-desc`) && {
      sQuestion: item?.sQuestion,
      sAnswer: watch(`medical-question-${item?._id}-desc`),
      iQuestionId: item?.iQuestionId ? item?.iQuestionId : item?._id
    }))?.filter((item) => item)

    const addData = {
      sWeight: data?.sWeight,
      sHeight: data?.sHeight,
      eMaritalStatus: data?.eMaritalStatus?.value,
      sCaste: data?.sCaste,
      oFoodInfo: {
        eType: data?.eType?.value,
        sDescription: data?.foodInfoDescription
      },
      oSleepInfo: {
        sWakeUpTime: convertTo12HourFormat(data?.sWakeUpTime),
        sBedTime: convertTo12HourFormat(data?.sBedTime),
        sDescription: data?.sleepInfoDescription
      },
      oSmokeInfo: {
        bIsSmoking: data?.bIsSmoking?.value,
        sDescription: data?.smokeInfoDescription
      },
      oWorkInfo: {
        sOccupation: data?.sOccupation,
        sDesignation: data?.sDesignation,
        oWorkingTime: {
          sStartTime: convertTo12HourFormat(data?.sStartTime),
          sEndTime: convertTo12HourFormat(data?.sEndTime)
        },
        sDescription: data?.workInfoDescription
      },
      aDietQuestions: newDietQues,
      aMedicalQuestions: newMedicalQues,
      iCustomerId: id
    }
    mutation.mutate({
      addData
    })
  }

  return (
    <>
      <Wrapper>

        <PageTitle
          title={'Life Cycle Details'}
          className={'mb-5'}
        />

        <Tabs className='project-tabs' onSelect={handleTabSelect} >

          <Tab eventKey={1} title={basicDetails()}>
            <LifeCycleBasic
              control={control}
            />
          </Tab>

          <Tab eventKey={2} title={DietDetails()} >
            <DietQuestion
              questionList={newData?.dietValue}
              control={control}
              handleClear={handleClear}
            />
          </Tab>

          <Tab eventKey={3} title={MedicalDetails()}>
            <MedicalQuestion
              questionList={newData?.medicalValue}
              control={control}
              handleClear={handleClear}
            />
          </Tab>

        </Tabs>

        <PageTitle
          className="my-4"
          cancelText="Cancel"
          cancelButtonEvent={handleCancel}
          BtnText={'Save'}
          handleButtonEvent={handleSubmit(onSubmit)}
        />

      </Wrapper>
    </>
  )
}

export default LifeCyclesList


function basicDetails() {
  return (
    <div className="tab-item nav-item">
      <button>1</button>
      <p className="nav-link">Project Basic Details</p>
    </div>
  )
}
function DietDetails() {
  return (
    <div className="tab-item nav-item">
      <button>2</button>
      <p className="nav-link">Diet Questions</p>
    </div>
  )
}
function MedicalDetails() {
  return (
    <div className="tab-item nav-item">
      <button>3</button>
      <p className="nav-link">Medical Questions</p>
    </div>
  )
}
