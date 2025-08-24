import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CardProduct from "./CardProduct";

export default function ListProducts({ dataProduct = [] }) {
    const navigateTo = useNavigate();
    const token = localStorage.getItem("token");

    function productButton(id) {
        if (token) {
            navigateTo(`/customer/product/detail-product/${id}`);
        } else {
            navigateTo("/login");
        }
    }
    return (
        <div>
            <Row>
                {dataProduct.map((listProduct, index) => (
                    <Col key={`card-product-${index + 1}`}>
                        <CardProduct
                            products={listProduct}
                            onClickBtnCard={() => productButton(listProduct.id)}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
}
