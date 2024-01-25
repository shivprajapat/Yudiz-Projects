import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/router";

import style from "./style.module.scss";
import { img404 } from "@/assets/images";
import Wrapper from "@/shared/components/Wrapper";
import MyImage from "@/shared/components/myImage";
import { Button, ModalWrapper } from "@/shared/components";

const ErrorPage = () => {
  const { error } = style;
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }, [router]);

  return (
    <Wrapper Orange>
      <section className={error}>
        <Container>
          <Row>
            <Col xxl={5} md={8} sm={10} className="mx-auto">
              <ModalWrapper Shadow space_lg>
                <MyImage src={img404} alt="404" />
                <h2>404</h2>
                <p>This page could not be found.</p>
                <Button bgOrange onClick={handleClick}>
                  Back To Homepage
                </Button>
              </ModalWrapper>
            </Col>
          </Row>
        </Container>
      </section>
    </Wrapper>
  );
};

export default ErrorPage;
