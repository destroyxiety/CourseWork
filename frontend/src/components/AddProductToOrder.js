import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, MenuItem, TextField, Grid, Typography, Box } from '@mui/material';

const AddProductToOrder = ({ onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [orderId, setOrderId] = useState(''); // Поле для указания ID заказа
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Получаем список товаров, которые не в заказах
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8081/products-for-order');
        setProducts(response.data);
      } catch (err) {
        setError('Не удалось загрузить товары');
      }
    };

    fetchProducts();
  }, []);

  const handleAddProductToOrder = async () => {
    if (!selectedProductId || !orderId) {
      setError("Пожалуйста, выберите товар и укажите ID заказа");
      return;
    }
    setError(null);
    setMessage("");
  
    try {
      const response = await axios.put(`http://localhost:8081/orders/${orderId}/add-product/${selectedProductId}`);
      console.log("Ответ сервера:", response);
      setMessage(response.data.message || "Товар успешно добавлен в заказ.");
      setProducts(products.filter((product) => product.id !== selectedProductId)); // Убираем добавленный товар
      onSuccess();
      window.location.reload(); // Перезагружаем страницу после успешного создания заказа
    } catch (err) {
      console.error("Ошибка добавления товара:", err);
      setError(err.response?.data?.error || "Произошла ошибка при добавлении товара");
      window.location.reload(); // Перезагружаем страницу после успешного создания заказа
    }
  };
  

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Добавить товар в заказ
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="primary">{message}</Typography>}

      <TextField
        label="ID заказа"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ marginBottom: 2 }}
        type="number"
      />

      <TextField
        select
        label="Выберите товар"
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ marginBottom: 2 }}
      >
        {products.map((product) => (
          <MenuItem key={product.id} value={product.id}>
            {product.name} - {product.description}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddProductToOrder}
        fullWidth
      >
        Добавить в заказ
      </Button>
    </Box>
  );
};

export default AddProductToOrder;
