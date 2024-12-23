package controllers

import (
	"ShopAndDelivery-backend/database"
	"ShopAndDelivery-backend/models"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetOrdersForSet(c *gin.Context) {
	var orders []models.Order
	// Получаем товары, которые еще не в заказе (которые были помечены как "не в заказе")
	if err := database.DB.Preload("Products").Where("order_status = ?", true).Find(&orders).Error; err != nil {
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

// Создание заказ
func CreateOrderSet(c *gin.Context) {
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
	if strings.ToLower(user.Role) != "диспетчер" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Недостаточно прав для создания набора заказов"})
		return
	}

	// Создаем заказ
	orderSet := models.OrderSet{
		UserID: user.ID,
	}
	if err := database.DB.Create(&orderSet).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании набора заказов"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Набор заказ создан", "order": orderSet})
}

func GetOrdersSet(c *gin.Context) {
	var orderSets []models.OrderSet

	// Загружаем все наборы заказов и связанные с ними заказы
	if err := database.DB.Preload("Orders.Products").Find(&orderSets).Error; err != nil {
		fmt.Println("Error fetching order sets:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	for _, orderSet := range orderSets {
		// Проверяем, все ли заказы в наборе имеют AdStatus = true
		allDelivered := true
		for _, order := range orderSet.Orders {
			if !order.AdStatus {
				allDelivered = false
				break
			}
		}

		if allDelivered {
			// Если все заказы доставлены, обрабатываем их
			for _, order := range orderSet.Orders {
				// Обновляем статус продуктов: "не в заказе" и OrderID = nil
				if err := database.DB.Model(&models.Product{}).Where("order_id = ?", order.ID).
					Update("order_id", nil).Error; err != nil {
					fmt.Println("Error updating product order ID:", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка обновления продуктов"})
					return
				}

				// Удаляем заказ
				if err := database.DB.Delete(&order).Error; err != nil {
					fmt.Println("Error deleting order:", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка удаления заказа"})
					return
				}
			}

			// Обновляем статус набора заказов, чтобы не удалять его сразу
			orderSet.Status = "Завершен" // Обновляем статус набора заказов
			if err := database.DB.Save(&orderSet).Error; err != nil {
				fmt.Println("Error updating order set status:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка обновления статуса набора заказов"})
				return
			}
		}
	}

	// Возвращаем обновленный список наборов заказов
	var updatedOrderSets []models.OrderSet
	if err := database.DB.Preload("Orders.Products").Find(&updatedOrderSets).Error; err != nil {
		fmt.Println("Error fetching updated order sets:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"orderSets": updatedOrderSets})
}

// AddOrderToOrderSet добавляет заказ в набор заказов
func AddOrderToOrderSet(c *gin.Context) {
	orderID := c.Param("orderId")       // Получаем ID заказа из параметров запроса
	orderSetID := c.Param("orderSetId") // Получаем ID набора заказов из параметров запроса

	// Проверяем, существует ли набор заказов
	var orderSet models.OrderSet
	if err := database.DB.First(&orderSet, orderSetID).Error; err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Набор заказов не найден"})
		return
	}

	// Проверяем, существует ли заказ
	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Заказ не найден"})
		return
	}

	// Проверяем, не принадлежит ли заказ другому набору заказов
	if order.OrderSetID != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Заказ уже принадлежит другому набору заказов"})
		return
	}

	// Добавляем заказ в набор заказов
	order.OrderSetID = &orderSet.ID
	if err := database.DB.Save(&order).Error; err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось добавить заказ в набор заказов"})
		return
	}

	// Обновляем статус набора на "Не завершен"
	orderSet.Status = "Не завершен"
	if err := database.DB.Save(&orderSet).Error; err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось обновить статус набора заказов"})
		return
	}

	// Отправляем успешный ответ
	c.JSON(http.StatusOK, gin.H{
		"message":  "Заказ успешно добавлен в набор заказов, статус набора обновлен на 'Не завершен'",
		"order":    order,
		"orderSet": orderSet,
	})
}

// RemoveOrderFromOrderSet удаляет заказ из набора заказов
func RemoveOrderFromOrderSet(c *gin.Context) {
	orderID := c.Param("orderId")       // Получаем ID заказа из параметров запроса
	orderSetID := c.Param("orderSetId") // Получаем ID набора заказов из параметров запроса

	// Проверяем, существует ли набор заказов
	var orderSet models.OrderSet
	if err := database.DB.First(&orderSet, orderSetID).Error; err != nil {
		fmt.Println("Ошибка при поиске набора заказов:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Набор заказов не найден"})
		return
	}

	// Проверяем, существует ли заказ
	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		fmt.Println("Ошибка при поиске заказа:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Заказ не найден"})
		return
	}

	// Проверяем, принадлежит ли заказ указанному набору заказов
	if order.OrderSetID == nil || *order.OrderSetID != orderSet.ID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Заказ не принадлежит указанному набору заказов"})
		return
	}

	// Удаляем связь между заказом и набором заказов
	order.OrderSetID = nil
	if err := database.DB.Save(&order).Error; err != nil {
		fmt.Println("Ошибка при удалении связи заказа с набором:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось удалить заказ из набора заказов"})
		return
	}

	// Проверяем количество оставшихся заказов в наборе
	var remainingOrdersCount int64
	if err := database.DB.Model(&models.Order{}).Where("order_set_id = ?", orderSetID).Count(&remainingOrdersCount).Error; err != nil {
		fmt.Println("Ошибка при подсчете оставшихся заказов в наборе:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось проверить оставшиеся заказы"})
		return
	}

	// Если больше нет заказов в наборе, обновляем статус набора
	if remainingOrdersCount == 0 {
		orderSet.Status = "Завершен"
		if err := database.DB.Save(&orderSet).Error; err != nil {
			fmt.Println("Ошибка при обновлении статуса набора:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось обновить статус набора заказов"})
			return
		}
	}

	// Отправляем успешный ответ
	c.JSON(http.StatusOK, gin.H{
		"message":         "Заказ успешно удален из набора заказов",
		"order":           order,
		"remainingOrders": remainingOrdersCount,
		"orderSetStatus":  orderSet.Status,
	})
}

func DeleteCompletedOrderSet(c *gin.Context) {
	var orderSet models.OrderSet

	// Получаем ID набора заказов из параметров запроса
	orderSetID := c.Param("id")

	// Находим набор заказов по ID
	if err := database.DB.Preload("Orders").Where("id = ?", orderSetID).First(&orderSet).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Набор заказов не найден"})
		return
	}

	// Проверяем, что все заказы в наборе имеют статус "Доставлен"
	allDelivered := true
	for _, order := range orderSet.Orders {
		if !order.AdStatus { // Если хотя бы один заказ не доставлен
			allDelivered = false
			break
		}
	}

	if !allDelivered {
		c.JSON(http.StatusForbidden, gin.H{"error": "Невозможно удалить набор, пока все заказы не доставлены"})
		return
	}

	// Если все заказы доставлены, обновляем статус товаров и удаляем заказы
	for _, order := range orderSet.Orders {
		// Изменяем статус продуктов на "не в заказе"
		if err := database.DB.Model(&models.Product{}).Where("order_id = ?", order.ID).
			Updates(map[string]interface{}{
				"order_id": nil,
				"status":   "не в заказе",
			}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка обновления продуктов"})
			return
		}

		// Удаляем заказы
		if err := database.DB.Delete(&order).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка удаления заказа"})
			return
		}
	}

	// Удаляем сам набор заказов
	if err := database.DB.Delete(&orderSet).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка удаления набора заказов"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Набор заказов удален"})
}
