import React from "react";
import { useRouter } from "next/navigation";
import { BsFillStarFill } from "react-icons/bs";
import "./MovieCard.css";  // Ensure this file exists

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

// Define the prop type
interface MovieCardProps {
  movie: Movie;
  user: User | null; // ✅ Ensure 'user' is included in props
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, user }) => {
  const router = useRouter();
  const city = "Mumbai"; // Default city

  return (
    <div
      className="moviecard"
      onClick={() => router.push(`/${city}/movies/${movie._id}`)} // ✅ Fixed syntax
    >
      <div
        className="movieimg"
        style={{
          backgroundImage: `url(${movie.portraitImgUrl})`, // ✅ Fixed template string
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
      {user && <p className="user-info">Welcome, {user.name}!</p>} {/* ✅ Now using 'user' */}
    </div>
  );
};

export default MovieCard;
