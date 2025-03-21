"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import logo from "@/assets/logo.png";
import "../auth.css";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
}

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setErrors({});

  // ✅ Client-side validation
  const validationErrors: Record<string, string> = {};
  if (!formData.name) validationErrors.name = "Name is required";
  if (!formData.email) validationErrors.email = "Email is required";
  if (!formData.password) validationErrors.password = "Password is required";
  if (!formData.city) validationErrors.city = "City is required";
  if (formData.password !== formData.confirmPassword) {
    validationErrors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
  const { confirmPassword, ...payload } = formData; // ✅ Correctly destructure

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), // ✅ Only send needed data
  });

  const response = await res.json();

  if (res.ok) {
    toast.success(response.message, { autoClose: 2000 });
    router.push("/auth/signin");
  } else {
    toast.error(response.message, { autoClose: 2000 });
  }
} catch (err) {
  toast.error("Registration failed. Please try again.", { autoClose: 2000 });
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
              <label>Name</label>
              <input type="text" placeholder="Enter Your Name" name="name" value={formData.name} onChange={handleChange} />
              {errors.name && <span className="formerror">{errors.name}</span>}
            </div>
            <div className="forminput_cont">
              <label>Email</label>
              <input type="text" placeholder="Enter Your Email" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <span className="formerror">{errors.email}</span>}
            </div>
            <div className="forminput_cont">
              <label>Password</label>
              <input type="password" placeholder="Enter Your Password" name="password" value={formData.password} onChange={handleChange} />
              {errors.password && <span className="formerror">{errors.password}</span>}
            </div>
            <div className="forminput_cont">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm Your Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <span className="formerror">{errors.confirmPassword}</span>}
            </div>
            <div className="forminput_cont">
              <label>City</label>
              <input type="text" placeholder="Enter Your City" name="city" value={formData.city} onChange={handleChange} />
              {errors.city && <span className="formerror">{errors.city}</span>}
            </div>
            <button type="submit" className="main_button">Register</button>
            <p className="authlink">Already have an account? <Link href="/auth/signin">Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
