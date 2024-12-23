import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Функция для получения товаров с сервера
    const fetchProducts = async () => {
      const baseUrl = "http://localhost:8081"; // Замените на актуальный URL вашего бэкенда
      try {
        const response = await axios.get(`${baseUrl}/products-for-order`); // Запрос на сервер
        setProducts(response.data); // Сохраняем полученные данные в state
      } catch (err) {
        setError('Не удалось получить список товаров для заказа'); // Если ошибка - показываем сообщение
      }
    };

    fetchProducts(); // Вызов функции при монтировании компонента
  }, []);

  if (error) {
    return <div>{error}</div>; // Показываем сообщение об ошибке, если оно есть
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Список товаров для заказа
      </Typography>
      <Grid container spacing={2}>
        {products.length > 0 ? (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  {/* Добавляем отображение ID товара */}
                  <Typography variant="body2" color="text.secondary">
                    ID товара: {product.id}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1">Нет товаров для заказа</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProductList;
