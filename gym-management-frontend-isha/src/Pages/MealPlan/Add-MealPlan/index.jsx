import React from 'react'

import { Controller, useForm } from 'react-hook-form'
import { Accordion, Col, Row, } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { queryClient } from 'queryClient'
import { route } from 'Routes/route'

// component
import DescriptionInput from 'Components/DescriptionInput'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import Divider from 'Components/Divider'
import Input from 'Components/Input'

// query
import { getMealScheduleList, getSpecificMealPlan } from 'Query/MealPlan/mealplan.query'
import { addMealPlan, addMealSchedule, updateMealPlan, updateMealSchedule } from 'Query/MealPlan/mealplan.mutation'

// hook
import usePageType from 'Hooks/usePageType'

// helper
import { rules, toaster } from 'helpers'

import './_addMeal.scss'


function AddMealPlan() {

    const { id, isEdit } = usePageType()
    const navigate = useNavigate()

    const { control: mealPlanDetailsControl, handleSubmit: mealPlanDetailsHandleSubmit, reset: mealPlanDetailsReset } = useForm()
    const { control, handleSubmit, reset } = useForm()


    // get mealPlan By Id
    const { data: mealPlanById } = useQuery({
        queryKey: ['mealPlanById', id],
        queryFn: () => getSpecificMealPlan(id),
        enabled: !!isEdit,
        select: (data) => data?.data?.oMealPlan,
        onSuccess: (data) => {
            reset({
                sDescription: data?.sDescription,
                sTitle: data?.sTitle
            })
        }
    })

    // get mealPlanDetails By Id
    const { data: mealPlanDetailsByIdData } = useQuery({
        queryKey: ['mealPlanDetailsById', id],
        queryFn: () => getMealScheduleList(id),
        enabled: !!isEdit,
        select: (data) => data?.data?.data?.aMealPlan,
        onSuccess: (data) => {

            const resetValues = {}

            for (const key in data) {
                resetValues[`meal-day-${key}`] = data[key]?.sDescription
            }
            mealPlanDetailsReset(resetValues)
        }
    })

    // post mealPlan
    const mealPlanMutation = useMutation(addMealPlan, {
        onSuccess: (data) => {
            toaster(data?.data?.message)
        }
    })

    // post mealPlanDetails
    const mealPlanDetailsMutation = useMutation(addMealSchedule, {
        onSuccess: (data) => {
            navigate('/mealPlans')
            queryClient.invalidateQueries('mealPlans')
            toaster(data?.data?.message)
        }
    })

    // update mealPlan
    const updateMealPlanMutation = useMutation(updateMealPlan, {
        onSuccess: (data) => {
            toaster(data?.data?.message)
        }
    })

    // update mealPlanDetails
    const updateMealPlanDetailsMutation = useMutation(updateMealSchedule, {
        onSuccess: (data) => {
            navigate('/mealPlans')
            queryClient.invalidateQueries('mealPlans')
            toaster(data?.data?.message)
        }
    })

    function onSubmit(data) {
        const { sTitle, sDescription } = data

        const newData = {
            sTitle,
            sDescription,
            eType: 'A'
        }

        if (isEdit) {
            updateMealPlanMutation.mutate({ newData, id })
        } else {
            mealPlanMutation.mutate(newData)
        }
    }

    function handleCancel() {
        navigate(route?.mealPlans)
    }

    function onSubmitMealPlanDetails(data) {
        const object1 = (Object.values(data))
        const newData = {
            iMealPlanId: isEdit ? id : mealPlanMutation?.data?.data?.data?.iMealPlanId,
            aPlanDetails: [],
        }

        object1?.map((item, index) => {
            return (
                newData?.aPlanDetails.push({
                    sDescription: item || '',
                    id: isEdit ? (mealPlanDetailsByIdData[index]?._id || '') : undefined
                })
            )
        })

        // for (const key in object1) {
        //     newData.aPlanDetails.push({
        //         sDescription: object1[key] || '',
        //     })
        // }


        if (isEdit) {
            updateMealPlanDetailsMutation.mutate({ newData, id })
        } else {
            mealPlanDetailsMutation.mutate(newData)
        }

    }

    const days = [
        { sTitle: 'Day-1' },
        { sTitle: 'Day-2' },
        { sTitle: 'Day-3' },
        { sTitle: 'Day-4' },
        { sTitle: 'Day-5' },
        { sTitle: 'Day-6' },
        { sTitle: 'Day-7' },
    ]

    return (
        <>

            <Wrapper
                isLoading={mealPlanById?.isLoading}
            >
                <PageTitle
                    title={'Meal Details'}
                    BtnText={mealPlanMutation?.data?.data?.data?.iMealPlanId ? '' : 'save'}
                    handleButtonEvent={handleSubmit(onSubmit)}
                    cancelText={'cancel'}
                    cancelButtonEvent={handleCancel}
                />

                <Divider className={'mt-3 mb-3'} />

                <Row>
                    <Col>
                        <Controller
                            name='sTitle'
                            control={control}
                            rules={rules?.global('Title')}
                            render={({ field, fieldState: { error } }) => (
                                <Input
                                    {...field}
                                    labelText='Title'
                                    isImportant='true'
                                    placeholder="Enter Title"
                                    id="sTitle"
                                    errorMessage={error?.message}
                                />
                            )}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Controller
                            name="sDescription"
                            control={control}
                            rules={rules?.global('Description')}
                            render={({ field, fieldState: { error } }) => (
                                <DescriptionInput
                                    {...field}
                                    isImportant='true'
                                    label='Description'
                                    placeholder="Enter Description"
                                    className="p-2 text-dark"
                                    errorMessage={error?.message}
                                />
                            )}
                        />
                    </Col>
                </Row>

            </Wrapper >

            {
                (mealPlanMutation?.data?.data?.data?.iMealPlanId || id) &&

                <Wrapper>

                    <PageTitle
                        title={'Week plan'}
                        className={'mt-3'}
                        BtnText={'save'}
                        handleButtonEvent={mealPlanDetailsHandleSubmit(onSubmitMealPlanDetails)}
                    />

                    <Divider className={'mt-3 mb-3'} />

                    <Row>
                        <Col>
                            {
                                days?.map((item, index) => {
                                    return (
                                        <Accordion className='mb-3' defaultActiveKey={0} key={index}>
                                            <Accordion.Item eventKey={index}>
                                                <Accordion.Header>{item?.sTitle}</Accordion.Header>
                                                <Accordion.Body>
                                                    <Row>
                                                        <Col lg={12} md={12} xs={12}>
                                                            <Controller
                                                                name={`meal-day-${index}`}
                                                                control={mealPlanDetailsControl}
                                                                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                                                                    <>
                                                                        <DescriptionInput
                                                                            className="p-2 text-dark"
                                                                            label='Answer'
                                                                            errorMessage={error?.message}
                                                                            placeholder="Enter the Meal Plan"
                                                                            ref={ref}
                                                                            onChange={onChange}
                                                                            value={value}
                                                                        />
                                                                    </>
                                                                )}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>

                                    )
                                })
                            }

                        </Col>
                    </Row>

                </Wrapper>
            }




        </>
    )
}

export default AddMealPlan
