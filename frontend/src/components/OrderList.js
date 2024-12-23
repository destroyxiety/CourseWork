import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Card, CardContent, Grid, Button } from "@mui/material";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false); // Добавляем состояние для удаления

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8081/orders");
        setOrders(response.data);
      } catch (err) {
        setError("Не удалось загрузить заказы. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Функция для удаления товара из заказа
  const removeProductFromOrder = async (productId, orderId) => {
    setDeleting(true); // Устанавливаем флаг загрузки при удалении товара

    try {
      const response = await axios.put(`http://localhost:8081/orders/remove-product/${productId}`);
      alert(response.data.message); // Показываем сообщение об успешном удалении
      window.location.reload(); // Перезагружаем страницу после успешного создания заказа
      // Обновляем список заказов после удаления товара
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                Products: order.Products.filter((product) => product.id !== productId), // Убираем удаленный товар
              }
            : order
        )
      );
    } catch (err) {
      alert("Не удалось удалить товар из заказа");
    } finally {
      setDeleting(false); // Сбрасываем флаг загрузки после завершения операции
    }
  };

  // Функция для смены статуса заказа на "готов к сборке"
  const setOrderReadyToAssemble = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:8081/orders/set-ready/${orderId}`);
      alert(response.data.message); // Показываем сообщение об успешном изменении статуса
      window.location.reload(); // Перезагружаем страницу после успешного создания заказа
      // Обновляем статус заказа в UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, orderStatus: true } // Меняем статус на "готов к сборке"
            : order
        )
      );
    } catch (err) {
      alert("Не удалось обновить статус заказа");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Список заказов
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID заказа</TableCell>
              <TableCell>Товары</TableCell>
              <TableCell>Статус заказа</TableCell>
              <TableCell>Действия</TableCell> {/* Новая колонка для действий */}
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
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => removeProductFromOrder(product.id, order.id)}
                                sx={{ marginTop: 1 }}
                              >
                                Удалить товар
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    "Нет товаров"
                  )}
                </TableCell>
                <TableCell>{order.orderStatus ? "Готов к сборке" : "Не готов к сборке"}</TableCell>
                <TableCell>
                  {/* Кнопка для смены статуса заказа */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOrderReadyToAssemble(order.id)}
                    disabled={order.orderStatus} // Отключаем кнопку, если заказ уже готов к сборке
                  >
                    Сделать готовым
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdersList;
