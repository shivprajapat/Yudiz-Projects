import React, { forwardRef, useId } from 'react'
import PropTypes from 'prop-types'
import './_textarea.scss'

const TextArea = forwardRef(function TextArea(
    {
        label,
        onChange,
        error,
        value,
        id,
        maxLength,
        inputContainerClass,
        inputContainerStyle,
        ...props
    },
    ref
) {
    const RandomId = useId()
    return (
        <>

            <div className={`d-flex textarea ${inputContainerClass || ''}`} style={inputContainerStyle}>
                {label && <label htmlFor={id || RandomId}>{label}</label>}
                <div className="textarea-field">
                    <textarea
                        onChange={onChange}
                        ref={ref}
                        maxLength={maxLength}
                        value={value}
                        id={id || RandomId}
                        className={`${error ? 'errorTextArea' : ''}`}
                        {...props}
                    >
                    </textarea>
                </div>
                {error && <p className="errorMessage">{error}</p>}
            </div>
        </>
    )
})

TextArea.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string,
    value: PropTypes.any,
    id: PropTypes.string,
    maxLength: PropTypes.number,
    inputContainerClass: PropTypes.string,
    inputContainerStyle: PropTypes.object,
}

export default TextArea
