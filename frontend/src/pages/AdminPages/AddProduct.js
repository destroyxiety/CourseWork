import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Card, CardContent, Divider } from '@mui/material';

const AddProduct = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        status: 'не в заказе', // Фиксированный статус
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:8081/admin/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Ошибка при добавлении товара');
                }
                return response.json();
            })
            .then(() => {
                alert('Товар успешно добавлен!');
                navigate('/admin');
            })
            .catch((error) => {
                console.error('Ошибка добавления товара:', error);
                alert('Не удалось добавить товар.');
            });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Card sx={{ maxWidth: 600, width: '100%', boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Добавить товар
                    </Typography>
                    <Divider sx={{ marginBottom: 3 }} />

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Название товара"
                            name="name"
                            value={productData.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            variant="outlined"
                            helperText="Введите название нового товара"
                        />

                        <TextField
                            label="Описание"
                            name="description"
                            value={productData.description}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            variant="outlined"
                            multiline
                            rows={3}
                            helperText="Введите краткое описание товара"
                        />

                        <Box
                            sx={{
                                backgroundColor: '#e3f2fd',
                                padding: 2,
                                borderRadius: 1,
                                textAlign: 'center',
                                marginTop: 1,
                            }}
                        >
                            <Typography variant="subtitle1" color="primary">
                                Статус товара: <strong>{productData.status}</strong>
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Этот статус установлен автоматически
                            </Typography>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                marginTop: 2,
                                padding: 1.5,
                                fontSize: '1rem',
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                },
                            }}
                        >
                            Добавить товар
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AddProduct;
