import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getProductsFromCategoryAndQuery } from '../services/api';
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

  handdleButtonSearch = () => {
    const { searchInput } = this.state;
    getProductsFromCategoryAndQuery(searchInput)
      .then((response) => {
        this.setState({ productsList: response.results, isSearched: true });
      }, this.validatedList());
  };

  validatedList = () => {
    const { productsList } = this.state;
    const minLenght = 0;
    this.setState({
      isListValid: (productsList.length >= minLenght),
    });
  };

  fetchCategories = async () => {
    const categories = await api.getCategories();
    this.setState({ categories });
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
          onClick={ this.handdleButtonSearch }
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
              <input type="radio" value={ name } name="categories" id={ id } />
            </label>
          ))}
        </section>
        <Link to="/cart" data-testid="shopping-cart-button" />

        <section>
          {
            isSearched
            && productsList.map((prod) => (
              <div key={ prod.id } data-testid="product">
                <h3>{ prod.title }</h3>
                <img src={ prod.thumbnail } alt={ prod.title } />
                <p>
                  R$
                  {' '}
                  { prod.price }
                </p>
              </div>
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
