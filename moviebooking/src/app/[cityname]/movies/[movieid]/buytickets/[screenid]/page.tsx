"use client";
import React, { useState, useEffect } from "react";
import "./SelectSeat.css";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

interface Seat {
    row: string;
    col: number;
    seat_id: string;
    price: number;
}

interface Movie {
    id: string;
    title: string;
    genre: string[];
}

interface Screen {
    screen: {
        name: string;
        seats: SeatType[];
    };
    movieSchedulesforDate: Schedule[];
}

interface SeatType {
    type: string;
    price: number;
    rows: Row[];
}

interface Row {
    rowname: string;
    cols: {
        seats: Seat[];
    }[];
}

interface Schedule {
    _id: string;
    showTime: string;
    notAvailableSeats: Seat[];
}

const Page = () => {
    const searchParams = useSearchParams();
    const { movieid, cityname, screenid } = useParams<{ movieid: string; cityname: string; screenid: string }>();
    const date = searchParams.get("date") || "";

    const [screen, setScreen] = useState<Screen | null>(null);
    const [selectedTime, setSelectedTime] = useState<Schedule | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

    useEffect(() => {
        const getSchedules = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/schedulebymovie/${screenid}/${date}/${movieid}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                const response = await res.json();
                if (response.ok) {
                    setScreen(response.data);
                    setSelectedTime(response.data.movieSchedulesforDate[0] || null);
                }
            } catch (err) {
                console.error(err);
            }
        };

        const getMovie = async () => {
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
                console.error(err);
            }
        };

        getSchedules();
        getMovie();
    }, [movieid, screenid, date]);

    const selectDeselectSeat = (seat: Seat) => {
        setSelectedSeats((prev) =>
            prev.some((s) => s.row === seat.row && s.col === seat.col && s.seat_id === seat.seat_id)
                ? prev.filter((s) => s.row !== seat.row || s.col !== seat.col || s.seat_id !== seat.seat_id)
                : [...prev, seat]
        );
    };

    const generateSeatLayout = () => {
        if (!screen || !selectedTime) return null;

        const scheduleIndex = screen.movieSchedulesforDate.findIndex((t) => t.showTime === selectedTime.showTime);
        if (scheduleIndex === -1) return null;

        let notAvailableSeats = screen.movieSchedulesforDate[scheduleIndex].notAvailableSeats;

        return (
            <div>
                {screen.screen.seats.map((seatType, index) => (
                    <div className="seat-type" key={index}>
                        <h2>
                            {seatType.type} - Rs. {seatType.price}
                        </h2>
                        <div className="seat-rows">
                            {seatType.rows.map((row, rowIndex) => (
                                <div className="seat-row" key={rowIndex}>
                                    <p className="rowname">{row.rowname}</p>
                                    <div className="seat-cols">
                                        {row.cols.map((col, colIndex) => (
                                            <div className="seat-col" key={colIndex}>
                                                {col.seats.map((seat, seatIndex) => {
                                                    const isUnavailable = notAvailableSeats.some(
                                                        (s) => s.row === row.rowname && s.seat_id === seat.seat_id && s.col === colIndex
                                                    );
                                                    const isSelected = selectedSeats.some(
                                                        (s) => s.row === row.rowname && s.seat_id === seat.seat_id && s.col === colIndex
                                                    );

                                                    return (
                                                        <span
                                                            key={seatIndex}
                                                            className={
                                                                isUnavailable
                                                                    ? "seat-unavailable"
                                                                    : isSelected
                                                                    ? "seat-selected"
                                                                    : "seat-available"
                                                            }
                                                            onClick={() =>
                                                                !isUnavailable &&
                                                                selectDeselectSeat({
                                                                    row: row.rowname,
                                                                    col: colIndex,
                                                                    seat_id: seat.seat_id,
                                                                    price: seatType.price,
                                                                })
                                                            }
                                                        >
                                                            {seatIndex + 1}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                    <br />
                                    <br />
                                    <br />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const handleBooking = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/bookticket`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    showTime: selectedTime?.showTime,
                    showDate: date,
                    movieId: movieid,
                    screenId: screenid,
                    seats: selectedSeats,
                    totalPrice: selectedSeats.reduce((acc, seat) => acc + seat.price, 0),
                    paymentId: "123456789",
                    paymentType: "online",
                }),
            });
            const response = await res.json();
            if (response.ok) {
                toast.success("Booking Successful");
            } else {
                console.error(response);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="selectseatpage">
            {movie && screen && (
                <div className="s1">
                    <div className="head">
                        <h1>
                            {movie.title} - {screen?.screen?.name}
                        </h1>
                        <h3>{movie.genre.join(" / ")}</h3>
                    </div>
                </div>
            )}

            {screen && (
                <div className="selectseat">
                    <div className="timecont">
                        {screen.movieSchedulesforDate.map((time) => (
                            <h3
                                className={selectedTime?._id === time._id ? "time selected" : "time"}
                                onClick={() => {
                                    setSelectedTime(time);
                                    setSelectedSeats([]);
                                }}
                                key={time._id}
                            >
                                {time.showTime}
                            </h3>
                        ))}
                    </div>

                    <div className="indicators">
                        <div>
                            <span className="seat-unavailable"></span>
                            <p>Not available</p>
                        </div>
                        <div>
                            <span className="seat-available"></span>
                            <p>Available</p>
                        </div>
                        <div>
                            <span className="seat-selected"></span>
                            <p>Selected</p>
                        </div>
                    </div>

                    {generateSeatLayout()}

                    <div className="totalcont">
                        <div className="total">
                            <h2>Total</h2>
                            <h3>Rs. {selectedSeats.reduce((acc, seat) => acc + seat.price, 0)}</h3>
                        </div>

                        <button className="theme_btn1 linkstylenone" onClick={handleBooking}>
                            Book Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
