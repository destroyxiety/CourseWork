package models

type OrderSet struct {
	ID     uint    `json:"id" gorm:"primaryKey"`
	UserID uint    `json:"user_id"`                             // ID пользователя, который создает набор заказов
	Orders []Order `json:"orders" gorm:"foreignKey:OrderSetID"` // Список заказов в наборе
	Status string  `json:"status"`
}
