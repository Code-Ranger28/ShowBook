"use client"
import styles from "./page.module.css";
import HomeSlider from "@/components/Navbar/HomeSlider/HomeSlider";
import MovieCarousel from "@/components/Navbar/MovieCarousel/MovieCarousel";

export default function Home() {
  return (
      <main className={styles.main}>
        <HomeSlider />
        <MovieCarousel />
      </main>
  );
}
