import React from 'react'
import './style.scss'
import { Card, Col } from 'react-bootstrap'
import { likeIcon, eyeIcon, messageIcon, shareIcon, userImg, communityImg } from 'assets/images'
import { Link } from 'react-router-dom'
const SingleCommunityPost = () => {
  return (
    <Col xxl={4} lg={6} md={12}>
      <div className="single_item">
        <Card>
          <div className="card-images">
          <Card.Img variant="top" src={communityImg} />
          </div>
          <Link to='/'><button className="share-btn">
            <img src={shareIcon} alt="" />
          </button></Link>
          <Card.Body className="user-link">
            <p className='user-txt'>
              <Link to='/'>
                <img src={userImg} alt="" />
                 Fredin bosco</Link>
                 <p className='d-community'><span>in</span>
                 <Link to='/'>3D Community</Link></p>
            </p>
            <span className="days">2 days ago</span>
          </Card.Body>
          <Card.Body>
            <Card.Title><Link to='/'>There are many variations</Link> </Card.Title>
            <Card.Text>
              when looking at its layout. The point of using Lorem Ipsum is that it has making it look like readable English look...{' '}
              <a href="/">Read more</a>
            </Card.Text>
          </Card.Body>
          <Card.Body className="social-link">
            <Card.Link href="#">
              {' '}
              <img src={likeIcon} alt="" /> <p>200</p>
            </Card.Link>
            <Card.Link href="#">
              <img src={messageIcon} alt="" /> <p>40</p>
            </Card.Link>
            <Card.Link href="#">
              <img src={eyeIcon} alt="" /> <p>799</p>
            </Card.Link>
          </Card.Body>
        </Card>
      </div>
    </Col>
  )
}

export default SingleCommunityPost
