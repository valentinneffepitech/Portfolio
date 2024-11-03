import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = (props) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/produits');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div id="panier">
      <h1 id="products_title">Nos articles</h1>
      <ul id="productList" className="flex flex-wrap justify-evenly">
        {products.map((product) => (
          <li key={product.id} className="mb-4 mx-2 w-1/4 product_list_article">
            <Link to={`/article/${product.id}`} className="flex flex-col items-center p-4 rounded-lg">
              <figure className="mb-2 article-view">
                <img
                  src={`http://localhost:8000/${product.photo_source}`}
                  alt={product.name}
                  className="mb-2 rounded"
                />
              </figure>
              <div className="text-center">
                <h3 className="text-2xl text-emerald-900 font-semibold">{product.name}</h3>
                <p className="list_product_article text-emerald-500">{parseFloat(product.price_reduct).toFixed(2)}€</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
