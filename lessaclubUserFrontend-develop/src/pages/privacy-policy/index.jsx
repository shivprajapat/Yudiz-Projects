import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Document, Page, pdfjs } from 'react-pdf'

import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const PrivacyPolicy = () => {
  const [numPagesOfView, setNumPagesOfView] = useState(null)
  const [pageNumberOfView, setPageNumberOfView] = useState(1)
  const [documentLink, setDocumentLink] = useState()

  function onDocumentLoadSuccessOfView({ numPages }) {
    setNumPagesOfView(numPages)
  }

  function changePageOfView(offset) {
    setPageNumberOfView((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPageOfView() {
    changePageOfView(-1)
  }

  function nextPageOfView() {
    changePageOfView(1)
  }

  useEffect(() => {
    const fetchDoc = async () => {
      const params = {
        isActive: true,
        type: 'privacyPolicy'
      }
      const response = await axios.get(`${apiPaths.getAdminPolicy}${setParamsForGetRequest(params)}`)
      if (response.data) {
        setDocumentLink(response.data?.result?.perviousTerms?.[0]?.pdfS3Link)
      }
    }

    fetchDoc()
  }, [])

  return (
    <div className="view-policy-container d-flex justify-content-center">
      <Document
        className="text-center mt-2"
        file={documentLink}
        onLoadSuccess={onDocumentLoadSuccessOfView}
        options={{ workerSrc: '/pdf.worker.js' }}
      >
        <Page pageNumber={pageNumberOfView} scale={2} />
        <p className="mt-1">
          <span className="me-2">
            Page {pageNumberOfView || (numPagesOfView ? 1 : '--')} of {numPagesOfView || '--'}
          </span>
          <Button
            className="bg-secondary text-light approve-btn border-0 me-1"
            type="button"
            disabled={pageNumberOfView <= 1}
            onClick={previousPageOfView}
          >
            Previous
          </Button>
          <Button
            className="bg-success text-light approve-btn border-0"
            type="button"
            disabled={pageNumberOfView >= numPagesOfView}
            onClick={nextPageOfView}
          >
            Next
          </Button>
        </p>
      </Document>
    </div>
  )
}

export default PrivacyPolicy
