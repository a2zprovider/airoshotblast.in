import { useEffect, useState } from 'react';
import config from '~/config';
import ProductSlider from './ProductSlider';

export default function CategorySection() {
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

    return (
        <div className="bg-[#E9F1F7]">
            <div className="container mx-auto py-8">
                {/* Section 1 */}
                <div className="py-6">
                    <div className="text-3xl font-bold text-center">Sand Blasting</div>
                    <p className="text-sm font-normal text-center my-2">We are one of the leading manufacturer, supplier, exporter of sand blasting equipments, machines, sand blasting cabinets, sand blasting rooms, vacuum sand blasting machine </p>
                    {/* <ProductSlider products={products.data.data} /> */}
                </div>
                {/* Section 2 */}
                <div className="py-6">
                    <div className="text-3xl font-bold text-center">Shot Blasting</div>
                    <p className="text-sm font-normal text-center my-2">Shot Blasting
                        We are one of the leading manufacturer, supplier, exporter of airless shot blasting machine, tumble shot blasting machine & spinner hanger shot blast machine</p>
                    <div>
                        {/* <ProductSlider products={products.data.data} /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
