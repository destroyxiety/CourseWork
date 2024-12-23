package main

import (
	"ShopAndDelivery-backend/database"
	"ShopAndDelivery-backend/routes"
	"log"
)

func main() {
	// Инициализация базы данных
	database.InitDB()

	// Настройка маршрутов
	r := routes.SetupRouter()

	// Запуск сервера
	err := r.Run(":8081")
	if err != nil {
		log.Fatalf("Ошибка при запуске сервера: %v", err)
	}
}
