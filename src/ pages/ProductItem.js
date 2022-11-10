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
        <Link to="/cart" data-testid="shopping-cart-button">Carrinho</Link>
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
