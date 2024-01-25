import React, { useEffect, useRef, useState } from 'react'
import { useMutation } from 'react-query'
import { Row, Col, Table, ListGroup } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { updateProject } from 'Query/Project/project.mutation'
import { appendParams, changeDateFormat, convertObjectToFile, toaster } from 'helpers'
import CalendarInput from 'Components/Calendar-Input'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'
import { route } from 'Routes/route'
import CustomToolTip from 'Components/TooltipInfo'
import Input from 'Components/Input'
import Delete from 'Assets/Icons/Delete'
import AddCircle from 'Assets/Icons/AddCircle'
import iconTrash from 'Assets/Icons/trash.svg'
import iconFile from 'Assets/Icons/file.png'
import './_contract.scss'
import '../../Dashboard/_dashboard.scss'

function ContractDetails({ formData, keyValue, projectType }) {
  const navigate = useNavigate()
  const { type, id } = useParams()
  const [modal, setModal] = useState({})
  const emptyInputRow = {
    sDocumentName: '',
    sContract: null,
  }
  const [documentDetails, setDocumentDetails] = useState([emptyInputRow])

  const { control, handleSubmit, reset } = useForm()
  const [showInputFiles, setShowInputFiles] = useState([])
  const contractFiles = useRef({ allFiles: [] })
  const updateMutation = useMutation((data) => updateProject(data), {
    onSuccess: () => {
      toaster('Project Updated Successfully')
      navigate(route.projects)
    },
  })

  function onSubmit(e) {
    const isValidDocumentDetail = documentDetails.some(item => (!item?.sDocumentName || !item?.sContract?.name))
    if(isValidDocumentDetail) {
      toaster('Enter Proper Document Name and Upload Proper Document File', 'error')
      return
    }
    const { eProjectType, dContractStartDate, dContractEndDate } = e
    const resData = {
      flag: 3,
      iProjectId: id,
      eProjectType: formData?.eProjectType || eProjectType,
      dContractStartDate,
      dContractEndDate,
      aContract: documentDetails,
    }
    if (type === 'edit') {
      updateMutation.mutate(resData)
    }
  }

  function handleRemove(file, index) {
    contractFiles.current.allFiles = contractFiles.current.allFiles?.filter((f, i) => f.name !== file.name && index !== i)
    const data = showInputFiles.filter((f, i) => f.name !== file.name && index !== i)
    setShowInputFiles(data)
    return file
  }

  function handleCancel() {
    navigate(route.projects)
    appendParams({ eProjectType: projectType })
  }

  function handleModalCancel() {
    setModal({ open: false })
  }

  function handleModalConfirm() {
    handleRemove(modal.file, modal.index) && handleModalCancel()
  }

  const handleDocumentNameChange = (index, event) => {
    const updatedFiles = [...documentDetails]
    updatedFiles[index].sDocumentName = event.target.value
    setDocumentDetails(updatedFiles)
  }

  const handleDocumentChange = (index, event) => {
    const updatedFiles = [...documentDetails]
    updatedFiles[index].sContract = event.target.files[0]
    setDocumentDetails(updatedFiles)
  }

  const handleAddMoreDocumentDetails = () => {
    setDocumentDetails([...documentDetails, emptyInputRow])
  }

  const handleDeleteDocumentDetails = (index) => {
    const updatedFiles = [...documentDetails]
    updatedFiles.splice(index, 1)
    setDocumentDetails(updatedFiles)
  }

  const handleDeleteDocument = (index) => {
    const updatedFiles = [...documentDetails]
    setDocumentDetails(updatedFiles.map((item, i) => {
      if(i === index) {
        return {
          ...item,
          sContract: null
        }
      }
      return item
    } ))
  }

  useEffect(() => {
    async function fetchData() {
      if (formData && type === 'edit') {
        const { eProjectType, dContractStartDate, dContractEndDate, contract } = formData
        if(contract?.length) {
          const resultData = await Promise.all(contract.map(async(i) => {
            const fileResult = await convertObjectToFile({
              ...i,
              name: i?.sName || ''
            })
            return {
              sDocumentName: i.sDocumentName,
              sContract: fileResult  
            }
          })) 
          
          setDocumentDetails(resultData)
        }
        reset({
          flag: '3',
          eProjectType,
          dContractStartDate: changeDateFormat(dContractStartDate),
          dContractEndDate: changeDateFormat(dContractEndDate),
        })
      }
    }
    fetchData()
  }, [formData])

  return (
    <Wrapper transparent isLoading={updateMutation.isLoading}>
      <Row>
        <Col lg={6} md={6} className="mb-3">
          <Controller
            name="dContractStartDate"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <CalendarInput onChange={onChange} value={value} ref={ref} errorMessage={error?.message} title="Contract Start Date*" />
            )}
          />
        </Col>
        <Col lg={6} md={6} className="mb-3">
          <Controller
            name="dContractEndDate"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <CalendarInput onChange={onChange} value={value} ref={ref} errorMessage={error?.message} title="Contract End Date*" />
            )}
          />
        </Col>
        <Col lg={12} md={12}>
          <div className="dashboard">
            <Table className="datatable m-0 w-100" responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document Name</th>
                  <th style={{ width: '500px' }}>Document</th>
                  <th style={{ width: '300px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {documentDetails.map((file, index) => (
                  <tr key={index}>
                    <td className="size-sm">{index + 1}</td>
                    <td className="size-sm">
                      <Input
                        disableError
                        placeholder="Enter document name"
                        inputContainerStyle={{ margin: 0 }}
                        onChange={(event) => handleDocumentNameChange(index, event)}
                        value={file?.sDocumentName || ''}
                      />
                    </td>
                    <td className="size-sm" style={{ width: '500px' }}>
                      {file?.sContract?.name ? (
                        <ListGroup
                          as="ul"
                          numbered
                          className="m-0"
                          key={file?.sContract?.name + '_' + index}
                          style={{ border: '1px solid #F2F4F7', borderRadius: '8px' }}
                        >
                          <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                            <div className="d-flex gap-2">
                              <img src={iconFile} alt="iconFile" className="file-icon" />
                              <div className="content">
                                <h6 className="title">{file?.sContract?.name}</h6>
                              </div>
                            </div>
                            {/* <ul>
                            <li onClick={() => {}}> */}
                            <div onClick={() => handleDeleteDocument(index)}>
                            <img src={iconTrash} alt="iconTrash" className="trash-icon" />
                            </div>
                            {/* </li>
                          </ul> */}
                          </ListGroup.Item>
                        </ListGroup>
                      ) : (
                        <div className="file-upload">
                          <div className="file-section">
                            <div className="file-drop-file">
                              <div className="file-drop-file-label">
                                <div className="desc">
                                  <input
                                    onChange={(event) => handleDocumentChange(index, event)}
                                    type="file"
                                    multiple
                                    accept=".rtf,.jpg,.jpeg,.png,.doc,.docx,.pdf,.xml,.xlsx,.xlsm,.xlsb,.xltx,.xls,.txt,.csv,	
                      .xps,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                  />
                                  <p>Drag and Drop your file here or </p>
                                  <button className="btn-dark btn">Browse</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="size-sm" style={{ width: '300px' }}>
                      {index === documentDetails.length - 1 ? (
                        <div style={{ display: 'flex' }}>
                          {index > 0 && (
                            <CustomToolTip tooltipContent="Delete" position="top">
                              {({ target }) => (
                                <span
                                  ref={target}
                                  className={`mx-1 cursor-pointer box-highlight table-delete`}
                                  onClick={() => handleDeleteDocumentDetails(index)}
                                >
                                  <Delete fill="#ff2e69" />
                                </span>
                              )}
                            </CustomToolTip>
                          )}
                          <CustomToolTip tooltipContent="Add More" position="top">
                            {({ target }) => (
                              <span
                                ref={target}
                                className={`mx-1 cursor-pointer box-highlight table-add-new plus-icon`}
                                onClick={handleAddMoreDocumentDetails}
                              >
                                <AddCircle fill="#0ea085" />
                              </span>
                            )}
                          </CustomToolTip>
                        </div>
                      ) : (
                        <CustomToolTip tooltipContent="Delete" position="top">
                          {({ target }) => (
                            <span
                              ref={target}
                              className={`mx-1 cursor-pointer box-highlight table-delete`}
                              onClick={() => handleDeleteDocumentDetails(index)}
                            >
                              <Delete fill="#ff2e69" />
                            </span>
                          )}
                        </CustomToolTip>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <PageTitle
            className="my-4"
            cancelText="Cancel"
            cancelButtonEvent={handleCancel}
            BtnText={keyValue !== '3' ? 'Save & Next' : 'Save'}
            handleButtonEvent={handleSubmit(onSubmit)}
          />
        </Col>
      </Row>

      <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={handleModalCancel} title="Are you Sure?">
        <h6>Are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={handleModalCancel}>
              Cancel
            </Button>
            <Button onClick={handleModalConfirm}>Delete</Button>
          </div>
        </div>
      </CustomModal>
    </Wrapper>
  )
}

ContractDetails.propTypes = {
  setPage: PropTypes.func,
  keyValue: PropTypes.string,
  projectType: PropTypes.string,
  formData: PropTypes.object,
}

export default ContractDetails
