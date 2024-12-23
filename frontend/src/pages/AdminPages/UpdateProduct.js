import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();  // Хук для навигации
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        status: '', // Статус товара
        orderId: '', // Внешний ключ (не редактируем)
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        // Получаем данные товара по ID
        fetch(`http://localhost:8081/products/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных товара');
                }
                return response.json();
            })
            .then((data) => {
                setProductData({
                    name: data.name,
                    description: data.description,
                    status: data.status,
                    orderId: data.orderId, // Поле orderId загружаем, но не показываем
                });
            })
            .catch((error) => {
                console.error('Ошибка при получении данных товара:', error);
                setError('Не удалось загрузить товар');
            });
    }, [id]);

    // Обработка изменений в полях формы
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Обработка отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();

        // Отправка обновленных данных на сервер
        fetch(`http://localhost:8081/admin/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: productData.name,
                description: productData.description,
                status: productData.status,
                // Не передаем orderId, так как оно не должно быть изменено
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Ошибка при обновлении товара');
                }
                return response.json();
            })
            .then(() => {
                alert('Товар обновлен!');
                navigate('/admin');  // Перенаправление на страницу администрирования
            })
            .catch((error) => {
                console.error('Ошибка обновления товара:', error);
                alert('Не удалось обновить товар.');
            });
    };

    if (error) {
        return (
            <Box sx={{ padding: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: 3,
                boxShadow: 3,
                maxWidth: 600,
                margin: 'auto',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Обновить товар
            </Typography>

            <TextField
                label="Название товара"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                fullWidth
                required
            />
            <TextField
                label="Описание товара"
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                fullWidth
                required
            />
            <FormControl fullWidth margin="normal" required>
                <InputLabel>Статус</InputLabel>
                <Select
                    name="status"
                    value={productData.status}
                    onChange={handleInputChange}
                >
                    <MenuItem value="не в заказе">Не в заказе</MenuItem>
                    <MenuItem value="в заказе">В заказе</MenuItem>
                </Select>
            </FormControl>

            {/* Скрытое поле для orderId */}
            <input
                type="hidden"
                name="orderId"
                value={productData.orderId}
                onChange={handleInputChange} // Не будет изменяться
            />

            <Button variant="contained" color="primary" type="submit">
                Обновить товар
            </Button>
        </Box>
    );
};

export default UpdateProduct;
