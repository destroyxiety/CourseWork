package controllers

import (
	"ShopAndDelivery-backend/database"
	"ShopAndDelivery-backend/models"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetOrders(c *gin.Context) {
	var orders []models.Order
	// Загружаем все заказы и связанные с ними товары
	if err := database.DB.Preload("Products").Find(&orders).Error; err != nil {
		fmt.Println("Error fetching orders:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Обработка товаров в заказах
	for i, order := range orders {
		var updatedProducts []models.Product
		// Перебираем товары и удаляем из заказа те, у которых статус "Не в заказе"
		for _, product := range order.Products {
			if product.Status != "не в заказе" {
				updatedProducts = append(updatedProducts, product)
			} else {
				// Если товар не в заказе, обновляем его OrderID на nil
				product.OrderID = nil
				// Обновляем товар в базе данных
				if err := database.DB.Save(&product).Error; err != nil {
					fmt.Println("Error updating product:", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
			}
		}
		// Обновляем список продуктов в заказе
		orders[i].Products = updatedProducts
	}

	// Отправляем отфильтрованные заказы
	c.JSON(http.StatusOK, orders)
}

// Получить список товаров для заказа
func GetProductsForOrder(c *gin.Context) {
	var products []models.Product
	// Получаем товары, которые еще не в заказе (которые были помечены как "не в заказе")
	if err := database.DB.Where("status = ?", "не в заказе").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось получить список товаров для заказа"})
		return
	}

	// Возвращаем список товаров
	c.JSON(http.StatusOK, products)
}

// Создание заказ
func CreateOrder(c *gin.Context) {
	var request struct {
		Login string `json:"login"` // Логин пользователя
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат данных"})
		return
	}

	// Находим пользователя по логину
	var user models.User
	if err := database.DB.Where("login = ?", request.Login).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
		return
	}

	// Проверка роли пользователя (только кладовщик могут создавать заказ)
	if strings.ToLower(user.Role) != "кладовщик" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Недостаточно прав для создания заказа"})
		return
	}

	// Создаем заказ
	order := models.Order{
		UserID: user.ID,
	}
	if err := database.DB.Create(&order).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании заказа"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Заказ создан", "order": order})
}

// AddProductToOrder добавляет товар в заказ и меняет его статус
func AddProductToOrder(c *gin.Context) {
	// Извлекаем ID заказа и ID товара из параметров запроса
	orderID := c.Param("orderId")
	productID := c.Param("productId")

	// Ищем товар по ID
	var product models.Product
	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Товар не найден"})
		return
	}

	// Ищем заказ по ID
	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Заказ не найден"})
		return
	}

	// Проверяем, не завершен ли заказ (orderStatus == true)
	if order.OrderStatus {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Невозможно добавить товар в завершенный заказ"})
		return
	}

	// Проверяем, не находится ли товар уже в заказе
	if product.OrderID != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Товар уже добавлен в заказ"})
		return
	}

	// Обновляем OrderID товара и статус
	orderIDUint, err := parseUint(orderID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный ID заказа"})
		return
	}

	product.OrderID = &orderIDUint
	product.Status = "в заказе"

	// Сохраняем изменения товара
	if err := database.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось обновить товар"})
		return
	}

	// Отправляем успешный ответ
	c.JSON(http.StatusOK, gin.H{
		"message": "Товар добавлен в заказ",
		"product": product,
	})
}

// parseUint преобразует строку в uint
func parseUint(value string) (uint, error) {
	parsedValue, err := strconv.ParseUint(value, 10, 32)
	if err != nil {
		return 0, err
	}
	return uint(parsedValue), nil
}

// Удаляет товар из заказа и меняет его статус
func RemoveProductFromOrder(c *gin.Context) {
	// Извлекаем ID товара из параметров запроса
	productID := c.Param("productId")

	// Ищем товар по ID
	var product models.Product
	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Товар не найден"})
		return
	}

	// Проверяем, находится ли товар в заказе
	if product.OrderID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Товар не находится в заказе"})
		return
	}

	// Удаляем связь с заказом и меняем статус товара
	product.OrderID = nil
	product.Status = "не в заказе"

	// Сохраняем изменения товара
	if err := database.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось обновить товар"})
		return
	}

	// Отправляем успешный ответ
	c.JSON(http.StatusOK, gin.H{
		"message": "Товар удален из заказа",
		"product": product,
	})
}

// Смена статуса заказа на готов к сборке
func SetOrderReadyToAssemble(c *gin.Context) {
	// Извлекаем ID заказа из параметров запроса
	orderID := c.Param("orderId")

	// Ищем заказ по ID
	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Заказ не найден"})
		return
	}

	// Проверяем, есть ли товары в заказе
	var products []models.Product
	if err := database.DB.Where("order_id = ?", order.ID).Find(&products).Error; err != nil || len(products) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "В заказе нет товаров, он не может быть помечен как готовый к сборке"})
		return
	}

	// Устанавливаем статус заказа на "готов к сборке"
	order.OrderStatus = true

	// Сохраняем изменения
	if err := database.DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось обновить статус заказа"})
		return
	}

	// Отправляем успешный ответ
	c.JSON(http.StatusOK, gin.H{
		"message": "Заказ готов к сборке",
		"order":   order,
	})
}
