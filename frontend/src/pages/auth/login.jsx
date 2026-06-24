import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-header">
          <h1>Inventory Pro</h1>
          <p>Welcome Back 👋</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          <button className="login-btn" type="submit">
            Sign In
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;