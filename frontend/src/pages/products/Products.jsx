import MainLayout from "../../layouts/MainLayout";
import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}"); // admin / staff
  const role = user.role;

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 ADD / UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }

      setShowModal(false);
      setEditingId(null);

      setForm({
        name: "",
        sku: "",
        price: "",
        quantity: "",
      });

      await loadProducts();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 EDIT
  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
    setShowModal(true);
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <MainLayout>
      <div className="products-page">
        <div className="products-header">
          <h1>📦 Products Management</h1>

          <div className="header-actions">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            {role === "admin" && (
              <button className="add-btn" onClick={() => setShowModal(true)}>
                + Add Product
              </button>
            )}
          </div>
        </div>

        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                {role === "admin" && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>₹{p.price}</td>

                  <td>
                    <span
                      className={
                        p.quantity < 10 ? "stock-badge low" : "stock-badge good"
                      }
                    >
                      {p.quantity}
                    </span>
                  </td>

                  {role === "admin" && (
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingId ? "✏️ Update Product" : "➕ Add Product"}</h2>

            <form onSubmit={handleSubmit} className="product-form">
              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
              />

              <input
                name="sku"
                placeholder="SKU"
                value={form.sku}
                onChange={handleChange}
              />

              <input
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
              />

              <input
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
              />

              <div className="modal-buttons">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : editingId ? "Update" : "Save"}
                </button>

                <button
                  type="button"
                  className="close-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Products;
