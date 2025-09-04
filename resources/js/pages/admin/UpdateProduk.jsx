import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";
import { Button, Card, Spinner, Container, Row, Col } from "react-bootstrap";

export default function UpdateProduct() {
    const { id } = useParams();
    const navigateTo = useNavigate();
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const schemaValidation = Yup.object().shape({
        product_name: Yup.string().required("Nama produk wajib diisi"),
        description: Yup.string().required("Deskripsi produk wajib diisi"),
        price: Yup.number().required("Harga produk tidak boleh kosong"),
        stock: Yup.number().required("Stok produk wajib diidi"),
        image: Yup.mixed().nullable(),
    });

    const [initialValues, setInitialValues] = useState({
        product_name: "",
        description: "",
        price: "",
        stock: "",
        image: null,
    });

    useEffect(() => {
        const getProduct = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://maman-gadget.test/api/products/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const product = response.data.data;
                setInitialValues({
                    product_name: product.product_name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    image: product.image,
                });
                setImagePreview(product.image);
            } catch (error) {
                Swal("Gagal memuat data", error, "error");
                navigateTo(`/admin/product/detail-product/${id}`);
            } finally {
                setLoading(false);
            }
        };
        getProduct();
    }, [id, token, navigateTo]);

    const updateButton = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("product_name", values.product_name);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("stock", values.stock);

            if (values.image instanceof File) {
                formData.append("image", values.image);
            }

            const result = await Swal.fire({
                title: "Apakah anda ingin penyimpan perubahan data?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Simpan",
                denyButtonText: "Jangan simpan",
            });

            if (result.isConfirmed) {
                await axios.post(
                    `http://maman-gadget.test/api/products/${id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                Swal.fire("Data produk diperbaharui", "", "success");
                navigateTo(`/admin/product/detail-product/${id}`);
            } else if (result.isDenied) {
                Swal.fire("Update data dibatalkan", "", "info");
                navigateTo(`/admin/product/detail-product/${id}`);
            }
        } catch (error) {
            Swal.fire("Error", `${error}`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className=" bg-gray-200">
                            <h1>Update Produck</h1>
                        </Card.Header>
                        <Card.Body>
                            {loading ? (
                                <div className=" text-center">
                                    <Spinner
                                        animation="border"
                                        variant="primary"
                                    />
                                    <p>Memuat Produk</p>
                                </div>
                            ) : (
                                <Formik
                                    initialValues={initialValues}
                                    enableReinitialize
                                    validationSchema={schemaValidation}
                                    onSubmit={updateButton}
                                >
                                    {({ setFieldValue }) => (
                                        <Form>
                                            {/* Nama Produk */}
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Nama Produk
                                                </label>
                                                <Field
                                                    name="product_name"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="product_name"
                                                    component="div"
                                                    className="invalid-feedback d-block"
                                                />
                                            </div>

                                            {/* Stock & Harga */}
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">
                                                        Stock
                                                    </label>
                                                    <Field
                                                        name="stock"
                                                        type="number"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name="stock"
                                                        component="div"
                                                        className="invalid-feedback d-block"
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">
                                                        Harga
                                                    </label>
                                                    <Field
                                                        name="price"
                                                        type="number"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name="price"
                                                        component="div"
                                                        className="invalid-feedback d-block"
                                                    />
                                                </div>
                                            </div>

                                            {/* Deskripsi */}
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Deskripsi
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    name="description"
                                                    rows="3"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="description"
                                                    component="div"
                                                    className="invalid-feedback d-block"
                                                />
                                            </div>

                                            {/* Gambar Produk */}
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Gambar Produk
                                                </label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files[0];
                                                        setFieldValue(
                                                            "image",
                                                            file
                                                        );
                                                        if (file) {
                                                            setImagePreview(
                                                                URL.createObjectURL(
                                                                    file
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                                {imagePreview && (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="img-thumbnail mt-2"
                                                        width="150"
                                                    />
                                                )}
                                            </div>

                                            <Button
                                                type="submit"
                                                variant="outline-primary"
                                            >
                                                Simpan Perubahan
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
