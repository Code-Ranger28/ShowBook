import React from "react";
import { useRouter } from "next/navigation";
import { BsFillStarFill } from "react-icons/bs";
import "./MovieCard.css";

// Define the movie type
interface Movie {
  _id: string;
  title: string;
  genre: string[];
  rating: number;
  portraitImgUrl: string;
}

// Define the prop type
interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const router = useRouter();
  const city = "Mumbai"; // Assuming Mumbai is a default value

  return (
    <div
      className="moviecard"
      onClick={() => {
        router.push(`/${city}/movies/${movie._id}`);
      }}
    >
      <div
        className="movieimg"
        style={{
          backgroundImage: `url(${movie.portraitImgUrl})`,
        }}
      >
        <p className="rating">
          <BsFillStarFill className="star" /> &nbsp;&nbsp;
          {movie.rating}/10
        </p>
      </div>
      <div className="details">
        <p className="title">{movie.title}</p>
        <p className="type">{movie.genre.join(", ")}</p>
      </div>
    </div>
  );
};

export default MovieCard;
