import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import MovieCard from "./MovieCard"; // ✅ Ensure correct import

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

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();
        if (data.ok) {
          setMovies(data.data);
        }
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

        const response = await res.json();
        if (response.ok) {
          setUser(response.data);
        } else {
          window.location.href = "/auth/signin";
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchMovies();
    fetchUser();
  }, []);

  return (
    <div className="sliderout">
      <Swiper
        slidesPerView={1}
        spaceBetween={1}
        pagination={{ clickable: true }}
        breakpoints={{
          "@0.00": { slidesPerView: 1, spaceBetween: 2 },
          "@0.75": { slidesPerView: 2, spaceBetween: 2 },
          "@1.00": { slidesPerView: 3, spaceBetween: 2 },
          "@1.50": { slidesPerView: 6, spaceBetween: 2 },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie._id}>
            <MovieCard movie={movie} user={user} /> {/* ✅ Correctly passing 'user' */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
