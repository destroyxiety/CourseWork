import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Card, CardContent, Grid } from '@mui/material';

const OrdersForSet = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrdersForSet = async () => {
      try {
        const response = await axios.get('http://localhost:8081/orders-for-set');
        setOrders(response.data);
      } catch (err) {
        setError('Не удалось загрузить заказы. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersForSet();
  }, []);

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
      <Typography variant="h4" gutterBottom>Заказы для сборки</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID заказа</TableCell>
              <TableCell>Товары</TableCell>
              <TableCell>Статус заказа</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {order.Products && order.Products.length > 0 ? (
                    <Grid container spacing={2}>
                      {order.Products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                {product.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                <strong>Описание:</strong> {product.description}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                <strong>Статус:</strong> {product.status}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="textSecondary">Нет товаров в заказе</Typography>
                  )}
                </TableCell>
                <TableCell>{order.orderStatus ? 'Готов к сборке' : 'Не готов к сборке'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdersForSet;
