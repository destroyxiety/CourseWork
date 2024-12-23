import React from 'react';
import ProductList from '../../components/ProductList'; // Импортируем компонент
import OrderList from '../../components/OrderList';
import CreateOrder from '../../components/CreateOrder';
import AddProductToOrder from '../../components/AddProductToOrder';

const KeeperPage = () => {
  
  return (  
    <div>
    <h1>Страница Кладовщика</h1>
    <ProductList/>
    <OrderList />
    <CreateOrder/> 
    <AddProductToOrder/>
    </div>
  );
};

export default KeeperPage;
