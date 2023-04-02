import React from 'react'
import { Row,Container, Col } from 'react-bootstrap'

const Error = () => {

    let error = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily:" Arial, Helvetica, sans-serif",
        fontWeight: "600",
    }
  return (
    <Container>
        <Row style={error}>
            <Col className='text-center' md="4">
                <h1>404</h1>
                <h3>Page Not Found</h3>
            </Col>
        </Row>
    </Container>
  )
}

export default Error