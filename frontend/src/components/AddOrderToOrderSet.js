import React, { useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Typography, TextField, Button, Grid } from '@mui/material';

const AddOrderToOrderSet = () => {
  const [selectedOrderSet, setSelectedOrderSet] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddOrderToOrderSet = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8081/order-sets/${selectedOrderSet}/add-order/${selectedOrder}`
      );
      setSuccessMessage(response.data.message);
      setError(null); // Clear any previous error
      window.location.reload(); // Перезагружаем страницу после успешного создания заказа
    } catch (err) {
      setError('Не удалось добавить заказ в набор. Пожалуйста, попробуйте позже.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Добавить заказ в набор заказов</Typography>
      {error && <Typography variant="body2" color="error">{error}</Typography>}
      {successMessage && <Typography variant="body2" color="success">{successMessage}</Typography>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="ID набора заказов"
            fullWidth
            value={selectedOrderSet}
            onChange={(e) => setSelectedOrderSet(e.target.value)}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="ID заказа"
            fullWidth
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleAddOrderToOrderSet} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Добавить заказ в набор'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddOrderToOrderSet;
