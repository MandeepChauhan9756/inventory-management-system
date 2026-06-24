import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getOrders, deleteOrder } from "../../services/orderService";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm (
                "Delete this order?"
            )
        )
            return;

        try {

            await deleteOrder(id);

            setOrders(
                orders.filter(
                    (o) => o.id !== id
                )
            );
        } catch (err) {
            console.log(err);
        }
    };

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <MainLayout>
            <h1>Orders</h1>

            <table border="1" width="100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>

                            <td>
                                {order.customer_name}
                            </td>

                            <td>
                                ₹{order.total_amount}
                            </td>

                            <td>
                                <button
                                    onClick={() =>
                                        setSelectedOrder(order)
                                    }
                                >
                                    View
                                </button>

                                {" "}

                                {user?.role === "admin" && (
                                    <button
                                        onClick={() =>
                                            handleDelete(order.id)
                                        }
                                        >
                                            Delete
                                        </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedOrder && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Order Details</h2>

                        <p>
                            <b>Customer:</b>{" "}
                            {selectedOrder.customer_name}
                        </p>

                        <p>
                            <b>Total:</b> ₹
                            {selectedOrder.total_amount}
                        </p>

                        <h3>Items</h3>

                        {selectedOrder.items.map(
                            (item, index) => (
                                <div key={index}>
                                    {item.product_name}

                                    {" - "}

                                    Qty: {item.quantity}

                                    {" × ₹"}

                                    {item.price}
                                </div>
                            )
                        )}

                        <br />

                        <button
                            onClick={() =>
                                setSelectedOrder(null)
                            }
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Orders;