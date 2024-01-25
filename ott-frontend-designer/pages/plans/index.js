import React from "react";
import Image from "next/image";
import style from "./style.module.scss";
import { iconCheck } from "@/assets/images";
import LeftArrow from "@/assets/images/jsIcon/leftArrow";
import { Button, Heading, Wrapper } from "@/shared/components";
import { Col, Container, Row, Table } from "react-bootstrap";

const Plans = () => {
    const { plans, plans_card, plans_table, plans_footer } = style;
    return (
        <section className={`${plans} banner-padding`}>
            <Container>
                <Row>
                    <Col xxl={7} lg={10} sm={12} className="mx-auto">
                        <div>
                        <Heading title="Choose Plan" />
                        <Wrapper Orange>
                            <div className={plans_card}>
                                <div className={plans_table}>
                                    <Table className={plans_table} responsive>
                                        <thead>
                                            <tr>
                                                <td><h6><span>2000+</span> Exclusive Original<br /> Shows & Movies</h6></td>
                                                <td>Solo</td>
                                                <td>Family</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Exclusive Original Shows & Movies</td>
                                                <td><Image src={iconCheck} alt="iconCheck" /></td>
                                                <td>2</td>
                                            </tr>
                                            <tr>
                                                <td>Unlimited movies, shows and much more.</td>
                                                <td><Image src={iconCheck} alt="iconCheck" /></td>
                                                <td>4</td>
                                            </tr>

                                            <tr>
                                                <td>Number of logged in devices</td>
                                                <td>2</td>
                                                <td>4</td>
                                            </tr>
                                            <tr>
                                                <td>Watch on devices at same time</td>
                                                <td>1</td>
                                                <td>2</td>
                                            </tr>
                                            <tr>
                                                <td>Advertisement</td>
                                                <td><Image src={iconCheck} alt="iconCheck" /></td>
                                                <td><Image src={iconCheck} alt="iconCheck" /></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>INR <span>299/</span>Year</td>
                                                <td>INR <span>599/</span>Year</td>
                                            </tr>
                                        </tbody>
                                    </Table>

                                </div>
                            </div>
                        </Wrapper>
                            <div className={plans_footer}>
                                <Button bgOrange BtnIcon={<LeftArrow />}>Continue with 599/year</Button>
                                <p>Apply Promocode</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Plans;
