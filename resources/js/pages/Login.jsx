import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { useNavigate, NavLink } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
    const navigateTo = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const initialForm = {
        email: "",
        password: "",
    };

    const schema = Yup.object({
        email: Yup.string()
            .required("Email wajib diisi")
            .email("Email tidak valid"),
        password: Yup.string()
            .required("Masukkan password")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                "Minimal 6 karakter, satu huruf besar dan satu angka"
            ),
    });

    const submitForm = async (values) => {
        try {
            const response = await axios.post(
                "http://maman-gadget.test/api/login",
                values
            );
            let { id, role } = response.data.data;
            let token = response.data.token

            localStorage.setItem("role", role);
            localStorage.setItem("token", token);
            localStorage.setItem("id", id);

            toast.success("Login Berhasil");
            navigateTo(
                role === "admin" ? "/admin/beranda" : "/customer/beranda"
            );
        } catch (error) {
            if (error.response) {
                const data = error.response.data;

                if (data.message) {
                    toast.error(data.message)
                }
            } else {
                setErrorMessage("Terjadi kesalahan server, coba beberapa saat lagi")
                toast.error("Terjadi kesalahan server, coba beberapa saat lagi")
            }
        }
    };

    const Formik = useFormik({
        initialValues: initialForm,
        validationSchema: schema,
        onSubmit: submitForm,
    });
    return (
        <div>
            <Form onSubmit={Formik.handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        className=" border-secondary"
                        name="email"
                        value={Formik.values.email}
                        onChange={Formik.handleChange}
                        isInvalid={!!Formik.errors.email}
                        autoComplete="off"
                    />
                    <Form.Control.Feedback type="invalid">
                        {Formik.errors.email}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        className=" border-secondary"
                        name="password"
                        value={Formik.values.password}
                        onChange={Formik.handleChange}
                        isInvalid={!!Formik.errors.password}
                        autoComplete="off"
                    />
                    <Form.Control.Feedback type="invalid">
                        {Formik.errors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="dark" type="submit" className=" w-100">
                    Masuk
                </Button>
                <span className=" d-flex">
                    <p className=" mt-3">
                        Belum mempunyai akun? Silahkan daftar{" "}
                        <NavLink className=" text-primary" to="/register">
                            Di sini
                        </NavLink>{" "}
                    </p>
                </span>
                <NavLink to="/">
                    <Button size="sm" variant="outline-primary">
                        Ke beranda
                    </Button>

                </NavLink>
            </Form>
        </div>
    );
}
