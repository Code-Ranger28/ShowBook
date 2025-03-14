"use client"
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import './BuyTicketsPage.css';

const Page = () => {
    const pathname = usePathname();
    const params = useParams();
    const { movieid, cityname } = params;

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [movie, setMovie] = useState<any>(null);
    const [theatres, setTheatres] = useState<any[]>([]);

    const getMovie = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies/${movieid}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await res.json();
            if (data.ok) {
                setMovie(data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getTheatres = async (date: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/screensbymovieschedule/${cityname}/${date}/${movieid}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await res.json();
            if (data.ok) {
                setTheatres(data.data);
            } else {
                setTheatres([]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getMovie();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            getTheatres(selectedDate.toISOString().split('T')[0]);
        }
    }, [selectedDate]);

    return (
        <>
            {movie && (
                <div className='buytickets'>
                    <div className='s1'>
                        <div className='head'>
                            <h1>{movie.title} - {movie.language}</h1>
                            <h3>{movie.genre.join(", ")}</h3>
                        </div>
                        <DatePicker
                            onChange={(date) => setSelectedDate(Array.isArray(date) ? date[0] : date || new Date())}
                            value={selectedDate}
                        />
                    </div>

                    {theatres.length > 0 ? (
                        <div className="screens">
                            {theatres.map((screen, index) => (
                                <div className='screen' key={index}>
                                    <div>
                                        <h2>{screen.name}</h2>
                                        <h3>{screen.location}</h3>
                                    </div>
                                    <Link href={`${pathname}/${screen._id}?date=${selectedDate}`} className='theme_btn1 linkstylenone'>
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
