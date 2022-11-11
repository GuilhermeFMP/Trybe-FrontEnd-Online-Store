import React from 'react';

export default class Cart extends React.Component {
  state = {
    cartList: [],
    isEmpty: true,
  };

  componentDidMount() {
    const cartList = JSON.parse(localStorage.getItem('cartList'));
    this.setState({ cartList });
    if (cartList !== null) {
      this.setState({ isEmpty: false });
    }
  }

  render() {
    const { cartList, isEmpty } = this.state;
    return (
      <div>
        {
          isEmpty ? (
            <h2 data-testid="shopping-cart-empty-message">Seu carrinho está vazio</h2>
          ) : (
            <ul>
              {cartList.map(({ id, title, price, thumbnail, amout }) => (
                <li key={ id }>
                  <h3 data-testid="shopping-cart-product-name">{title}</h3>
                  <img src={ thumbnail } alt={ title } />
                  <p>{price}</p>
                  <p data-testid="shopping-cart-product-quantity">{amout}</p>
                </li>
              ))}
            </ul>
          )
        }
      </div>
    );
  }
}
