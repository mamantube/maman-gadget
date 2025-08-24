import { Card, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { IDRCurrency } from "../utils/currencyFormat.js";

export default function CardProduct(props) {
    const { products = {} } = props;

    return(
        <div>
            <Card>
                <Card.Img variant="top" src={products.image} />
                <Card.Body>
                    <Card.Title>{products.product_name}</Card.Title>
                    <Card.Text>{IDRCurrency(products.price)}</Card.Text>

                    <NavLink to={`/product/detail-product/${products.id}`}>
                        <Button>Detail Produk</Button>
                    </NavLink>
                </Card.Body>
            </Card>
        </div>
    )
}