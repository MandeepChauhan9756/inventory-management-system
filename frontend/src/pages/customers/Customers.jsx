import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { toast } from "react-toastify";
import "./Customers.css";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../services/customerService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState(null);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.full_name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()),
  );

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, form);
      } else {
        await createCustomer(form);
      }

      setForm({
        full_name: "",
        email: "",
        phone: "",
      });

      setEditingCustomer(null);
      setShowModal(false);

      loadCustomers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);

    setForm({
      full_name: customer.full_name,
      email: customer.email,
      phone: customer.phone,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      await deleteCustomer(id);

      setCustomers(customers.filter((c) => c.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <div className="customers-page">
        <div className="customers-header">
          <h1>👥 Customer Management</h1>

          <div className="header-actions">
            <input
              type="text"
              placeholder="🔍 Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <button
              className="add-btn"
              onClick={() => {
                setEditingCustomer(null);

                setForm({
                  full_name: "",
                  email: "",
                  phone: "",
                });

                setShowModal(true);
              }}
            >
              + Add Customer
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>

                  <td>
                    <div className="customer-name">👤 {customer.full_name}</div>
                  </td>

                  <td>{customer.email}</td>

                  <td>{customer.phone}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </button>
                  </td>
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
            <h2>
              {editingCustomer ? "✏️ Update Customer" : "➕ Add Customer"}
            </h2>

            <form className="customer-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={form.full_name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {editingCustomer ? "Update" : "Save"}
                </button>

                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowModal(false)}
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

export default Customers;
