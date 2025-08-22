import { Row,Col, Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function Auth() {
    return (
        <Container fluid>
            <ToastContainer position="top-right" />
            <Row>
                <Col>
                    <img src="/storage/img/logobgwhite.png" alt="" />
                    <h5>Maman Gadget</h5>
                </Col>
            </Row>
            
            <Outlet />
        </Container>
    )
}