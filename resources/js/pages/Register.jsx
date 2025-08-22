import { Form, Button } from "react-bootstrap";
import * as Yup from "yup";
import { useNavigate, NavLink } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Register() {
    const navigateTo = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const schema = Yup.object({
        name: Yup.string().required("Nama wajib disii").trim(),
        user_name: Yup.string()
            .required("Nama pengguna wajib diisi")
            .matches(/^[a-zA-Z0-9]+$/, "Username tidak boleh mengandung spasi")
            .min(4, "Minimal 4 caracter"),
        phone: Yup.string()
            .required("nomor telpon wajib diisi")
            .matches(
                /^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/,
                "Nomor telpon tidak valid"
            )
            .max(13),
        email: Yup.string()
            .required("Email wajib diisi")
            .email("Email tidak valid"),
        password: Yup.string()
            .required("Password wajib diisi")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                "Minimal 6 karakter, satu huruf besar dan satu angka"
            ),
    });

    const initialForm = {
        name: "",
        user_name: "",
        phone: "",
        email: "",
        password: "",
    };

    const submitForm = async (values) => {
        try {
            const response = await axios.post(
                "http://maman-gadget.test/api/register",
                values
            );
            setErrorMessage(response.data.message);
            toast.success("Berhasil daftar, silahkan login");

            navigateTo("/login");
        } catch (error) {
            if (error.response) {
                const data = error.response.data;

                if (data.errors) {
                    // Ambil error pertama dari Laravel Validator
                    const firstError = Object.values(data.errors)[0][0];
                    console.error(firstError);
                    setErrorMessage(firstError);
                    toast.error(firstError);
                } else if (data.message) {
                    console.error(data.message);
                    setErrorMessage(data.message);
                    toast.error(data.message);
                } else {
                    console.error("Terjadi kesalahan");
                    toast.error("Terjadi kesalahan");
                }
            } else {
                console.error(error.message);
                toast.error("Terjadi kesalahan server");
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
                <Form.Group className=" mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Nama"
                        name="name"
                        value={Formik.values.name}
                        onChange={Formik.handleChange}
                        className=" border-secondary"
                        isInvalid={!!Formik.errors.name}
                        autoComplete="off"
                    />

                    <Form.Control.Feedback type="invalid">
                        {Formik.errors.name}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className=" mb-3">
                    <Form.Control
                        type="text"
                        placeholder="User_Name"
                        name="user_name"
                        value={Formik.values.user_name}
                        onChange={Formik.handleChange}
                        className=" border-secondary"
                        isInvalid={!!Formik.errors.user_name}
                        autoComplete="off"
                    />

                    <Form.Control.Feedback type="invalid">
                        {Formik.errors.user_name}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className=" mb-3">
                    <Form.Control
                        type="string"
                        placeholder="Nomor hanphone"
                        name="phone"
                        value={Formik.values.phone}
                        onChange={Formik.handleChange}
                        className=" border-secondary"
                        isInvalid={!!Formik.errors.phone}
                        autoComplete="off"
                    />

                    <Form.Control.Feedback type="invalid">
                        {Formik.errors.phone}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className=" mb-3">
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={Formik.values.email}
                        onChange={Formik.handleChange}
                        className=" border-secondary"
                        isInvalid={!!Formik.errors.email}
                        autoComplete="off"
                    />

                    <Form.Control.Feedback type="invalid">
                        {Formik.errors.email}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className=" mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={Formik.values.password}
                        onChange={Formik.handleChange}
                        className=" border-secondary"
                        isInvalid={!!Formik.errors.password}
                        autoComplete="off"
                    />
                    <Form.Control.Feedback type="invalid">
                        {Formik.errors.password}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="dark" type="submit" className=" w-100">
                    Daftar
                </Button>

                <span className=" d-flex">
                    <p className=" mt-3">
                        Sudah mempunyai akun? Silahkan masuk{" "}
                        <NavLink className="text-primary" to="/login">
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
