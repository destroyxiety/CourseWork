import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';

const CreateOrderSet = () => {
  const [login, setLogin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateOrderSet = async () => {
    if (!login) {
      setError('Пожалуйста, введите логин');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8081/create-order-set', { login });
      setMessage(response.data.message);
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Произошла ошибка при создании набора заказов');
      } else {
        setError('Произошла ошибка при создании набора заказов');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Создание набора заказов</Typography>

      <TextField
        label="Логин пользователя"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        fullWidth
        variant="outlined"
        margin="normal"
      />

      {loading && <CircularProgress />}

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleCreateOrderSet} disabled={loading}>
          Создать набор заказов
        </Button>
      </Box>
    </Box>
  );
};

export default CreateOrderSet;
