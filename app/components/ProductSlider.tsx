import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductSlider = ({ products }: any) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(4);
    const [cardClass, setCardClass] = useState('w-[25%]');

    // Adjust the number of visible items based on the window size (responsive behavior)
    useEffect(() => {
        const updateVisibleItems = () => {
            if (window.innerWidth < 640) {
                setVisibleItems(1);
                setCardClass('w-[100%]');
            } else if (window.innerWidth < 768) {
                setVisibleItems(1);
                setCardClass('w-[100%]');
            } else if (window.innerWidth < 1024) {
                setVisibleItems(2);
                setCardClass('w-[50%]');
            } else if (window.innerWidth < 1440) {
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

    // Handle previous click (with looping)
    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? (totalSlides - 1) * visibleItems : prevIndex - visibleItems
        );
    };

    // Handle next click (with looping)
    const handleNextClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex >= products.length - visibleItems
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
                disabled={products.length <= visibleItems}
                className={`absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white rounded-full px-4 py-[1px]`}
                aria-label="Previous Slide" title="Previous Slide"
            >
                <i className="fa fa-chevron-left"></i>
            </button>

            {/* Next Button */}
            <button
                onClick={handleNextClick}
                disabled={products.length <= visibleItems}
                className={`absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white rounded-full px-4 py-[1px]`}
                aria-label="Next Slide" title="Next Slide"
            >
                <i className="fa fa-chevron-right"></i>
            </button>

            {/* Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${currentIndex / visibleItems === index ? 'bg-theme' : 'bg-gray-300'}`}
                        aria-label={`Go to slide ${index + 1}`} title={`Go to slide ${index + 1}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ProductSlider;
