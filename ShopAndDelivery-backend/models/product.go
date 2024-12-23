package models

type Product struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Status      string `json:"status"`
	OrderID     *uint  `json:"orderId"` // Внешний ключ, связанный с Order
}
