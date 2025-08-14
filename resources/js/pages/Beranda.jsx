import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Flex, Layout, Drawer, Menu, Grid, Space } from "antd";
import {
    MenuOutlined,
    HomeOutlined,
    UserOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { getProducts } from "../features/productSlice";

export default function Beranda() {
    const { Header, Content, Footer } = Layout;
    const { useBreakpoint } = Grid;

    const dispatch = useDispatch();
    const { items, meta, isLoading, errorMessage } = useSelector((state) => state.product);
    // const [search, setSearch] = useState("");

    const screens = useBreakpoint();
    const [open, setOpen] = useState(false);
    const showDrawer = () => setOpen(true);
    const onClose = () => setOpen(false);

    const menuItems = [
        { key: "1", icon: <HomeOutlined />, label: "Beranda" },
        { key: "2", icon: <UserOutlined />, label: "Profil" },
        { key: "3", icon: <SettingOutlined />, label: "Pengaturan" },
    ];

    useEffect(() => {
        dispatch(getProducts({page: 1, per_page: 8, search: ""}));
    }, [dispatch]);

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    if (errorMessage) {
        return <h1 style={{ color: "red"}}>{errorMessage}</h1>
    }

    return (
        <div>
            <Flex>
                <Layout>
                    <Header style={{ backgroundColor: "whitesmoke", display: "flex", justifyContent: "end", padding: "0" }}>
                        {!screens.md && (
                            <>  <div style={{ flex: "none"}}>
                                    <img src="/storage/img/brandLogo.png" style={{ height: "100%", objectFit: "contain"}} />
                                </div>
                                <Button
                                    type="text"
                                    icon={
                                        <MenuOutlined
                                        />
                                    }
                                    onClick={showDrawer}
                                />

                                <Drawer
                                    title="Menu"
                                    placement="left"
                                    onClose={onClose}
                                    open={open}
                                >
                                    <Menu mode="inline" items={menuItems} />
                                </Drawer>
                            </>
                        )}
                        
                        {screens.md && (
                            <>
                                <img src="/storage/img/brandLogo.png" style={{ width: "5rem", padding: "5px"}}/>
                                <Menu mode="horizontal" items={menuItems} style={{ flex: 1, borderBottom: "none"}} />
                            </>
                        )}
                    </Header>
                    <Content>
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
                    </Content>
                    <Footer>Ini Footer</Footer>
                </Layout>
            </Flex>
            <Button type="primary">Tombol coba</Button>
        </div>
    );
}
