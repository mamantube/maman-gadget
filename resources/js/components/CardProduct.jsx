import { Card, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { IDRCurrency } from "../utils/currencyFormat.js";

export default function CardProduct(props) {
    const { products = {} } = props;
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role")

    let detailLink = `/product/detail-product/${products.id}`

    if (token && role === "user") {
        detailLink = `/customer/product/detail-product/${products.id}`
    } else if (token && role === "admin") {
        detailLink = `/admin/product/detail-product/${products.id}`
    }

    return(
        <div>
            <Card>
                <Card.Img variant="top" src={products.image} />
                <Card.Body>
                    <Card.Title>{products.product_name}</Card.Title>
                    <Card.Text>{IDRCurrency(products.price)}</Card.Text>

                    <NavLink to={detailLink}>
                        <Button>Detail Produk</Button>
                    </NavLink>
                </Card.Body>
            </Card>
        </div>
    )
}