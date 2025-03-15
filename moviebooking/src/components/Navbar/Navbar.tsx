"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { BiUserCircle, BiSearch } from "react-icons/bi";
import { RiArrowDropDownFill } from "react-icons/ri";
import logo from "@/assets/logo.png";
import Image from "next/image";
import LocationPopup from "@/popups/location/locationPopup";

const Navbar = () => {
  interface User {
    city: string; // Fixed type
    id: string;
    name: string;
    email: string;
    profilePicture?: string; // Optional field
  }

  const [showLocationPopup, setShowLocationPopup] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false); // ✅ Prevents SSR issue

  useEffect(() => {
    setIsClient(true); // ✅ Ensures client-side execution
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/getuser`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const response = await res.json();
      if (response.ok) {
        setUser(response.data);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/logout`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const response = await res.json();
      if (response.ok && typeof window !== "undefined") {
        window.location.href = "/auth/signin"; // ✅ Only runs on the client
      }
    } catch (error) {
      console.error("Logout error:", error);
      if (typeof window !== "undefined") {
        window.location.href = "/auth/signin"; // ✅ Client-side only
      }
    }
  };

  if (!isClient) return null; // ✅ Avoid rendering on the server

  return (
    <nav>
      <div className="left">
        <Image
          src={logo}
          alt="logo"
          width={100}
          height={100}
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = "/";
            }
          }}
        />
        <div className="searchbox">
          <BiSearch className="searchbtn" />
          <input type="text" placeholder="Search for Movie" />
        </div>
      </div>
      <div className="right">
        <p className="dropdown" onClick={() => setShowLocationPopup(true)}>
          {user ? user.city : "Select City"}
          <RiArrowDropDownFill className="dropicon" />
        </p>
        {loggedIn ? (
          <button className="theme_btn1 linkstylenone" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link href="/auth/signin" className="theme_btn1 linkstylenone">
            Login
          </Link>
        )}

        <Link href="/" className="likestylenone">
          <BiUserCircle className="theme_icon1" />
        </Link>
      </div>
      {showLocationPopup && <LocationPopup setShowLocationPopup={setShowLocationPopup} />}
    </nav>
  );
};

export default Navbar;
