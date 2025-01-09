import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData, useRouteError } from "@remix-run/react";
import { useState } from "react";
import Filter from "~/components/Filter";
import ProductCard from "~/components/ProductCard";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request, params }) => {
    try {
        const CACHE_EXPIRATION_TIME = 1 * 60 * 1000;

        const settingsCacheKey = `settings`;
        const cachedSettings = cache[settingsCacheKey];
        let settings;
        if (!cachedSettings) {
            const setting = await fetch(config.apiBaseURL + 'setting');
            if (!setting.ok) { throw setting; }
            settings = await setting.json();
            cache[settingsCacheKey] = settings;
            setTimeout(() => {
                delete cache[settingsCacheKey];
            }, CACHE_EXPIRATION_TIME);
        } else {
            settings = cachedSettings;
        }

        const cdetailCacheKey = `category-${params.catslug}`;
        const cachedCDetail = cache[cdetailCacheKey];
        let category;
        if (!cachedCDetail) {
            const c_detail = await fetch(config.apiBaseURL + 'category/' + params.catslug);
            if (!c_detail.ok) { throw c_detail; }
            category = await c_detail.json();
            cache[cdetailCacheKey] = category;
            setTimeout(() => {
                delete cache[cdetailCacheKey];
            }, CACHE_EXPIRATION_TIME);
        } else {
            category = cachedCDetail;
        }

        const url = new URL(request.url);
        const baseUrl = `https://${url.host}`;
        const full_url = `https://${url.host}${url.pathname}`;

        return json({ category, settings, full_url, baseUrl });
    } catch (error) {
        throw error;
    }
};

export const meta: MetaFunction = ({ data }: any) => {
    if (!data || data.error) {
        return [
            { charSet: "UTF-8" },
            { title: "Error - Not found" },
            { name: "description", content: "We couldn't find you're looking for." },
        ];
    }

    const { category, settings, full_url }: any = data;
    return [
        // Seo Details
        { charSet: "UTF-8" },
        { title: category?.data?.seo_title },
        { name: "description", content: category?.data?.seo_description },
        { name: "keywords", content: category?.data?.seo_keywords },

        // OG Details
        { name: "og:type", content: "article" },
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:site_name", content: settings?.data?.title },
        { name: "og:title", content: category?.data?.title },
        { name: "og:description", content: category?.data?.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'category/' + category?.data?.image },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: settings?.data?.title },
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
        <>
            <script type="application/ld+json">{JSON.stringify(breadcrumb_schema)}</script>
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
                            <div className="font-normal text-[#131B23] text-lg text-center py-5">No Products Found.</div>
                            : ''
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export function ErrorBoundary() {
    const error = useRouteError() as { status: number; statusText: string; data?: { message?: string } };
    return (
        <>
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
        </>
    );
}
