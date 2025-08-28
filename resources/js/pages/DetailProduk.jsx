import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart, detailproduct } from "../features/productSlice";
import { Row, Col, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

export default function DetailProduk() {
    const { id } = useParams();
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    const { selectedProduct, isLoading, errorMessage } = useSelector(
        (state) => state.product
    );

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (id) dispatch(detailproduct(id));
    }, [dispatch, id]);

    if (isLoading) {
        return <h3>Loading...</h3>;
    }

    if (errorMessage) {
        return <h3 style={{ color: "red" }}>{errorMessage}</h3>;
    }

    if (!selectedProduct) {
        return <h3>Produk tidak ditemukan</h3>;
    }

    const handleButtonClick = async () => {
        if (!token) {
            navigateTo("/login");
        } else if (role === "user") {
            try {
                await dispatch(
                    addToCart({ product_id: selectedProduct.id, quantity })
                ).unwrap();
                toast.success("Produk berhasil ditambahkan ke dalam keranjang");
                navigateTo("/customer/cart");
            } catch (error) {
                toast.error(
                    error.message || "Gagal menambahkan produk ke keranjang"
                );
            }
        } else if (role === "admin") {
            navigateTo(`/admin/product/update-product/${selectedProduct.id}`);
        }
    };

    let buttonText = "Login atau daftar untuk belanja";

    if (token && role === "user") {
        buttonText = "Tambahkan ke dalam keranjang";
    } else if (token && role === "admin") {
        buttonText = "Update produk";
    }
    return (
        <div className="container mt-5">
            {isLoading && <h3>Loading...</h3>}
            {errorMessage && <h3 style={{ color: "red" }}>{errorMessage}</h3>}
            {selectedProduct && (
                <Row>
                    <Col md={6}>
                        <img
                            src={selectedProduct.image}
                            alt={selectedProduct.product_name}
                            className="img-fluid rounded"
                        />
                    </Col>
                    <Col md={6}>
                        <h2>{selectedProduct.product_name}</h2>
                        <h4 className="text-success">
                            Rp {selectedProduct.price}
                        </h4>
                        <p>{selectedProduct.description}</p>

                        <Button variant="primary" onClick={handleButtonClick}>
                            {buttonText}
                        </Button>

                        {token && role === "user" && (
                            <Form.Group
                                className="mb-3 mt-3"
                                style={{ maxWidth: "200px" }}
                            >
                                <Form.Label>Jumlah</Form.Label>
                                <Form.Control
                                    type="number"
                                    min={1}
                                    max={selectedProduct.stock}
                                    placeholder="0"
                                    step={1}
                                    onChange={(e) =>
                                        setQuantity(
                                            Math.max(
                                                1,
                                                Math.min(
                                                    Number(e.target.value),
                                                    selectedProduct.stock
                                                )
                                            )
                                        )
                                    }
                                />
                                <small className="text-muted">
                                    Stok tersedia: {selectedProduct.stock}
                                </small>
                            </Form.Group>
                        )}
                    </Col>
                </Row>
            )}
        </div>
    );
}
