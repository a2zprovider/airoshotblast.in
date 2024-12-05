import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Filter from "~/components/Filter";
import ProductCard from "~/components/ProductCard";
import config from "~/config";

export let loader: LoaderFunction = async ({ request }) => {
    const product = await fetch(config.apiBaseURL + 'products?limit=100');
    const products = await product.json();

    const setting = await fetch(config.apiBaseURL + 'setting');
    const settings = await setting.json();

    const full_url = request.url;

    return json({ products, settings, full_url });
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
        { name: "og:title", content: seo_details.p_seo_title },
        { name: "og:description", content: seo_details.p_seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
        { name: "og:url", content: full_url },

        // Twitter Card Details
        { name: "twitter:twitter", content: "summary_large_image" },
        { name: "twitter:title", content: seo_details.p_seo_title },
        { name: "twitter:description", content: seo_details.p_seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
    ];
};


export default function Products() {

    const { products, settings, full_url }: any = useLoaderData();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const openFilter = () => setIsFilterOpen(true);
    const closeFilter = () => setIsFilterOpen(false);
    // const data = useLoaderData();

    return (
        <div className="bg-[#E9F1F799]">
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex flex-row overflow-auto items-center py-2 gap-4">
                        <button onClick={openFilter} className="bg-[#4356A2] text-lg text-white font-medium rounded-md flex items-center gap-2 px-3 py-2">
                            <i className="fa fa-sliders-h"></i>
                            <span className="md:block hidden text-lg">Filter</span>
                        </button>
                        <div className="text-nowrap flex items-center gap-2 text-lg font-medium text-[#131B23] bg-[#ccc] px-2 py-2 rounded-md">
                            <div className="text-lg">Sand Blasting</div>
                            <Link to="/" className=""><i className="fa fa-times-circle"></i></Link>
                        </div>
                        <div className="text-nowrap flex items-center gap-2 text-lg font-medium text-[#131B23] bg-[#ccc] px-2 py-2 rounded-md">
                            <div className="text-lg">Portable Sand Blasting Machine</div>
                            <Link to="/" className=""><i className="fa fa-times-circle"></i></Link>
                        </div>
                        <div className="text-nowrap flex items-center gap-2 text-lg font-medium text-[#131B23] bg-[#ccc] px-2 py-2 rounded-md">
                            <div className="text-lg">Sand Blasting</div>
                            <Link to="/" className=""><i className="fa fa-times-circle"></i></Link>
                        </div>
                        <div className="text-nowrap flex items-center gap-2 text-lg font-medium text-[#131B23] bg-[#ccc] px-2 py-2 rounded-md">
                            <div className="text-lg">Portable Sand Blasting Machine</div>
                            <Link to="/" className=""><i className="fa fa-times-circle"></i></Link>
                        </div>
                    </div>

                    <Filter isOpen={isFilterOpen} onClose={closeFilter} />
                    <div className="py-3">
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
                            {products.data.data.map((product: any, index: any) => (
                                <div key={index}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
