package database

import (
	"ShopAndDelivery-backend/models"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// InitDB инициализирует подключение к базе данных PostgreSQL
func InitDB() *gorm.DB {
	dsn := "host=host.docker.internal port=5432 dbname=shop user=postgres password=postgres connect_timeout=30 sslmode=prefer"

	var err error
	// Инициализация базы данных
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Не удалось подключиться к базе данных: %v", err)
	}

	log.Println("Подключение к базе данных установлено.")

	// Автоматическая миграция
	if err := DB.AutoMigrate(&models.User{}, &models.OrderSet{}, &models.Order{}, &models.Product{}); err != nil {
		log.Fatalf("Ошибка миграции базы данных: %v", err)
	}

	return DB
}
