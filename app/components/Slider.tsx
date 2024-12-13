import { useEffect, useState } from 'react';
import config from '~/config';

export default function Slider() {
    const [sliders, setSliders] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? sliders.length - 1 : prevIndex - 1
        );
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === sliders.length - 1 ? 0 : prevIndex + 1
        );
    };

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const slider = await fetch(config.apiBaseURL + 'sliders');
                const sliders = await slider.json();

                setSliders(sliders.data.data);
            } catch (error) {
                console.error('Error fetching sliders:', error);

            } finally {
                setLoading(false);
            }
        };

        fetchSliders();
    }, []);
    if (loading) {
        return <p className='text-center'>Loading...</p>;
    }

    return (

        <div className="relative w-full mx-auto">
            {/* Images */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {sliders.map((slider: any, index: any) => (
                        <img
                            key={index}
                            src={config.imgBaseURL + `/slider/${slider.image}`}
                            alt={slider.title} loading="lazy"
                            className="w-full flex-shrink-0"
                        />
                    ))}
                </div>
            </div>

            {/* Previous Button */}
            <button
                onClick={handlePrevClick}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white p-2  hover:bg-gray-900"
                title='Previous Button'
            >
                <i className='fa fa-chevron-left'></i>
            </button>

            {/* Next Button */}
            <button
                onClick={handleNextClick}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white p-2  hover:bg-gray-900"
                title='Next Button'
            >
                <i className='fa fa-chevron-right'></i>
            </button>

        </div>
    );
}
