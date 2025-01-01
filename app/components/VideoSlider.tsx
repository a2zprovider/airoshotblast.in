import { useState, useEffect } from 'react';
import config from '~/config';
import { Link } from '@remix-run/react';

const VideoSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(1);
    const [cardClass, setCardClass] = useState('w-[100%]');
    const [videos, setVideos] = useState<any[]>([]);

    // Adjust the number of visible items based on the window size (responsive behavior)
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const video = await fetch(config.apiBaseURL + 'video');
                const videos = await video.json();

                setVideos(videos.data.data);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchVideos();

        const updateVisibleItems = () => {
            if (window.innerWidth < 640) {
                setVisibleItems(1);
                setCardClass('w-[100%]');
            } else if (window.innerWidth < 768) {
                setVisibleItems(1);
                setCardClass('w-[100%]');
            } else if (window.innerWidth < 1024) {
                setVisibleItems(1);
                setCardClass('w-[100%]');
            } else {
                setVisibleItems(1);
                setCardClass('w-[100%]');
            }
        };

        window.addEventListener('resize', updateVisibleItems);
        updateVisibleItems(); // Initial check

        return () => window.removeEventListener('resize', updateVisibleItems);
    }, []);

    const totalSlides = Math.ceil(videos.length / visibleItems);

    // Handle previous click (with looping)
    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? (totalSlides - 1) * visibleItems : prevIndex - visibleItems
        );
    };

    // Handle next click (with looping)
    const handleNextClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex >= videos.length - visibleItems
                ? 0
                : prevIndex + visibleItems
        );
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index * visibleItems);
    };

    return (
        <div className="relative w-full mx-auto">
            {/* Product Container */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${(currentIndex / visibleItems) * 100}%)` }}
                >
                    {videos && videos?.map((video: any, index: any) => (
                        <div key={index} className={cardClass + ` p-2 flex-shrink-0`}>
                            <div className='flex justify-center'>
                                <Link title={video.title} to={'https://www.youtube.com/watch?v=' + video.url} target="_blank" className="relative">
                                    <img src={'https://i.ytimg.com/vi/' + video.url + '/hqdefault.jpg'} alt={video.title} className="shadow-md rounded" />
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                                        <span className="relative flex h-[40px] w-[40px]">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex items-center justify-center rounded-full h-[40px] w-[40px]">
                                                <i className="fab fa-youtube text-[30px] text-red-500 hover:text-red-600"></i>
                                            </span>
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Previous Button */}
            <button
                onClick={handlePrevClick}
                disabled={videos.length <= visibleItems}
                className={`${videos.length <= visibleItems ? 'hidden' : 'block'} absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white rounded-full px-4 py-[1px]`}
                aria-label="Previous Slide" title="Previous Slide"
            >
                <i className="fa fa-chevron-left"></i>
            </button>

            {/* Next Button */}
            <button
                onClick={handleNextClick}
                disabled={videos.length <= visibleItems}
                className={`${videos.length <= visibleItems ? 'hidden' : 'block'} absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white rounded-full px-4 py-[1px]`}
                aria-label="Next Slide" title="Next Slide"
            >
                <i className="fa fa-chevron-right"></i>
            </button>

            {/* Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full ${currentIndex / visibleItems === index ? 'bg-theme' : 'bg-gray-300'}`}
                        aria-label={`Go to slide ${index + 1}`} title={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default VideoSlider;
