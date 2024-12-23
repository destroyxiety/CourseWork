import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import axios from 'axios';

const CourierPage= () => {
  const [orderSets, setOrderSets] = useState([]);
  const [selectedOrderSet, setSelectedOrderSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncompleteOrderSets = async () => {
      try {
        const response = await axios.get('http://localhost:8081/order-sets/incomplete');
        setOrderSets(response.data.orderSets);
      } catch (err) {
        setError(
          err.response?.data?.error || 'Не удалось загрузить наборы заказов. Пожалуйста, попробуйте позже.'
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncompleteOrderSets();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:8081/orders/${orderId}/update-status`);
      setSelectedOrderSet((prev) => ({
        ...prev,
        orders: prev.orders.map((order) =>
          order.id === orderId ? { ...order, adStatus: true } : order
        ),
      }));
    } catch (err) {
      console.error('Ошибка при обновлении статуса заказа:', err);
      alert('Не удалось обновить статус заказа.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Курьер: Доступные наборы заказов
      </Typography>
      {selectedOrderSet ? (
        <Box>
          <Button variant="contained" onClick={() => setSelectedOrderSet(null)}>
            Назад к наборам
          </Button>
          <Typography variant="h5" gutterBottom>
            Набор ID: {selectedOrderSet.id}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID заказа</TableCell>
                  <TableCell>Статус доставки</TableCell>
                  <TableCell>Действие</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedOrderSet.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.adStatus ? 'Доставлен' : 'Не доставлен'}</TableCell>
                    <TableCell>
                      {!order.adStatus && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleCompleteOrder(order.id)}
                        >
                          Пометить как доставленный
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID набора</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действие</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderSets.map((orderSet) => (
                <TableRow key={orderSet.id}>
                  <TableCell>{orderSet.id}</TableCell>
                  <TableCell>{orderSet.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => setSelectedOrderSet(orderSet)}>
                      Просмотреть заказы
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CourierPage;
