package models

type Order struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"user_id"` // ID пользователя, который создает заказ
	Products    []Product `gorm:"foreignKey:OrderID"`
	OrderStatus bool      `json:"orderStatus"`
	AdStatus    bool      `json:"adStatus"`
	OrderSetID  *uint     `json:"orderSetId"` // Внешний ключ, связанный с OrderSet
}
