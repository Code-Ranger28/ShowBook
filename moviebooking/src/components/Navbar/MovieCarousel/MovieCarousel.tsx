import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import MovieCard from "./MovieCard";

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string; // Optional field
}

// Define the movie type
interface Movie {
  _id: string;
  title: string;
  genre: string[];
  rating: number;
  portraitImgUrl: string;
}

const MovieCarousel: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false); // ✅ Prevents SSR issue

  useEffect(() => {
    setIsClient(true); // ✅ Ensures client-side execution

    const fetchMovies = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch movies");

        const data = await res.json();
        setMovies(data?.data || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/getuser`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          if (typeof window !== "undefined") {
            window.location.href = "/auth/signin"; // ✅ Client-side only
          }
          return;
        }

        const response = await res.json();
        setUser(response?.data || null);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchMovies();
    fetchUser();
  }, []);

  if (!isClient) return null; // ✅ Avoid rendering on the server

  return (
    <div className="sliderout">
      <Swiper
        slidesPerView={1}
        spaceBetween={1}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 2 },
          750: { slidesPerView: 2, spaceBetween: 2 },
          1000: { slidesPerView: 3, spaceBetween: 2 },
          1500: { slidesPerView: 6, spaceBetween: 2 },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {movies.length > 0 ? (
          movies.map((movie) => (
            <SwiperSlide key={movie._id}>
              <MovieCard movie={movie} user={user} />
            </SwiperSlide>
          ))
        ) : (
          <p>No movies available</p>
        )}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
