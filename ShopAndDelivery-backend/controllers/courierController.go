package controllers

import (
	"ShopAndDelivery-backend/database"
	"ShopAndDelivery-backend/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetIncompleteOrderSets(c *gin.Context) {
	var orderSets []models.OrderSet
	if err := database.DB.Preload("Orders").Where("status = ?", "Не завершен").Find(&orderSets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось загрузить наборы заказов"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"orderSets": orderSets})
}
func UpdateOrderStatus(c *gin.Context) {
	orderID := c.Param("orderId")

	// Получаем заказ по ID
	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Заказ не найден"})
		return
	}

	// Обновляем статус доставки заказа
	order.AdStatus = true
	if err := database.DB.Save(&order).Error; err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось обновить статус заказа"})
		return
	}

	// Проверяем, все ли заказы в наборе доставлены
	var remainingOrders int64
	if err := database.DB.Model(&models.Order{}).
		Where("order_set_id = ? AND ad_status = ?", order.OrderSetID, false).
		Count(&remainingOrders).Error; err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось проверить статус набора заказов"})
		return
	}

	// Если все заказы доставлены, обновляем статус набора
	if remainingOrders == 0 && order.OrderSetID != nil {
		var orderSet models.OrderSet
		if err := database.DB.First(&orderSet, *order.OrderSetID).Error; err != nil {
			fmt.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось найти набор заказов"})
			return
		}

		orderSet.Status = "Завершен"
		if err := database.DB.Save(&orderSet).Error; err != nil {
			fmt.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось обновить статус набора заказов"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Статус заказа обновлен",
		"order":   order,
	})
}
