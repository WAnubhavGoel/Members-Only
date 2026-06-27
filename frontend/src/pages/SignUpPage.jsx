import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();

  if (currentUser) {
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      const response = await axios.post("/auth/sign-up", formData);
      if (response.data.success) {
        setCurrentUser(response.data.user);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className="standard-form">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
              />
              Register as Admin
            </label>
          </div>
          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default SignUpPage;
