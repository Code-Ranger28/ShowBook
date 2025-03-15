"use client";
import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

// Define types for movie and theatre
interface Movie {
  title: string;
  language: string;
  genre: string[];
}

interface Theatre {
  _id: string;
  name: string;
  location: string;
}

const Page = () => {
  const pathname = usePathname();
  const { movieid, cityname } = useParams<{ movieid: string; cityname: string }>();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatres, setTheatres] = useState<Theatre[]>([]);

  const getMovie = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies/${movieid}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.ok) setMovie(data.data);
    } catch (err) {
      console.error(err);
    }
  }, [movieid]);

  const getTheatres = useCallback(async (date: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/screensbymovieschedule/${cityname}/${date}/${movieid}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      setTheatres(data.ok ? data.data : []);
    } catch (err) {
      console.error(err);
    }
  }, [cityname, movieid]);

  useEffect(() => {
    getMovie();
  }, [getMovie]);

  useEffect(() => {
    getTheatres(selectedDate.toISOString().split("T")[0]);
  }, [getTheatres, selectedDate]);

  return (
    <>
      {movie && (
        <div className="buytickets">
          <div className="s1">
            <div className="head">
              <h1>
                {movie.title} - {movie.language}
              </h1>
              <h3>{movie.genre.join(", ")}</h3>
            </div>
            <DatePicker
              onChange={(date) =>
                setSelectedDate(Array.isArray(date) ? date[0] ?? new Date() : date ?? new Date())
              }
              value={selectedDate}
            />
          </div>

          {theatres.length > 0 ? (
            <div className="screens">
              {theatres.map((screen) => (
                <div className="screen" key={screen._id}>
                  <div>
                    <h2>{screen.name}</h2>
                    <h3>{screen.location}</h3>
                  </div>
                  <Link
                    href={`${pathname}/${screen._id}?date=${selectedDate.toISOString().split("T")[0]}`}
                    className="theme_btn1 linkstylenone"
                  >
                    Select
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="screens">
              <h1>No shows available</h1>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
