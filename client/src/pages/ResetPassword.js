import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/RegisterPage.css";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/users/reset-password", {
        token,
        password: values.password,
      });
      setLoading(false);
      message.success(data.message || "Password reset successful");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="register-page">
      {loading && <Spinner />}
      <Form
        className="register-form"
        layout="vertical"
        onFinish={submitHandler}
      >
        <h2>Reset Password</h2>
        <p
          style={{ textAlign: "center", color: "#64748b", marginBottom: 18 }}
        >
          Enter your new password below.
        </p>
        <Form.Item
          label="New Password"
          name="password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input type="password" />
        </Form.Item>
        <div className="d-flex justify-content-between">
          <Link to="/login">Back to login</Link>
          <button className="btn">Reset Password</button>
        </div>
      </Form>
    </div>
  );
};

export default ResetPassword;
