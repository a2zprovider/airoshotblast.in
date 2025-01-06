import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useNavigate, useRouteError } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import Accordion from "~/components/Accordion";
import EnquiryForm from "~/components/EnquiryForm";
import LeftSideTabs from "~/components/LeftTabs";
import VideoSlider from "~/components/VideoSlider";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request }) => {
    const slug = 'about-us';

    const pageCacheKey = `page-${slug}`;
    const settingsCacheKey = `settings`;

    const cachedPageDetail = cache[pageCacheKey];
    const cachedSettings = cache[settingsCacheKey];

    const CACHE_EXPIRATION_TIME = 1 * 60 * 60 * 1000;
    setTimeout(() => {
        delete cache[settingsCacheKey];
        delete cache[pageCacheKey];
    }, CACHE_EXPIRATION_TIME);

    const url = new URL(request.url);
    const baseUrl = `https://${url.host}`;
    const full_url = `https://${url.host}${url.pathname}`;
    console.log('url : ', url);
    console.log('baseUrl : ', baseUrl);
    console.log('full_url : ', full_url);


    if (cachedPageDetail && cachedSettings) {

        const faq = await fetch(config.apiBaseURL + 'faqs');
        if (!faq.ok) { throw faq; }
        const faqs = await faq.json();

        return json({ slug, page_detail: cachedPageDetail, settings: cachedSettings, full_url, baseUrl, faqs });
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

        const faq = await fetch(config.apiBaseURL + 'faqs');
        if (!faq.ok) { throw faq; }
        const faqs = await faq.json();

        return json({ slug, page_detail, settings, faqs, full_url });
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

    const { page_detail, settings, full_url }: any = data;

    return [
        // Seo Details
        { charSet: "UTF-8" },
        { title: page_detail.data.seo_title },
        { name: "description", content: page_detail.data.seo_description },
        { name: "keywords", content: page_detail.data.seo_keywords },

        // OG Details
        { name: "og:type", content: "article" },
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:site_name", content: settings?.data?.title },
        { name: "og:title", content: page_detail.data.title },
        { name: "og:description", content: page_detail.data.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'page/' + page_detail.data.image },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: settings?.data?.title },
        { name: "twitter:title", content: page_detail.data.title },
        { name: "twitter:description", content: page_detail.data.seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'page/' + page_detail.data.image },
    ];
};

export default function About() {
    const { slug, page_detail, settings, faqs, full_url, baseUrl }: any = useLoaderData();
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
    const navigate = useNavigate();
    const navigateTo = (url: any) => {
        navigate(url);
    }
    return (
        <>
            <div className="bg-[#E9F1F799] pb-6">
                <script type="application/ld+json">{JSON.stringify(breadcrumb_schema)}</script>
                <div className="container mx-auto">
                    <div className="bg-[#f6f6f6] px-3 md:px-6 py-3 pb-5">
                        <div className="flex items-center py-2 text-sm font-normal">
                            <Link title="Home" to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <div className="text-sm font-normal text-theme underline">About Us</div>
                        </div>
                        <div className="py-3">
                            <LeftSideTabs settings={settings} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#E9F1F799]">
                <div className="container mx-auto pb-8">
                    <div className="grid lg:grid-cols-2 md:grid-cols-1 items-center">
                        <div className="p-3 text-center my-6">
                            <div className="font-bold text-3xl">Product Videos</div>
                            <div className="font-normal text-sm py-2">Check Out Our Latest Videos of Sand Blasting Machine, & Shot Blasting Machine</div>
                            <div className="flex justify-center py-5">
                                <VideoSlider />
                            </div>
                            <button onClick={() => navigateTo('/videos')} title="View all Videos" className="n_btn2 bg-theme text-lg text-white font-medium rounded-md w-[196px] h-[46px] relative overflow-hidden z-0 transition duration-[800ms]">
                                View all Videos
                            </button>
                        </div>
                        <div className="bg-theme1 my-6 p-8 pt-10 pb-10">
                            <div className="text-center text-[#383838] font-bold text-3xl">Contact Us</div>
                            <EnquiryForm />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#E9F1F799]">
                <div className="container mx-auto pb-8">
                    <div>
                        <div className="text-3xl font-bold text-center">Frequently Asked Questions</div>
                        <p className="text-sm font-normal text-center my-2">Have any questions about sand blasting & shot blasting machine? Find answers here</p>
                        <div className="py-4">
                            <Accordion faqs={faqs.data.data} />
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
