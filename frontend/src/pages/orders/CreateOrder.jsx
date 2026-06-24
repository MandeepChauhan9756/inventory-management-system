import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import {
  getProducts,
  getCustomers,
  createOrder,
} from "../../services/orderService";
import { toast } from "react-toastify";
import "./CreateOrder.css";

const CreateOrder = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const p = await getProducts();
      const c = await getCustomers();

      setProducts(p);
      setCustomers(c);
    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };

  // ➕ Add product to cart
  const addItem = (product) => {
    const exists = items.find((i) => i.product_id === product.id);

    if (exists) {
      setItems(
        items.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setItems([
        ...items,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  // ✏️ update quantity
  const updateQty = (id, qty) => {
    setItems(
      items.map((i) =>
        i.product_id === id ? { ...i, quantity: Number(qty) } : i,
      ),
    );
  };

  // ❌ remove item
  const removeItem = (id) => {
    setItems(items.filter((i) => i.product_id !== id));
  };

  // 🚀 place order
  const handleSubmit = async () => {
    try {
      const payload = {
        customer_id: customerId,
        items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
      };

      await createOrder(payload);

      // alert("Order created successfully!");
      toast.success("Order created successfully!");

      setItems([]);
      setCustomerId("");
    } catch (err) {
      // console.log("ORDER ERROR:", err);
      toast.error("ORDER ERROR:", err);
    }
  };

  // 💰 total
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <MainLayout>
      <div className="order-page">
        <h1 className="page-title">🛒 Create New Order</h1>

        {/* Customer */}

        <div className="customer-section">
          <label>Select Customer</label>

          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Choose Customer</option>

            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Products */}

        <div className="section-header">
          <h2>📦 Products</h2>
        </div>

        <div className="products-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <h3>{p.name}</h3>

              <p className="price">₹{p.price}</p>
              <p
                style={{
                  color: p.quantity < 10 ? "red" : "green",
                }}
              >
                Stock: {p.quantity}
              </p>

              <button className="add-btn" onClick={() => addItem(p)}>
                Add To Cart
              </button>
            </div>
          ))}
        </div>

        {/* Cart */}

        <div className="cart-section">
          <h2>🧾 Order Cart</h2>

          {items.length === 0 ? (
            <div className="empty-cart">No products added yet</div>
          ) : (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {items.map((i) => (
                  <tr key={i.product_id}>
                    <td>{i.name}</td>

                    <td>₹{i.price}</td>

                    <td>
                      <input
                        className="qty-input"
                        type="number"
                        min="1"
                        value={i.quantity}
                        onChange={(e) =>
                          updateQty(i.product_id, e.target.value)
                        }
                      />
                    </td>

                    <td>₹{i.price * i.quantity}</td>

                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(i.product_id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary */}

        <div className="summary-card">
          <h2>
            Grand Total:
            <span>₹{total}</span>
          </h2>
          <button
            className="place-order-btn"
            disabled={!customerId || items.length === 0}
            onClick={handleSubmit}
          >
            🚀 Place Order
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateOrder;
