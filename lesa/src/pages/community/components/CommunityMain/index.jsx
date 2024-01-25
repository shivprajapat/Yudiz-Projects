import CustomPagination from 'shared/components/custom-pagination'
import React, { useState } from 'react'
import { Row } from 'react-bootstrap'
import SingleCommunityPost from '../SingleCommunityPost'
// import WriteInCommunity from '../WriteInCommunity'

const CommunityMain = () => {
  const [currentPage, setCurrentPage] = useState(1)
  return (
    <div className='d-flex flex-column'>
      {/* write blog  */}
      {/* <WriteInCommunity /> */}
      {/* single community  post */}
      <Row className='flex-wrap'>
        {

          new Array(9).fill('').map((index) => {
            return (
              <SingleCommunityPost key={index}/>
            )
          })
        }
      {/* <SingleCommunityPost />
      <SingleCommunityPost />
      <SingleCommunityPost />
      <SingleCommunityPost />
      <SingleCommunityPost />
      <SingleCommunityPost />
      <SingleCommunityPost />
      <SingleCommunityPost />
      <SingleCommunityPost /> */}

      <CustomPagination
                       currentPage={currentPage}
                        totalCount={40}
                        pageSize={10}
                        onPageChange={(e) => setCurrentPage(e)}
                      />
      </Row>
    </div>
  )
}

export default CommunityMain
