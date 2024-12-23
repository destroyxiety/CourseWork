import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Box } from '@mui/material';

const CreateOrder = () => {
  const [login, setLogin] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleCreateOrder = async () => {
    if (!login) {
      setError('Логин пользователя не может быть пустым');
      return;
    }
    setError(null);

    try {
      const response = await axios.post('http://localhost:8081/create-order', { login });
      setMessage(response.data.message); // Сообщение от сервера
      window.location.reload(); // Перезагружаем страницу после успешного создания заказа
    } catch (err) {
      setMessage('Ошибка при создании заказа');
      if (err.response) {
        setError(err.response.data.error); // Сообщение об ошибке с сервера
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Создать заказ
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="primary">{message}</Typography>}
      
      <TextField
        label="Логин пользователя"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateOrder}
        fullWidth
      >
        Создать заказ
      </Button>
    </Box>
  );
};

export default CreateOrder;
