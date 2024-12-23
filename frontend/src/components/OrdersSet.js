import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Card, CardContent, Grid, Button } from '@mui/material';

const OrdersSet = () => {
  const [orderSets, setOrderSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderSets = async () => {
      try {
        const response = await axios.get('http://localhost:8081/orders-set');
        
        // Проверка на массив
        if (Array.isArray(response.data.orderSets)) {
          setOrderSets(response.data.orderSets);
        } else {
          throw new Error('Ответ не содержит наборы заказов');
        }
      } catch (err) {
        setError('Не удалось загрузить наборы заказов. Пожалуйста, попробуйте позже.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderSets();
  }, []);

  const handleDeleteOrderSet = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8081/delete-order-set/${id}`);
      alert(response.data.message); // Показать сообщение об успешном удалении
      // Обновить список заказов
      setOrderSets(orderSets.filter(orderSet => orderSet.id !== id));
    } catch (error) {
      alert('Ошибка при удалении набора заказов');
      console.error(error);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Typography variant="h6" color="error">{error}</Typography>
    </Box>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Наборы заказов</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID набора заказов</TableCell>
              <TableCell>Статус набора</TableCell>
              <TableCell>Заказы</TableCell>
              <TableCell>Товары</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(orderSets) && orderSets.map((orderSet) => (
              <TableRow key={orderSet.id}>
                <TableCell>{orderSet.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" color={orderSet.status === 'Завершен' ? 'green' : 'orange'}>
                    {orderSet.status || 'Не завершен'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {orderSet.orders && orderSet.orders.length > 0 ? (
                    <Grid container spacing={2}>
                      {orderSet.orders.map((order) => (
                        <Grid item xs={12} sm={6} md={4} key={order.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Заказ ID: {order.id}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Статус: {order.adStatus ? 'Доставлен' : 'Не доставлен'}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="textSecondary">Нет заказов в наборе</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {orderSet.orders && orderSet.orders.length > 0 ? (
                    <Grid container spacing={2}>
                      {orderSet.orders.map((order) => (
                        <Grid item xs={12} sm={6} md={4} key={order.id}>
                          {order.Products && order.Products.length > 0 ? (
                            order.Products.map((product) => (
                              <Card variant="outlined" key={product.id}>
                                <CardContent>
                                  <Typography variant="h6" gutterBottom>
                                    {product.name}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    Описание: {product.description}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    Статус: {product.status}
                                  </Typography>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <Typography variant="body2" color="textSecondary">Нет товаров в заказе</Typography>
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="textSecondary">Нет товаров в наборе заказов</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {orderSet.status === 'Завершен' && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteOrderSet(orderSet.id)}
                    >
                      Удалить набор
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdersSet;
