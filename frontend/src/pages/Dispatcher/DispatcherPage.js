import AddOrderToOrderSet from "../../components/AddOrderToOrderSet";
import CreateOrderSet from "../../components/CreateOrderSet";
import OrdersForSet from "../../components/OrdersForSet";
import OrdersSet from "../../components/OrdersSet";
import RemoveOrderFromOrderSet from "../../components/RemoveOrderFromOrderSet";

const DispatcherPage = () => {
  
    return (  
      <div>
      <h1>Страница Диспетчера</h1>
      <OrdersForSet/>
      <OrdersSet/>
      <CreateOrderSet/>
      <AddOrderToOrderSet/>
      <RemoveOrderFromOrderSet/>
      </div>
    );
  };
  
  export default DispatcherPage;
  