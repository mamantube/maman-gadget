import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { IoCloseOutline } from "react-icons/io5";
import { IoList } from "react-icons/io5";

export default function Landing() {
    const [show, setSow] = useState(false);
    const navigateTo = useNavigate();

    let openMenu = show ? "d-block" : "d-none";
    let closeMenu = show ? "d-none" : "d-block";

    function showMenuBar() {
        setSow(!show);
    }

    return (
        <div>
            <Navbar
                expand="md"
                style={{ backgroundColor: "#1e2939" }}
                data-bs-theme="light"
                collapseOnSelect
            >
                <Container fluid>
                    <Navbar.Brand className=" ms-3">
                        <NavLink
                            to="/"
                            className="d-flex text-decoration-none text-black justify-content-center align-items-center gap-2"
                        >
                            <img
                                src="/storage/img/logo.png"
                                alt=""
                                className=" rounded-3"
                                width={"45rem"}
                            />
                            <p className=" text-white fw-bolder mb-0">
                                Maman Gadget
                            </p>
                        </NavLink>
                    </Navbar.Brand>

                    <Button
                        size="sm"
                        className="d-md-none d-block rounded-0"
                        onClick={showMenuBar}
                        style={{ backgroundColor: "#06B6D4"}}
                    >
                        <IoList className={`${closeMenu}`} style={{ color: "#1e2939"}} />
                        <IoCloseOutline className={`${openMenu}`} style={{ color: "#1e2939"}} />
                    </Button>

                    <Navbar.Collapse id="basic-navbar-nav" className={openMenu}>
                        <Nav className="me-auto ms-4">
                            <NavLink
                                to="/"
                                className=" nav-item text-decoration-none fw-medium"
                                activeclassname="active"
                                style={{ color: "#E5E7EB"}}
                            >
                                Beranda
                            </NavLink>

                            <NavLink
                                to="/product"
                                className=" nav-item text-decoration-none fw-medium ms-md-3"
                                style={{ color: "#E5E7EB"}}
                            >
                                Produk
                            </NavLink>
                        </Nav>

                        <div className=" my-3 my-md-0 me-3 ms-4">
                            <NavLink to="/register">
                                <Button className=" me-3 fw-medium rounded-0" style={{ backgroundColor: "#06B6D4", color: "#1e2939"}}>
                                    Daftar
                                </Button>
                            </NavLink>

                            <NavLink to="/login">
                                <Button className=" fw-medium rounded-0" style={{ backgroundColor: "#06B6D4", color: "#1e2939"}}>
                                    Masuk
                                </Button>
                            </NavLink>

                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Outlet />
        </div>
    );
}
