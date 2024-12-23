package routes

import (
	"ShopAndDelivery-backend/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default())
	// Регистрация пользователей через одну ссылку
	r.POST("/register", controllers.RegisterUser) // Регистрация с указанием роли в теле запроса

	// Вход для пользователей
	r.POST("/login", controllers.LoginUser)

	r.GET("/products/:id", controllers.GetProductByID)
	r.GET("/products", controllers.GetProducts)                                                 // Получить список товаров
	r.POST("/admin/add", controllers.AddProduct)                                                // Добавить новый товар
	r.PUT("/admin/update/:id", controllers.UpdateProduct)                                       // Обновить товар
	r.DELETE("/admin/delete/:id", controllers.DeleteProduct)                                    // Удалить товар
	r.GET("/products-for-order", controllers.GetProductsForOrder)                               // Получить товары для заказа
	r.PUT("/orders/:orderId/add-product/:productId", controllers.AddProductToOrder)             // добавление товара в заказ
	r.GET("/orders", controllers.GetOrders)                                                     // Получть список заказов
	r.POST("/create-order", controllers.CreateOrder)                                            // Создание заказа
	r.PUT("/orders/remove-product/:productId", controllers.RemoveProductFromOrder)              // Удаление товара из заказа
	r.PUT("/orders/set-ready/:orderId", controllers.SetOrderReadyToAssemble)                    // Заказ готов к сборке
	r.GET("/orders-for-set", controllers.GetOrdersForSet)                                       // Получение заказов для сборки
	r.GET("/orders-set", controllers.GetOrdersSet)                                              // Получение набора заказов
	r.POST("/create-order-set", controllers.CreateOrderSet)                                     // Создание набора заказов
	r.PUT("/order-sets/:orderSetId/add-order/:orderId", controllers.AddOrderToOrderSet)         // Добавление заказа в набор
	r.PUT("/order-sets/:orderSetId/remove-order/:orderId", controllers.RemoveOrderFromOrderSet) // Удаление заказа из набора
	r.DELETE("/delete-order-set/:id", controllers.DeleteCompletedOrderSet)                      // удаление набора товаров
	r.GET("/order-sets/incomplete", controllers.GetIncompleteOrderSets)                         // Получение наборов для доставки курьером
	r.PUT("/orders/:orderId/update-status", controllers.UpdateOrderStatus)                      // Доставка курьером заказов

	return r
}
