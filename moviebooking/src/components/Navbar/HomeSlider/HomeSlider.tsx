import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import Image from 'next/image';

const width = window.innerWidth;
const height = window.innerHeight;
const HomeSlider = () => {

    const [banners, setBanners] = useState([
        {
            imgUrl: 'https://assets-in.bmscdn.com/promotions/cms/creatives/1693561351496_motogpsepdesktop.jpg'
        },
        {
            imgUrl: 'https://assets-in.bmscdn.com/promotions/cms/creatives/1693472198837_iccdesktop.jpg'
        }
    ])
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Run only on the client side
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initialize with current dimensions
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup event listener
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
       {
            banners.map((banner,index) =>{
                return (
                    <SwiperSlide key={index}>
                        <Image src={banner.imgUrl} alt="" width={width} height={height/2}
                            style={{
                                objectFit: "cover"
                            }} />
                    </SwiperSlide>
                )
            })
       }
      </Swiper>
      
  )
}

export default HomeSlider
