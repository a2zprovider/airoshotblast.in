import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductSlider = ({ products }: any) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(4);
    const [cardClass, setCardClass] = useState('w-[25%]');

    // Adjust the number of visible items based on the window size (responsive behavior)
    useEffect(() => {
        console.log('window.innerWidth : ', window.innerWidth);

        const updateVisibleItems = () => {
            if (window.innerWidth < 640) {
                setVisibleItems(1);
                setCardClass('w-[100%]');
            } else if (window.innerWidth < 768) {
                setVisibleItems(2);
                setCardClass('w-[50%]');
            } else if (window.innerWidth < 1024) {
                setVisibleItems(3);
                setCardClass('w-[33.33%]');
            } else {
                setVisibleItems(4);
                setCardClass('w-[25%]');
            }
        };

        window.addEventListener('resize', updateVisibleItems);
        updateVisibleItems(); // Initial check

        return () => window.removeEventListener('resize', updateVisibleItems);
    }, []);

    const totalSlides = Math.ceil(products.length / visibleItems);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? 0 : prevIndex - visibleItems
        );
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex >= products.length - visibleItems
                ? products.length - visibleItems
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
                    className="flex"
                    style={{ transform: `translateX(-${(currentIndex / visibleItems) * 100}%)` }}
                >
                    {products.map((product: any, index: any) => (
                        <div key={index} className={cardClass + ` p-2 flex-shrink-0`}>
                            <div className='mt-4'>
                                <ProductCard product={product} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Previous Button */}
            <button
                onClick={handlePrevClick}
                disabled={currentIndex === 0}
                className={`absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white rounded-full px-4 py-[1px] ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                aria-label="Previous Slide"
            >
                <i className="fa fa-chevron-left"></i>
            </button>

            {/* Next Button */}
            <button
                onClick={handleNextClick}
                disabled={currentIndex >= products.length - visibleItems}
                className={`absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white rounded-full px-4 py-[1px] ${currentIndex >= products.length - visibleItems ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                aria-label="Next Slide"
            >
                <i className="fa fa-chevron-right"></i>
            </button>

            {/* Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full ${currentIndex / visibleItems === index ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default ProductSlider;
