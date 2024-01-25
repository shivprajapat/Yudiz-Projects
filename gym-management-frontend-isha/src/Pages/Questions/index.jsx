import React, { useCallback, useMemo, useState } from 'react'

// component
import DescriptionInput from 'Components/DescriptionInput'
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import Divider from 'Components/Divider'
import Wrapper from 'Components/wrapper'
import Button from 'Components/Button'
import Search from 'Components/Search'
import Select from 'Components/Select'

// query
import { addQuestion, deleteQuestion, updateQuestion } from 'Query/Questions/questions.mutation'
import { getQuestionsList, getSpecificQuestion } from 'Query/Questions/questions.query'
import { useMutation, useQuery, useQueryClient } from 'react-query'

// icons
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import Information from 'Assets/Icons/infoIcon'

// helper
import { appendParams, cell, isGranted, parseParams, rules, toaster } from 'helpers'

// hook
import { Controller, useForm } from 'react-hook-form'
import { debounce } from 'Hooks/debounce'

import { Col, Row } from 'react-bootstrap'
import Input from 'Components/Input'

function QuestionsList() {

  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)

  const { control, handleSubmit, reset } = useForm()

  const enums = [
    { label: 'Medical', value: 'M' },
    { label: 'Diet', value: 'D' }
  ]

  const [questionModal, setQuestionModal] = useState({ open: false })
  const [requestParams, setRequestParams] = useState(getParams())
  const [search, setSearch] = useState(parsedData?.search)
  const [modal, setModal] = useState({ open: false })
  const [questionId, setQuestionId] = useState(null)
  const [action, setAction] = useState('')
  const columns = useMemo(() =>
    [
      { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
      { name: 'Questions', connectionName: 'sQuestion', isSorting: false, sort: 0 },
      { name: 'Category', connectionName: 'eCategory', isSorting: false, sort: 0 },
    ],
    []
  )

  // get questions
  const { data } = useQuery(['questions', requestParams], () => getQuestionsList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })


  // get questions by ID
  const { isLoading } = useQuery(['questionDetail', questionId], () => getSpecificQuestion(questionId), {
    enabled: action === 'edit' || action === 'view',
    select: (data) => data.data.oQuestion,
    onSuccess: (data) => {
      data.eCategory = enums.find(item => item?.value === data.eCategory)
      reset(data)
    },
  })

  // post questions
  const { mutate: addMutation } = useMutation((data) => addQuestion(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries('questions')
      toaster(data.data.message)
      handleAddModalClose()
    },
  })

  // update questions
  const { mutate: updateMutation } = useMutation(updateQuestion, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('questions')
      toaster(res.data.message)
      handleAddModalClose()
    },
  })

  // delete questions
  const { mutate: deleteMutation } = useMutation(deleteQuestion, {
    onSuccess: (data) => {
      toaster(data.data.message)
      queryClient.invalidateQueries('questions')
      setModal({ open: false })
    },
  })

  function onSubmit(data) {

    const { nPriority, sQuestion, eCategory } = data
    const newData = {
      nPriority,
      sQuestion,
      eCategory: eCategory?.value
    }

    if (action === 'edit') {
      updateMutation({ questionId, newData })
    } else {
      addMutation(newData)
    }
  }

  function gotoAdd() {
    reset({})
    setAction('add')
    setQuestionModal({ open: true, })
  }

  function gotoEdit(id) {
    setAction('edit')
    setQuestionId(id)
    setQuestionModal({ open: true, id })
  }

  function gotoDetail(id) {
    setAction('view')
    setQuestionId(id)
    setQuestionModal({ open: true })
  }

  function onDelete(id) {
    setModal({ open: true, id })
  }
  function handleAddModalClose() {
    setQuestionModal({ open: false })
    setAction('')
    setQuestionId('')
    reset({
      eCategory: '',
      nPriority: '',
      sQuestion: ''
    })
  }

  const debouncedSearch = useCallback(
    debounce((trimmed) => {
      setRequestParams({ ...requestParams, page: 0, search: trimmed })
      appendParams({ ...requestParams, page: 0, search: trimmed })
    }),
    []
  )

  function handleSearch(e) {
    e.preventDefault()
    setSearch(e.target.value)
    const trimmed = e.target.value.trim()
    debouncedSearch(trimmed)
  }

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
  }

  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
    // setSelectedRows([{ changingPage: true }])
  }

  const permissions = {
    CREATE: 'noRole',
    READ: 'noRole',
    UPDATE: 'noRole',
    DELETE: 'noRole',
    EXCEL: 'noRole',
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE]
    },
  }

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
    }
  }
  return (
    <>
      <Wrapper>
        <PageTitle
          title="Questions"
          BtnText={isGranted(permissions.CREATE) ? 'Add Question' : null}
          handleButtonEvent={gotoAdd}
          add
        />
        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
          <div className="d-flex align-items-center gap-2">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Question"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider width={'155%'} height="1px" />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aQuestionList?.length}
          isLoading={isLoading}
        >
          {data?.aQuestionList?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td className="d-inline-block text-truncate" style={{ maxWidth: 450 }}>{cell(item?.sQuestion)}</td>
                <td>{cell(item?.eCategory === 'M' && 'Medical' || item?.eCategory === 'D' && 'Diet')}</td>
                <ActionColumn
                  permissions={permissions}
                  handleView={() => gotoDetail(item._id)}
                  handleEdit={() => gotoEdit(item._id)}
                  handleDelete={() => onDelete(item._id)}
                />
              </tr>
            )
          })}
        </DataTable>
      </Wrapper>

      <Wrapper transparent>
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 5}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>

      {questionModal && (action !== 'delete') &&
        <CustomModal
          modalBodyClassName="p-0 py-2"
          open={questionModal.open}
          handleClose={() => handleAddModalClose()}
          title={action === 'add' ? 'Add Question' : action === 'edit' ? 'Edit Question' : 'View Questions'}
          isLoading={isLoading || addMutation?.isLoading || updateMutation?.isLoading}
        >
          <div className="d-flex flex-column">
            <div>
              <Row>
                <Col lg={12} md={12} xs={12}>
                  <Controller
                    name="eCategory"
                    control={control}
                    rules={rules?.select('Category')}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <>
                        <Select
                          labelText="Category"
                          id="eCategory"
                          placeholder="Select Category"
                          onChange={onChange}
                          value={value}
                          getOptionLabel={(option) => option?.label}
                          getOptionValue={(option) => option?.value}
                          ref={ref}
                          isDisabled={action === 'view'}
                          errorMessage={error?.message}
                          options={enums}
                          isImportant
                        />
                      </>
                    )}
                  />
                </Col>
              </Row>

              <Row className='mt-2'>
                <Col>
                  <Controller
                    name='nPriority'
                    control={control}
                    rules={rules?.global('Priority')}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Input
                        labelText='Priority'
                        placeholder='Enter Priority'
                        type="number"
                        onKeyDown={(e) => {
                          const exceptThisSymbols = ["e", "E", "+", "-", ".", "0"]
                          exceptThisSymbols.includes(e.key) && e.preventDefault()
                        }}
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        isImportant
                        errorMessage={error?.message}
                        disabled={action === 'view'}
                        info={<Information />}
                        tooltipContent="Assign a priority number to questions to ensure that more prioritized questions appear at the top of the list."
                      />
                    )}
                  />
                </Col>
              </Row>


              <Row className='mt-1'>
                <Col lg={12} md={12} xs={12} className="mt-md-0 mt-3">
                  <Controller
                    name="sQuestion"
                    control={control}
                    rules={rules?.global('Question')}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <DescriptionInput
                          className="p-2 text-dark"
                          label="Question"
                          errorMessage={error?.message}
                          disabled={action === 'view'}
                          placeholder="Enter Question"
                          isImportant
                          {...field}
                        />
                      </>
                    )}
                  />
                </Col>
              </Row>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => handleAddModalClose()}>
                Cancel
              </Button>
              {
                (action === 'add' || action === 'edit') &&
                <Button type='submit' onClick={handleSubmit(onSubmit)}>
                  Save
                </Button>
              }
            </div>
          </div>
        </CustomModal>
      }

      <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={() => setModal({ open: false })} title="Are you Sure?">
        <h6>Are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button onClick={() => deleteMutation(modal.id)} loading={deleteMutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}

export default QuestionsList 
