export async function getCategories() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/categories');
  const categories = await response.json();
  return categories;
}

export async function getProductsFromCategoryAndQuery(QUERY) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const products = await response.json();
  return products;
}

export async function getProductById(productId) {
  const url = `https://api.mercadolibre.com/items/${productId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
