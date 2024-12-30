import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData, useRouteError } from "@remix-run/react";
import { useState } from "react";
import Filter from "~/components/Filter";
import ProductCard from "~/components/ProductCard";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request, params }) => {
    try {
        const cat = await fetch(config.apiBaseURL + 'category/' + params.catslug);
        if (!cat.ok) { throw cat; }
        const category = await cat.json();

        const url = new URL(request.url);
        const baseUrl = `${url.origin}`;
        const full_url = `${url.origin}${url.pathname}`;

        return json({ category, full_url, baseUrl });
    } catch (error) {
        throw error;
    }
};

export const meta: MetaFunction = ({ data }: any) => {
    if (!data || data.error) {
        return [
            { title: "Error - Not found" },
            { name: "description", content: "We couldn't find you're looking for." },
        ];
    }

    const { category, full_url }: any = data;
    return [
        // Seo Details
        { title: category?.data?.seo_title },
        { name: "description", content: category?.data?.seo_description },
        { name: "keywords", content: category?.data?.seo_keywords },

        // OG Details
        { name: "og:type", content: "article" },
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:title", content: category?.data?.title },
        { name: "og:description", content: category?.data?.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'category/' + category?.data?.image },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: category?.data?.title },
        { name: "twitter:description", content: category?.data?.seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'category/' + category?.data?.image },
    ];
};

export default function Category() {
    const { category, full_url, baseUrl }: any = useLoaderData();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const openFilter = () => setIsFilterOpen(true);
    const closeFilter = () => setIsFilterOpen(false);

    const breadcrumb_schema = {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": category.data.title,
            "item": full_url
        }]
    }

    return (
        <div className="bg-[#E9F1F799]">
            <head>
                <script type="application/ld+json">{JSON.stringify(breadcrumb_schema)}</script>
            </head>
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex flex-row overflow-auto items-center py-2 gap-4">
                        <button onClick={openFilter} title="Open Filter" className="bg-theme text-lg text-white font-medium rounded-md flex items-center gap-2 px-3 py-2">
                            <i className="fa fa-sliders-h"></i>
                            <span className="md:block hidden text-lg">Filter</span>
                        </button>
                        <div className="text-nowrap flex items-center gap-2 text-lg font-medium text-[#131B23] bg-[#ccc] px-2 py-2 rounded-md">
                            <div className="text-lg">{category?.data?.title}</div>
                            <Link title="Products" to="/products" className=""><i className="fa fa-times-circle"></i></Link>
                        </div>
                    </div>

                    <Filter isOpen={isFilterOpen} onClose={closeFilter} />
                    <div className="py-3">
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
                            {category.products.map((product: any, index: any) => (
                                <div key={index}>
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

export function ErrorBoundary() {
    const error = useRouteError() as { status: number; statusText: string; data?: { message?: string } };
    return (
        <>
            <div className="bg-[#E9F1F799]">
                <div className="container mx-auto">
                    <div className="py-8">
                        <div className="text-center">
                            <div className="font-medium text-9xl mb-5">{error.status}</div>
                            <div className="font-medium text-3xl mb-5">{error.statusText}</div>
                            <p>{error && error?.data && error.data.message ? error.data.message : 'Sorry, something went wrong.'}</p>
                            <div className="mt-5 pt-5">
                                <Link to="/" className="bg-theme text-white rounded p-5 font-medium text-xl">Go To Homepage</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
