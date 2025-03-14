"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ✅ Import useRouter
import Link from "next/link";
import { toast } from "react-toastify";
import logo from "@/assets/logo.png";
import "../auth.css";

interface FormData {
  email: string;
  password: string;
}

const Signin = () => {
  const router = useRouter(); // ✅ Use Next.js router for navigation
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Client-side validation
    const validationErrors: Record<string, string> = {};
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.password) validationErrors.password = "Password is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const response = await res.json();

      if (res.ok) {
        toast.success(response.message, { autoClose: 2000 });

        // ✅ Use router.push instead of window.location.href
        router.push("/");
      } else {
        toast.error(response.message, { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Login failed. Please try again.", { autoClose: 2000 });
    }
  };

  return (
    <div className="authout">
      <div className="authin">
        <div className="left">
          <Image src={logo} alt="Logo" className="img" />
        </div>
        <div className="right">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            <div className="forminput_cont">
              <label>Email</label>
              <input
                type="text"
                placeholder="Enter Your Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="formerror">{errors.email}</span>}
            </div>
            <div className="forminput_cont">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Your Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="formerror">{errors.password}</span>}
            </div>

            <button type="submit" className="main_button">
              Login
            </button>

            <p className="authlink">
              Don&apos;t have an account? <Link href="/auth/signup">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
