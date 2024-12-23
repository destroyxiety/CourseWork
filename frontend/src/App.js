import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import AdminDashboard from './pages/AdminPages/AdminDashboard'; // Импорт админской панели
import UpdateProduct from './pages/AdminPages/UpdateProduct'; // Пример страницы обновления товара
import AddProduct from './pages/AdminPages/AddProduct'; // Пример страницы добавления товара
import KeeperPage from './pages/KeeperPages/KeeperPage';// Импорт страницы Кладовщика
import DispatcherPage from './pages/Dispatcher/DispatcherPage';
import CourierPage from './pages/СourierPages/CourierPage';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/admin" element={<AdminDashboard />} /> {/* Страница админки */}
                <Route path="/admin/add" element={<AddProduct />} />
                <Route path="/admin/update/:id" element={<UpdateProduct />} />
                <Route path="/keeper" element={<KeeperPage/>} /> 
                <Route path="/dispatcher" element={<DispatcherPage/>} /> 
                <Route path="/courier" element={<CourierPage/>} />
                </Routes>
        </Router>
    );
};
export default App;