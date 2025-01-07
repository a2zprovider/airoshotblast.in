import { useEffect, useState } from 'react';
import config from '~/config';
import ProductSlider from './ProductSlider';

export default function CategoryProductSection() {
    const [category, setCategory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const cat = await fetch(config.apiBaseURL + 'category');
                const category = await cat.json();

                setCategory(category.data.data);
            } catch (error) {
                console.error('Error fetching category:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, []);
    if (loading) {
        return <div className='text-center'>
            <div className='loading'>
                <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 100 100" enableBackground="new 0 0 0 0" xmlSpace="preserve">
                    <rect x="20" y="50" width="4" height="10" fill="#07642E">
                        <animateTransform attributeType="xml"
                            attributeName="transform" type="translate"
                            values="0 0; 0 20; 0 0"
                            begin="0" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                    <rect x="30" y="50" width="4" height="10" fill="#07642E">
                        <animateTransform attributeType="xml"
                            attributeName="transform" type="translate"
                            values="0 0; 0 20; 0 0"
                            begin="0.2s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                    <rect x="40" y="50" width="4" height="10" fill="#07642E">
                        <animateTransform attributeType="xml"
                            attributeName="transform" type="translate"
                            values="0 0; 0 20; 0 0"
                            begin="0.4s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                </svg>
            </div>
        </div>;
    }

    return (
        <>
            <div className="container mx-auto py-8">
                {category.map((cat: any, index: any) => (
                    cat.parent == null ?
                        cat.products.length ?
                            <div className="py-6" key={index}>
                                <div className="text-3xl font-bold text-center">{cat.title}</div>
                                <p className="text-sm font-normal text-center my-2">{cat.except}</p>
                                <ProductSlider products={cat.products} />
                            </div>
                            : ''
                        : ''
                ))}
            </div>
        </>
    );
}
