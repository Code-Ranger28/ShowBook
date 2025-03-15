import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import Image from "next/image";

const HomeSlider = () => {
  const [dimensions, setDimensions] = useState({
    width: 1200, // ✅ Set default width for SSR
    height: 600, // ✅ Set default height for SSR
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // ✅ Ensure it runs only on the client side
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      // ✅ Initialize with current dimensions
      handleResize();

      // ✅ Add event listener for resize
      window.addEventListener("resize", handleResize);

      return () => {
        // ✅ Cleanup
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const banners = [
    {
      imgUrl:
        "https://assets-in.bmscdn.com/promotions/cms/creatives/1693561351496_motogpsepdesktop.jpg",
    },
    {
      imgUrl:
        "https://assets-in.bmscdn.com/promotions/cms/creatives/1693472198837_iccdesktop.jpg",
    },
  ];

  return (
    <Swiper
      cssMode={true}
      navigation={true}
      pagination={true}
      mousewheel={true}
      keyboard={true}
      modules={[Navigation, Pagination, Mousewheel, Keyboard]}
      className="mySwiper"
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={index}>
          <Image
            src={banner.imgUrl}
            alt={`Banner ${index + 1}`}
            width={dimensions.width} // ✅ Updated width
            height={dimensions.height / 2} // ✅ Updated height
            style={{ objectFit: "cover" }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeSlider;
