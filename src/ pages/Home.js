import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';

export default class Home extends Component {
  state = {
    searchInput: '',
    isSearched: false,
    productsList: [],
    isListValid: false,
    categories: [],
  };

  componentDidMount() {
    this.fetchCategories();
  }

  handdleInputChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    }, this.isFormFilled);
  };

  handdleButtonSearch = (searchValue) => {
    api.getProductsFromCategoryAndQuery(searchValue)
      .then((response) => {
        this.setState({ productsList: response.results });
      }, this.validatedList());
  };

  getCategory = ({ target }) => {
    const { id } = target;
    api.getCategoryById(id).then((response) => {
      this.setState({ productsList: response.results, isSearched: true });
    });
  };

  validatedList = () => {
    const { productsList } = this.state;
    const minLenght = 0;
    this.setState({
      isSearched: true,
      isListValid: (productsList.length >= minLenght),
    });
  };

  fetchCategories = async () => {
    const categories = await api.getCategories();
    this.setState({ categories });
  };

  addToCart = (product) => {
    let cartList = JSON.parse(localStorage.getItem('cartList'));
    if (cartList === null) {
      cartList = [];
    }
    const { id, title, price, thumbnail } = product;
    const alreadySaved = cartList.some((item) => item.id === id);
    if (alreadySaved === true) {
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
    const {
      productsList, categories, searchInput,
      isSearched, isListValid,
    } = this.state;
    return (
      <>
        <label htmlFor="search-input">
          <input
            type="text"
            id="search-input"
            placeholder="Digite sua busca"
            name="searchInput"
            value={ searchInput }
            onChange={ this.handdleInputChange }
            data-testid="query-input"
          />
        </label>
        <button
          type="button"
          id="seach-input-button"
          onClick={ () => this.handdleButtonSearch(searchInput) }
          data-testid="query-button"
        >
          Procurar
        </button>
        {
          productsList.length === 0
          && (
            <h3 data-testid="home-initial-message">
              Digite algum termo de pesquisa ou escolha uma categoria.
            </h3>)
        }
        <section>
          {categories.map(({ id, name }) => (
            <label key={ id } htmlFor={ id } data-testid="category">
              { name }
              <input
                type="radio"
                value={ name }
                name="categories"
                id={ id }
                onClick={ this.getCategory }
              />
            </label>
          ))}
        </section>
        <Link to="/cart" data-testid="shopping-cart-button">
          <p>Carrinho</p>
        </Link>

        <section>
          {
            isSearched
            && productsList.map((prod) => (
              <>
                <Link
                  data-testid="product-detail-link"
                  key={ prod.id }
                  to={ `/product/${prod.id}` }
                >
                  <div key={ prod.id } data-testid="product">
                    <h3>{ prod.title }</h3>
                    <img src={ prod.thumbnail } alt={ prod.title } />
                    <p>
                      R$
                      {' '}
                      { prod.price }
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={ () => this.addToCart(prod) }
                  data-testid="product-add-to-cart"
                >
                  Adicionar ao Carrinho
                </button>
              </>
            ))
          }
          {
            isListValid && <h1>Nenhum produto foi encontrado</h1>
          }
        </section>
      </>
    );
  }
}
