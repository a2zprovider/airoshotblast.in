import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import Filter from "~/components/Filter";
import Loader from "~/components/loader";
import ProductCard from "~/components/ProductCard";
import config from "~/config";

export let loader: LoaderFunction = async ({ request }) => {
    const url_params = new URL(request.url).searchParams;
    const search = url_params.get('s');

    const setting = await fetch(config.apiBaseURL + 'setting');
    const settings = await setting.json();

    const full_url = request.url;

    return json({ settings, full_url, search });
};

export const meta: MetaFunction = ({ data }) => {
    const { settings, full_url }: any = data;
    const seo_details = JSON.parse(settings.data.seo_details);

    return [
        // Seo Details
        { title: seo_details.p_seo_title },
        { name: "description", content: seo_details.p_seo_description },
        { name: "keywords", content: seo_details.p_seo_keywords },

        // OG Details
        { name: "og:type", content: "website" },
        { name: "og:title", content: seo_details.p_seo_title },
        { name: "og:description", content: seo_details.p_seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
        { name: "og:url", content: full_url },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo_details.p_seo_title },
        { name: "twitter:description", content: seo_details.p_seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
        
        // Canonical URL
        { rel: 'canonical', href: full_url },
    ];
};


export default function Products() {
    const { search }: any = useLoaderData();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const openFilter = () => setIsFilterOpen(true);
    const closeFilter = () => setIsFilterOpen(false);
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [updateproducts, setUpdateproducts] = useState(Number);
    const [loading, setLoading] = useState(false);

    const applyFilter = (categories: any) => {
        setSelectedCategories(categories); // Update selected categories in the state
        const num = Math.floor(100000 + Math.random() * 900000);
        setUpdateproducts(num);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const cArray: any = [];
                selectedCategories.map((sc) => {
                    cArray.push(sc._id);
                });

                let products_url = config.apiBaseURL + 'products?limit=1000';
                if (search && search != '') {
                    products_url = config.apiBaseURL + 'products?limit=1000&search=' + search;
                }
                if (cArray.length) {
                    products_url = products_url + '&categories=' + cArray.join(",")
                }

                const p = await fetch(products_url);
                const ps = await p.json();
                setTimeout(() => setLoading(false), 100);
                setProducts(ps.data.data);
            } catch (error) {
                setTimeout(() => setLoading(false), 100);
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [updateproducts]);

    // const generateFilterUrl = () => {
    //     return `${full_url}?categories=${selectedCategories.join(",")}`;
    // };

    // const fetcher = useFetcher();
    // const [products, setProducts] = useState<any[]>([]);
    // const [status, setStatus] = useState(0);
    // const [page, setPage] = useState(1);
    // const [loading, setLoading] = useState(false);
    // if (status == 0) {
    //     setProducts((prev) => [...prev, ...products1.data.data]);
    //     setStatus(1);
    // }
    // useEffect(() => {
    //     const loadMoreProducts = async () => {
    //         const scrollPosition = window.scrollY + window.innerHeight;
    //         const bottom = document.documentElement.scrollHeight;
    //         try {
    //             if (scrollPosition >= bottom - 200 && !loading) {
    //                 setLoading(true);
    //                 const p = await fetch(config.apiBaseURL + `products?page=${page + 1}&limit=10`);
    //                 const newProducts = await p.json();
    //                 setProducts((prev) => [...prev, ...newProducts.data.data]);
    //                 setPage((prev) => prev + 1);
    //                 setLoading(false);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching products:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     window.addEventListener('scroll', loadMoreProducts);
    //     return () => { window.removeEventListener('scroll', loadMoreProducts) };
    // }, [page, loading, fetcher]);

    return (
        <div className="bg-[#E9F1F799]">
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex flex-row overflow-auto items-center py-2 gap-4">
                        <button onClick={openFilter} title="Filter" className="bg-[#4356A2] text-lg text-white font-medium rounded-md flex items-center gap-2 px-3 py-2">
                            <i className="fa fa-sliders-h"></i>
                            <span className="md:block hidden text-lg">Filter</span>
                        </button>
                        {selectedCategories.map((sc: any, si: any) => (
                            <div key={si} className="text-nowrap flex items-center gap-2 text-lg font-medium text-[#131B23] bg-[#ccc] px-2 py-2 rounded-md">
                                <div className="text-lg">{sc.title}</div>
                                <button title={sc.title} onClick={openFilter} className=""><i className="fa fa-times-circle"></i></button>
                            </div>
                        ))}
                    </div>

                    <Filter isOpen={isFilterOpen} onClose={closeFilter} onApplyFilter={applyFilter} selectedAllCategories={selectedCategories} />
                    <div className="py-3">
                        {loading ? <Loader /> :
                            <>
                                <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
                                    {products.map((product: any, index: any) => (
                                        <div key={index}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                                {!(products).length ?
                                    <div className="font-normal text-[#131B23] text-lg text-center">No Products Found.</div>
                                    : ''
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
