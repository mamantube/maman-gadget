import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProducts } from "../features/productSlice";
import ListProducts from "../components/ListProducts";

export default function Produk() {
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();

    const { items, meta, isLoading, errorMessage } = useSelector(
        (state) => state.product
    );

    useEffect(() => {
        dispatch(getProducts({ page: 1, per_page: 8, search: "" }));
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(getProducts({ page: 1, per_page: 8, search}));
    }


    return (
        <Container className=" mt-5">
            <Row>
                <Col>
                    <Form onSubmit={handleSearch} className=" d-flex">
                        <Form.Control type="text" placeholder="Cari produk...." value={search} onChange={(e) => setSearch(e.target.value)} />

                        <Button type="submit">
                            Cari
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row className=" mt-5">
                <Col>
                    <ListProducts dataProduct={items} />
                </Col>
            </Row>
        </Container>
    );
}
