import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/RegisterPage.css";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/v1/users/forgot-password",
        values
      );
      setLoading(false);
      setSent(true);
      message.success(data.message || "Reset link sent");
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
        <h2>Forgot Password</h2>
        {sent ? (
          <>
            <p style={{ textAlign: "center", color: "#475569" }}>
              If an account exists for that email, a reset link is on its way.
              Check your inbox (and spam folder).
            </p>
            <div
              className="d-flex justify-content-center"
              style={{ marginTop: 16 }}
            >
              <Link to="/login">Back to login</Link>
            </div>
          </>
        ) : (
          <>
            <p
              style={{
                textAlign: "center",
                color: "#64748b",
                marginBottom: 18,
              }}
            >
              Enter your email and we'll send you a link to reset your password.
            </p>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input type="email" />
            </Form.Item>
            <div className="d-flex justify-content-between">
              <Link to="/login">Back to login</Link>
              <button className="btn">Send reset link</button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default ForgotPassword;
