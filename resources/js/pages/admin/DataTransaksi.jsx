import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Card } from "react-bootstrap";

export default function DataTransaski() {
    const [carts, setCarts] = useState([]);
    const token = localStorage.getItem("token")
    const [loading, setLoading] = useState(false)

    const getCart = async() => {
        setLoading(true)
        try {
            const response = await axios.get("http://maman-gadget.test/api/carts", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCarts(response.data.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCart()
    }, [])

    const pendingPayment = useMemo(
        () => carts.filter((item) => item.payment === "pending")
    )

    const successPayment = useMemo(
        () => carts.filter((item => item.payment === "success"))
    )

    const showCarts = () => {
        console.log(carts)
    }
    return (
        <div>
            <h1>Data Transaksi</h1>
            <Button onClick={showCarts}>
                carts
            </Button>


            <div>
                <h3>Belum Bayar</h3>
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading....</span>
                    </div>
                    <p className="mt-2">Memuat data....</p>
                </div>
            ) : !pendingPayment.length ? (
                <div className="text-center my-5">
                    <span className="alert alert-danger w-25">
                        Tidak ada data transaksi
                    </span>
                </div>
            ) : (
                <Container>
                    {pendingPayment.map((item) => (
                        <Row key={item.id}>
                            <Col>
                                <Card>
                                    <Card.Body>
                                        <Row>
                                            <Col>
                                                <img src={item.product.image} alt="" width="75rem" />
                                            </Col>
                                        </Row>

                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ))}
                </Container>
            )}

            <div>
                <h3>Sudah Bayar</h3>
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading....</span>
                    </div>
                    <p className="mt-2">Memuat data....</p>
                </div>
            ) : !successPayment.length ? (
                <div className="text-center my-5">
                    <span className="alert alert-danger w-25">
                        Tidak ada data transaksi
                    </span>
                </div>
            ) : (
                <Container>
                    {successPayment.map((item) => (
                        <Row key={item.id}>
                            <Col>
                                <Card>
                                    <Card.Body>
                                        <Row>
                                            <Col>
                                                <img src={item.product.image} alt="" width="75rem" />
                                            </Col>
                                        </Row>

                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ))}
                </Container>
            )}
        </div>
    )
}