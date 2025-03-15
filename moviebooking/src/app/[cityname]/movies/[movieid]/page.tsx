"use client";
import React, { useEffect, useState } from "react";
import { BsShare, BsFillStarFill } from "react-icons/bs";
import "./MoviePage.css";
import MovieCarousel from "@/components/Navbar/MovieCarousel/MovieCarousel";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import CelebCard from "@/components/Navbar/CelebCard/CelebCard";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";

interface Movie {
  title: string;
  rating: number;
  landscapeImgUrl: string;
  portraitImgUrl: string;
  genre: string[];
  duration: string;
  description: string;
  cast: { name: string; role: string; imageUrl: string }[];
  crew: { name: string; role: string; imageUrl: string }[];
}

const MoviePage = () => {
  const pathname = usePathname();
  const { movieid } = useParams<{ movieid: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies/${movieid}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (data.ok) {
          setMovie(data.data);
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
      }
    };

    if (movieid) getMovies();
  }, [movieid]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="moviepage">
      <div className="c1" style={{ backgroundImage: `url(${movie.landscapeImgUrl})` }}>
        <div className="c11">
          <div className="left">
            <div className="movie_poster" style={{ backgroundImage: `url(${movie.portraitImgUrl})` }}>
              <p>In cinemas</p>
            </div>
            <div className="movie_details">
              <p className="title">{movie.title}</p>
              <p className="rating">
                <BsFillStarFill className="star" /> {movie.rating}/10
              </p>
              <p className="duration_type_releasedat">
                <span className="duration">{movie.duration}</span>
                <span>•</span>
                <span className="type">{movie.genre.join(", ")}</span>
              </p>
              <Link href={`${pathname}/buytickets`} className="linkstylenone">
                <button className="bookbtn">Book Tickets</button>
              </Link>
            </div>
          </div>
          <div className="right">
            <button className="sharebtn">
              <BsShare className="shareicon" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="c2">
        <h1>About the Movie</h1>
        <p>{movie.description}</p>

        {movie.cast.length > 0 && (
          <div className="circlecardslider">
            <div className="line"></div>
            <h1>Cast</h1>
            <Swiper slidesPerView={3} spaceBetween={10} pagination={{ clickable: true }} modules={[Pagination]}>
              {movie.cast.map((cast, index) => (
                <SwiperSlide key={index}>
                  <CelebCard _id={""} {...cast} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {movie.crew.length > 0 && (
          <div className="circlecardslider">
            <div className="line"></div>
            <h1>Crew</h1>
            <Swiper slidesPerView={3} spaceBetween={10} pagination={{ clickable: true }} modules={[Pagination]}>
              {movie.crew.map((crew, index) => (
                <SwiperSlide key={index}>
                  <CelebCard _id={""} {...crew} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className="line"></div>
        <h1>You might also like</h1>
        <MovieCarousel />
      </div>
    </div>
  );
};

export default MoviePage;
