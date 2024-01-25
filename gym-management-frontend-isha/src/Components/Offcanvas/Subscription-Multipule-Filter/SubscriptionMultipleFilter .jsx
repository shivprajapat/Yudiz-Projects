import React, { useState } from 'react'

// component
import Select from 'Components/Select'
import Button
    from 'Components/Button'
// helper
import { ePaymentStatus, eStatus } from 'helpers'

import { Offcanvas } from 'react-bootstrap'
import PropTypes from 'prop-types'

import './subscriptionFilter.scss'


function SubscriptionMultipleFilter({ show, handleShowClose, handleFilter, filters, setFilters }) {
    const [pendingFilters, setPendingFilters] = useState(filters)

    function handlePendingFilter(e, opt, fName) {
        if (opt?.action === 'clear') {
            setFilters({ ...filters, [fName]: null })
        }
        setFilters({ ...filters, [fName]: e })
        setPendingFilters(prev => ({ ...prev, [fName]: e?.value, [fName + 'Label']: e?.label }))
    }

    function clearFilters() {
        const clearedFilters = {}
        for (const key in filters) {
            clearedFilters[key] = null
        }
        setFilters(clearedFilters)

        const clearedPendingFilters = {}
        for (const key1 in pendingFilters) {
            clearedPendingFilters[key1] = null
        }
        setPendingFilters(clearedPendingFilters)
    }

    function applyFilters() {
        handleFilter(pendingFilters)
        handleShowClose()
    }

    return (
        <Offcanvas
            show={show}
            placement={'end'}
        >
            <Offcanvas.Header closeButton onHide={handleShowClose}>
                <Offcanvas.Title>

                    <span className='position-absolute' style={{ right: '15px', top: '13px' }}>
                        <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={clearFilters}>
                            Clear
                        </Button>
                        <Button type='submit' className='ms-1' onClick={applyFilters}>
                            Apply
                        </Button>
                    </span>

                    <p>Filter</p>

                </Offcanvas.Title>

            </Offcanvas.Header>
            <Offcanvas.Body>

                <Select
                    labelText={'Status'}
                    placeholder={'Select..'}
                    isClearable
                    getOptionLabel={(option) => option?.label}
                    getOptionValue={(option) => option?.value}
                    options={eStatus}
                    value={filters['eStatus']}
                    onChange={(e, option) => handlePendingFilter(e, option, 'eStatus')}
                    className={'mb-4'}
                />

                <Select
                    labelText={'Payment Status'}
                    placeholder={'Select..'}
                    isClearable
                    getOptionLabel={(option) => option?.label}
                    getOptionValue={(option) => option?.value}
                    options={ePaymentStatus}
                    value={filters['ePaymentStatus']}
                    onChange={(e, option) => handlePendingFilter(e, option, 'ePaymentStatus')}
                />

            </Offcanvas.Body>

        </Offcanvas>
    )
}

export default SubscriptionMultipleFilter

SubscriptionMultipleFilter.propTypes = {
    show: PropTypes.bool,
    filters: PropTypes.object,
    setFilters: PropTypes.func,
    handleFilter: PropTypes.func,
    handleShowClose: PropTypes.func,
}

