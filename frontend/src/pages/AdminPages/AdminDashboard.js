import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8081/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Ошибка загрузки товаров:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddProduct = () => {
        navigate('/admin/add');
    };
    

    const handleUpdateProduct = (id) => {
        navigate(`/admin/update/${id}`);
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
            fetch(`http://localhost:8081/admin/delete/${id}`, {
                method: 'DELETE',
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message) {
                        alert('Товар удален!');
                        setProducts(products.filter((product) => product.id !== id));
                    }
                })
                .catch((error) => {
                    console.error('Ошибка удаления товара:', error);
                    alert('Не удалось удалить товар.');
                });
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Панель администратора
            </Typography>

            <Button variant="contained" color="primary" onClick={handleAddProduct}>
                Добавить товар
            </Button>

            {/* Поле для поиска товаров */}
            <TextField
                label="Поиск по названию"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={handleSearchChange}
            />

            <Table sx={{ marginTop: 3 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Описание</TableCell>
                        <TableCell>Статус</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>{product.status}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleUpdateProduct(product.id)}
                                    sx={{ marginRight: 1 }}
                                >
                                    Обновить
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleDeleteProduct(product.id)}
                                >
                                    Удалить
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default AdminDashboard;
