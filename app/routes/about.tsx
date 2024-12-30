import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useRouteError } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import LeftSideTabs from "~/components/LeftTabs";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request }) => {
    const slug = 'about-us';

    const pageCacheKey = `page-${slug}`;
    const settingsCacheKey = `settings`;

    const cachedPageDetail = cache[pageCacheKey];
    const cachedSettings = cache[settingsCacheKey];

    const CACHE_EXPIRATION_TIME = 10 * 60 * 1000;
    setTimeout(() => {
        delete cache[settingsCacheKey];
        delete cache[pageCacheKey];
    }, CACHE_EXPIRATION_TIME);

    const url = new URL(request.url);
    const baseUrl = `${url.origin}`;
    const full_url = `${url.origin}${url.pathname}`;

    if (cachedPageDetail && cachedSettings) {
        return json({ slug, page_detail: cachedPageDetail, settings: cachedSettings, full_url, baseUrl });
    }

    try {
        let page_detail;
        if (!cachedPageDetail) {
            const p_detail = await fetch(config.apiBaseURL + 'page/' + slug);
            if (!p_detail.ok) { throw p_detail; }
            page_detail = await p_detail.json();
            cache[pageCacheKey] = page_detail;
        }

        let settings;
        if (!cachedSettings) {
            const setting = await fetch(config.apiBaseURL + 'setting');
            if (!setting.ok) { throw setting; }
            settings = await setting.json();
            cache[settingsCacheKey] = settings;
        }

        return json({ slug, page_detail, settings, full_url });
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

    const { page_detail, full_url }: any = data;

    return [
        // Seo Details
        { title: page_detail.data.seo_title },
        { name: "description", content: page_detail.data.seo_description },
        { name: "keywords", content: page_detail.data.seo_keywords },

        // OG Details
        { name: "og:type", content: "article" },
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:title", content: page_detail.data.title },
        { name: "og:description", content: page_detail.data.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'page/' + page_detail.data.image },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: page_detail.data.title },
        { name: "twitter:description", content: page_detail.data.seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'page/' + page_detail.data.image },
    ];
};

export default function About() {
    const { slug, page_detail, settings, full_url, baseUrl }: any = useLoaderData();
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
            "name": page_detail.data.title,
            "item": full_url
        }]
    }
    return (
        <>
            <div className="bg-[#E9F1F799]">
                <head>
                    <script type="application/ld+json">{JSON.stringify(breadcrumb_schema)}</script>
                </head>
                <div className="container mx-auto">
                    <div className="bg-[#f6f6f6] px-3 md:px-6 py-3">
                        <div className="flex items-center py-2 text-sm font-normal">
                            <Link title="Home" to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <div className="text-sm font-normal text-theme underline">About Us</div>
                        </div>
                        <div className="py-3">
                            <LeftSideTabs settings={settings} />
                        </div>
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
