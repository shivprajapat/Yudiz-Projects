import React, { useState } from 'react'
import Select from 'react-select'
function Language () {
  const options = [
    { value: 'EN', label: 'EN' }, { value: 'Hindi', label: 'Hindi' }, { value: 'Guj', label: 'Guj' }
  ]
  const [selectedOption, setSelectedOption] = useState({ value: 'EN', label: 'EN' })
  return (
    <>
       <div className="language-box">
          <div className="form-lang-box">
            <Select classNamePrefix="filter-custom" isSearchable={false} Value={selectedOption} onChange={setSelectedOption} options={options} />
          </div>
        </div>
    </>
  )
}

export default Language
