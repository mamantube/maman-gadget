import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/productSlice";
import { Row, Col, Carousel } from "react-bootstrap";
import ListProducts from "../components/ListProducts";

export default function Beranda() {
    const dispatch = useDispatch();
    const { items, meta, isLoading, errorMessage } = useSelector(
        (state) => state.product
    );
    // const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(getProducts({ page: 1, per_page: 8, search: "" }));
    }, [dispatch]);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (errorMessage) {
        return <h1 style={{ color: "red" }}>{errorMessage}</h1>;
    }

    return (
        <div className=" mt-5 container-fluid">
            <div>
                <Row>
                    <Col>
                        <h1>Temukan Gadget Impianmu dengan Harga Terbaik</h1>
                        <p>
                            Dari smartphone terbaru hingga aksesoris favorit,
                            semua ada di Maman Gadget. Belanja mudah, cepat, dan
                            aman hanya dalam beberapa klik.
                        </p>
                    </Col>
                    <Col>
                        <Carousel
                            controls={false}
                            indicators={false}
                            interval={2000}
                        >
                            <Carousel.Item>
                                <img
                                    src="/storage/img/iphonead.jpg"
                                    className=" w-100"
                                    alt=""
                                    style={{
                                        objectFit: "cover",
                                        height: "400px",
                                    }}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    src="/storage/img/loq.png"
                                    alt=""
                                    style={{
                                        objectFit: "cover",
                                        height: "400px",
                                    }}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    src="/storage/img/xiaomiad.jpg"
                                    alt=""
                                    style={{
                                        objectFit: "cover",
                                        height: "400px",
                                    }}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    src="/storage/img/macad.jpg"
                                    alt=""
                                    style={{
                                        objectFit: "cover",
                                        height: "400px",
                                    }}
                                />
                            </Carousel.Item>
                        </Carousel>
                    </Col>
                </Row>
            </div>

            <ListProducts dataProduct={items}/>
            <ul>
                {items.length > 0 ? (
                    items.map((product) => (
                        <li key={product.id}>
                            {product.product_name} - {product.price}
                        </li>
                    ))
                ) : (
                    <h6>tidak ada produk yang ditemukan</h6>
                )}
            </ul>
        </div>
    );
}
