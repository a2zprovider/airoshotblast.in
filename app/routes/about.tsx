import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import LeftSideTabs from "~/components/LeftTabs";
import config from "~/config";

export let loader: LoaderFunction = async ({ request }) => {

    const slug = 'about-us';

    const p_detail = await fetch(config.apiBaseURL + 'page/' + slug);
    const page_detail = await p_detail.json();

    const setting = await fetch(config.apiBaseURL + 'setting');
    const settings = await setting.json();

    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const full_url = `${url.origin}${url.pathname}`;

    return json({ slug, page_detail, settings, full_url });
};

export const meta: MetaFunction = ({ data }) => {
    const { page_detail, full_url }: any = data;

    return [
        // Seo Details
        { title: page_detail.data.seo_title },
        { name: "description", content: page_detail.data.seo_description },
        { name: "keywords", content: page_detail.data.seo_keywords },

        // OG Details
        { name: "og:type", content: "article" },
        { name: "og:title", content: page_detail.data.title },
        { name: "og:description", content: page_detail.data.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'page/' + page_detail.data.image },
        { name: "og:url", content: full_url },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: page_detail.data.title },
        { name: "twitter:description", content: page_detail.data.seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'page/' + page_detail.data.image },

        // Canonical URL
        { rel: 'canonical', href: full_url },
    ];
};

export default function About() {
    const { slug, pages, page_detail, settings, full_url }: any = useLoaderData();
    return (
        <>
            <div className="bg-[#E9F1F799]">
                <div className="container mx-auto">
                    <div className="bg-[#f6f6f6] px-3 md:px-6 py-3">
                        <div className="flex items-center py-2 text-sm font-normal">
                            <Link title="Home" to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <div className="text-sm font-normal text-[#4356A2] underline">About Us</div>
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

export function ErrorBoundary({ error }: { error: Error }) {
    return (
        <div>
            <h1>Error</h1>
            <p>There was an error: {error ? error.message : ''}</p>
            <Link to="/">Go back to Homepage</Link>
        </div>
    );
}
