import { useEffect, useState } from 'react';
import config from '~/config';
import ProductSlider from './ProductSlider';
import { AnyNode } from 'postcss';

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
        return <p className='text-center'>Loading...</p>;
    }

    console.log('category : 123 : ', category);


    return (
        <div className="bg-[#E9F1F799]">
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
        </div>
    );
}
