import React from 'react'
import { Form } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'
import PropTypes from 'prop-types'

import TinyEditor from 'shared/components/tiny-editor'
import { validationErrors } from 'shared/constants/validationErrors'

const BlogTab = ({ currentTab }) => {
  const {
    control,
    register,
    formState: { errors }
  } = useFormContext()

  return (
    <>
      <Form.Group className="form-group">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="blog.title"
          className={errors?.blog?.title && 'error'}
          {...register('blog.title', {
            required: currentTab === 'blog' ? validationErrors.required : false,
            maxLength: {
              value: 20,
              message: validationErrors.maxLength(20)
            }
          })}
        />
        {errors?.blog?.title && (
          <Form.Control.Feedback type="invalid" className="invalidFeedback">
            {errors?.blog?.title?.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="blog.description"
          {...register('blog.description', {
            required: currentTab === 'blog' ? validationErrors.required : false,
            minLength: { value: 10, message: validationErrors.rangeLength(10, 100) },
            maxLength: { value: 100, message: validationErrors.rangeLength(10, 100) }
          })}
          className={errors?.blog?.description && 'error'}
        />
        {errors?.blog?.description && (
          <Form.Control.Feedback type="invalid" className="invalidFeedback">
            {errors?.blog?.description.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label>content</Form.Label>
        <TinyEditor className="form-control" name="blog.content" required={!!currentTab === 'blog'} control={control} />
        {errors?.blog?.content && (
          <Form.Control.Feedback type="invalid" className="invalidFeedback">
            {errors?.blog?.content?.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </>
  )
}
BlogTab.propTypes = {
  currentTab: PropTypes.string
}
export default BlogTab
