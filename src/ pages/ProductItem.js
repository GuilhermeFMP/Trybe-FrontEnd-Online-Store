import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getProductById } from '../services/api';

class ProductItem extends React.Component {
  constructor() {
    super();

    this.state = {
      info: {},
    };
  }

  async componentDidMount() {
    const { match: { params: { id } } } = this.props;
    const product = await getProductById(id);
    this.setState({ info: product });
  }

  addToCart = (product) => {
    let cartList = JSON.parse(localStorage.getItem('cartList'));
    if (cartList === null) {
      cartList = [];
    }
    const { id, title, price, thumbnail } = product;
    const alreadySaved = cartList.some((item) => item.id === id);
    if (alreadySaved) {
      cartList.forEach((item) => { if (item.id === id) { item.amout += 1; } });
      localStorage.setItem('cartList', JSON.stringify(cartList));
    } else {
      const object = {
        id,
        title,
        price,
        thumbnail,
        amout: 1,
      };
      cartList.push(object);
      localStorage.setItem('cartList', JSON.stringify(cartList));
    }
  };

  render() {
    const { info } = this.state;
    return (
      <div>
        <h1 data-testid="product-detail-name">{info.title}</h1>
        <img
          data-testid="product-detail-image"
          src={ info.thumbnail }
          alt={ info.title }
        />
        <h2 data-testid="product-detail-price">{info.price}</h2>
        <button
          type="button"
          data-testid="product-detail-add-to-cart"
          onClick={ () => this.addToCart(info) }
        >
          Adicionar ao carrinho
        </button>
        <Link to="/cart" data-testid="shopping-cart-button"><p>Carrinho</p></Link>
      </div>
    );
  }
}

ProductItem.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default ProductItem;
