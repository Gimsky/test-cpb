import React, { useEffect, useState } from "react";
import CanvasImg from "./shared/CanvasImg/CanvasImg";
import { Loader } from "./shared/Loader/Loader";
import styles from "./App.module.css";

function App() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Products</h1>
      {products ? (
        <div className={styles.products}>
          {products.map((product) => (
            <div key={product.id} className={styles.product}>
              <CanvasImg imageUrl={product.imageSrc} />
              <div className={styles.product__content}>
                <div
                  className={styles.product__body}
                  dangerouslySetInnerHTML={{ __html: product.bodyHtml }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default App;
