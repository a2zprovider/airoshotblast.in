import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Filter from "~/components/Filter";
import ProductCard from "~/components/ProductCard";
import config from "~/config";

export let loader: LoaderFunction = async ({ request, params }) => {
    const cat = await fetch(config.apiBaseURL + 'category/' + params.catslug);
    const category = await cat.json();

    const full_url = request.url;

    return json({ category, full_url });
};

export const meta: MetaFunction = ({ data }) => {
    const { category, full_url }: any = data;
    return [
        // Seo Details
        { title: category.data.seo_title },
        { name: "description", content: category.data.seo_description },
        { name: "keywords", content: category.data.seo_keywords },

        // OG Details
        { name: "og:title", content: category.data.title },
        { name: "og:description", content: category.data.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'category/' + category.data.image },
        { name: "og:url", content: full_url },

        // Twitter Card Details
        { name: "twitter:twitter", content: "summary_large_image" },
        { name: "twitter:title", content: category.data.title },
        { name: "twitter:description", content: category.data.seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'category/' + category.data.image },
    ];
};

export default function Category() {

    const { category, full_url }: any = useLoaderData();
    // console.log(category.products);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const openFilter = () => setIsFilterOpen(true);
    const closeFilter = () => setIsFilterOpen(false);

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
                            <div className="text-lg">{category.data.title}</div>
                            <Link to="/products" className=""><i className="fa fa-times-circle"></i></Link>
                        </div>
                    </div>

                    <Filter isOpen={isFilterOpen} onClose={closeFilter} />
                    <div className="py-3">
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
                            {category.products.map((product: any) => (
                                <div key={product.id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                        {!(category.products).length ?
                            <div className="font-normal text-[#131B23] text-lg text-center">No Products Found.</div>
                            : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
