import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getProductById } from '../services/api';

class ProductItem extends React.Component {
  constructor() {
    super();

    this.state = {
      email: '',
      avaliation: '',
      stars: '',
      allChecked: false,
      comments: [],
      inputs: [{ id: 1, status: false },
        { id: 2, status: false },
        { id: 3, status: false },
        { id: 4, status: false },
        { id: 5, status: false }],
      info: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.checkInputs = this.checkInputs.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }

  async componentDidMount() {
    const { match: { params: { id } } } = this.props;
    const product = await getProductById(id);
    this.setState({ info: product });
    const comments = JSON.parse(localStorage.getItem(id));
    if (comments !== null) {
      this.setState({
        comments,
      });
    }
  }

  handleChange({ target }) {
    const { name, value, id, type } = target;
    this.setState(
      {
        [name]: value,
      },
    );
    if (type === 'radio') {
      this.setState(({ inputs }) => ({
        inputs: inputs.map((_bool, index) => (
          {
            id: index + 1,
            status: (Number(id) === index + 1),
          }
        )),
      }));
    }
  }

  handleClick() {
    const { match: { params: { id } } } = this.props;
    const { email, stars, avaliation } = this.state;
    const object = { id, email, stars, avaliation };
    const isAllChecked = this.checkInputs();
    if (isAllChecked) {
      this.setState({
        allChecked: true,
      });
    } else {
      this.setState((prev) => ({
        allChecked: false,
        email: '',
        avaliation: '',
        inputs: [{ id: 1, status: false },
          { id: 2, status: false },
          { id: 3, status: false },
          { id: 4, status: false },
          { id: 5, status: false }],
        comments: [...prev.comments, object],
      }), () => {
        const { comments } = this.state;
        localStorage.setItem(id, JSON.stringify(comments));
      });
    }
  }

  addToCart(product) {
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
  }

  checkEmail(email) {
    return !!(email.includes('@') === true
         && email.includes('.') === true);
  }

  checkInputs() {
    const { email, stars } = this.state;
    const emailV = email.length === 0;
    const starsV = stars.length <= 0;
    const emailCheck = !(this.checkEmail(email));
    const validationLength = emailV || starsV;
    const validation = validationLength || emailCheck;
    return validation;
  }

  render() {
    const {
      info,
      email,
      avaliation,
      comments,
      allChecked,
      inputs } = this.state;
    return (
      <div>
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
        <div>
          <form>
            <h4>Avaliações</h4>
            <input
              data-testid="product-detail-email"
              type="email"
              id="email"
              name="email"
              value={ email }
              onChange={ this.handleChange }
              placeholder="Email"
            />
            {inputs.map(({ status }, index) => {
              const number = index + 1;
              return (
                <label key={ number } htmlFor={ number }>
                  {number}
                  <input
                    checked={ status }
                    type="radio"
                    data-testid={ `${number}-rating` }
                    id={ number }
                    value={ number }
                    name="stars"
                    onChange={ this.handleChange }
                  />
                </label>
              );
            })}
            <textarea
              data-testid="product-detail-evaluation"
              id="avaliation"
              name="avaliation"
              value={ avaliation }
              onChange={ this.handleChange }
              placeholder="Mensagem"
            />
            <button
              type="button"
              data-testid="submit-review-btn"
              onClick={ this.handleClick }
            >
              Avaliar
            </button>
            {allChecked && <span data-testid="error-msg">Campos inválidos</span>}
          </form>
        </div>
        <div>
          {comments.map((comment, index) => (
            <div key={ index }>
              <h4 data-testid="review-card-email">{ comment.email }</h4>
              <span data-testid="review-card-rating">{ comment.stars }</span>
              <p data-testid="review-card-evaluation">{ comment.avaliation }</p>
            </div>
          ))}
        </div>
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
