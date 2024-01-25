import React from 'react'
import { Col, Row } from 'react-bootstrap'

import style from "./style.module.scss";
import { Heading, MovieWatching, Wrapper } from '@/shared/components'
import { imgCard14, imgCard2, imgCard4, imgCard6 } from '@/assets/images'

const Watching = () => {
    const { watching } = style;
    const data = [
        { id: 1, img: imgCard6 },
        { id: 2, img: imgCard4 },
        { id: 3, img: imgCard14 },
        { id: 4, img: imgCard2 },
        { id: 5, img: imgCard14 },
        { id: 6, img: imgCard6 },
        { id: 7, img: imgCard4 },
        { id: 8, img: imgCard6 }
    ]
    return (
        <Wrapper Orange>
            <section className={`banner-padding ${watching}`}>
                <Heading title='Continue Watching' />
                <Row xxl={4} lg={3} md={2} sm={2} xs={1} className="g-2">{
                    data?.map((item, index) => {
                        return (
                            <Col key={index}>
                                <MovieWatching img={item.img} title="30M+ Views" />
                            </Col>
                        )
                    })
                }
                </Row>
            </section>
        </Wrapper>
    )
}

export default Watching