import { useEffect, useState, useMemo } from "react";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IDRCurrency } from "../../utils/currencyFormat.js";
// import { debounce } from "lodash";
// import { toast } from "react-toastify";

export default function CartList() {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    let id = localStorage.getItem("id");
    let token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const navigateTo = useNavigate();

    const pendingPayment = useMemo(
        () => cart.filter((item) => item.payment === "pending"),
        [cart]
    );
    const successPayment = useMemo(
        () => cart.filter((item) => item.payment === "success"),
        [cart]
    );

    const getUserById = async () => {
        try {
            const response = await axios.get(
                `http://maman-gadget.test/api/user/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    withCredentials: true,
                }
            );
            setUser(response.data.data);
            setCart(response.data.data.cart_item || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!id || !token) {
            toast.error("Anda belum login");
            navigateTo("/");
            return;
        }

        getUserById();
    }, [id, token, navigateTo]);

    // useEffect untuk debug
    useEffect(() => {
        console.log("User state:", user);
        console.log("Cart state:", cart);
    }, [user, cart]);

    const payment = async (cartItemId) => {
        setLoading(true);
        try {
            const response = await axios.post(`http://maman-gadget.test/api/carts/${cartItemId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            await getUserById();
            Swal.fire("", response.data.message, "success");
        } catch (error) {
            Swal.fire("Pembayaran gagal", "", "error");
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    const removeFromCart = async (cartItemId) => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `http://maman-gadget.test/api/carts/${cartItemId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await getUserById();
            Swal.fire("", response.data.message, "success");
        } catch (error) {
            Swal.fire("Gagal menghapus produk", "", "error");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     if (id) {
    //         getUserById(id);
    //     }
    // }, [id]);

    // useEffect(() => {
    //     if (user) {
    //         console.log("User state berubah:", user);
    //         console.log("Ini Cart item:", cart);
    //     }
    // }, [user]);

    return (
        <div className="container vh-100">
            <h1 className="text-center mt-5">Keranjang Saya</h1>

            {/* Belum dibayar */}
            <div className="mt-5">
                <h4>Belum dibayar</h4>
            </div>
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading....</span>
                    </div>
                    <p className="mt-2">Memuat data....</p>
                </div>
            ) : pendingPayment.length === 0 ? (
                <div className="text-center my-5">
                    <span className="alert alert-danger w-25">
                        Tidak ada produk
                    </span>
                </div>
            ) : (
                <div className="container">
                    {pendingPayment.map((item) => (
                        <div key={item.id} className="row">
                            <div className="col">
                                <div className="card mt-4 cart">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-4 col-lg-3 align-self-center">
                                                <img
                                                    src={item.product.image}
                                                    alt=""
                                                    width="75rem"
                                                />
                                            </div>
                                            <div className="col-4 col-lg-3 align-self-center">
                                                <span className="fw-semibold">
                                                    {item.product.product_name}
                                                </span>
                                                <br />
                                                <span className="fw-semibold">
                                                    {item.quantity} Pcs
                                                </span>
                                            </div>
                                            <div className="col-4 col-lg-3 align-self-center">
                                                Total harga: <br />
                                                <span className="fw-semibold">
                                                    { IDRCurrency(
                                                        item.total_price
                                                    )}
                                                </span>
                                            </div>
                                            <div className="col-12 col-lg-3 mt-3 mt-lg-0 align-self-center">
                                                <button
                                                    onClick={() =>
                                                        payment(item.id)
                                                    }
                                                    className="btn btn-outline-secondary"
                                                >
                                                    Bayar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(item.id)
                                                    }
                                                    className="btn btn-outline-danger ms-2"
                                                >
                                                    Hapus dari keranjang
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sudah bayar */}
            <h4 className="mt-4">Sudah bayar</h4>
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading....</span>
                    </div>
                    <p className="mt-2">Memuat data....</p>
                </div>
            ) : successPayment.length === 0 ? (
                <div className="text-center my-5">
                    <span className="alert alert-danger w-25">
                        Belum ada produk yang sudah dibayar
                    </span>
                </div>
            ) : (
                <div className="container">
                    {successPayment.map((item) => (
                        <div key={item.id} className="card mt-4 cart">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-4 col-lg-3 align-self-center">
                                        <img
                                            src={item.product.image}
                                            alt=""
                                            width="75rem"
                                        />
                                    </div>
                                    <div className="col-4 col-lg-3 align-self-center">
                                        <span className="fw-semibold">
                                            {item.product.product_name}
                                        </span>
                                        <br />
                                        <span className="fw-semibold">
                                            {item.quantity} Pcs
                                        </span>
                                    </div>
                                    <div className="col-4 col-lg-3 align-self-center">
                                        Total harga: <br />
                                        <span className="fw-semibold">
                                            { IDRCurrency(item.total_price)}
                                        </span>
                                    </div>
                                    <div className="col-12 col-lg-3 mt-3 mt-lg-0 align-self-center">
                                        <span className="badge bg-success">
                                            Pembayaran berhasil
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
