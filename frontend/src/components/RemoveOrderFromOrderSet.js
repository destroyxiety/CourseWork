import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const RemoveOrderFromOrderSet = () => {
  const [orderSetId, setOrderSetId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRemoveOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.put(
        `http://localhost:8081/order-sets/${orderSetId}/remove-order/${orderId}`
      );
      // Перезагрузка страницы после успешного удаления
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Не удалось удалить заказ из набора. Пожалуйста, попробуйте позже.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="flex-start">
      <Typography variant="h4" gutterBottom>
        Удалить заказ из набора заказов
      </Typography>

      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Box mt={3} width="100%" maxWidth={400}>
        <TextField
          fullWidth
          label="ID набора заказов"
          value={orderSetId}
          onChange={(e) => setOrderSetId(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="ID заказа"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          margin="normal"
        />
      </Box>

      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRemoveOrder}
          disabled={loading || !orderSetId || !orderId}
        >
          {loading ? <CircularProgress size={24} /> : 'Удалить заказ'}
        </Button>
      </Box>
    </Box>
  );
};

export default RemoveOrderFromOrderSet;
