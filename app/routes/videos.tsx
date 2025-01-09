import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useNavigate, useRouteError } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import Accordion from "~/components/Accordion";
import EnquiryForm from "~/components/EnquiryForm";
import VideoSlider from "~/components/VideoSlider";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const baseUrl = `https://${url.host}`;
        const full_url = `https://${url.host}${url.pathname}`;

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

        const videosCacheKey = `videos-limit_100`;
        const cachedVideos = cache[videosCacheKey];
        let videos;
        if (!cachedVideos) {
            const video = await fetch(config.apiBaseURL + 'video?limit=100');
            if (!video.ok) { throw video; }
            videos = await video.json();
            cache[videosCacheKey] = videos;
            setTimeout(() => {
                delete cache[videosCacheKey];
            }, CACHE_EXPIRATION_TIME);
        } else {
            videos = cachedVideos;
        }

        const faqsCacheKey = `faqs-limit_10`;
        const cachedFaqs = cache[faqsCacheKey];
        let faqs;
        if (!cachedFaqs) {
            const faq = await fetch(config.apiBaseURL + 'faqs?limit=10');
            if (!faq.ok) { throw faq; }
            faqs = await faq.json();
            cache[faqsCacheKey] = faqs;
            setTimeout(() => {
                delete cache[faqsCacheKey];
            }, CACHE_EXPIRATION_TIME);
        } else {
            faqs = cachedFaqs;
        }

        return json({ videos, settings, faqs, full_url, baseUrl });
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

    const { settings, full_url }: any = data;
    const seo_details = JSON.parse(settings.data.seo_details);

    return [
        // Seo Details
        { charSet: "UTF-8" },
        { title: seo_details.v_seo_title },
        { name: "description", content: seo_details.v_seo_description },
        { name: "keywords", content: seo_details.v_seo_keywords },

        // OG Details
        { name: "og:type", content: "website" },
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:site_name", content: settings?.data?.title },
        { name: "og:title", content: seo_details.v_seo_title },
        { name: "og:description", content: seo_details.v_seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: settings?.data?.title },
        { name: "twitter:title", content: seo_details.v_seo_title },
        { name: "twitter:description", content: seo_details.v_seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
    ];
};

export default function Videos() {
    const { videos, faqs, full_url, baseUrl }: any = useLoaderData();

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
            "name": 'Videos',
            "item": full_url
        }]
    }

    const navigate = useNavigate();
    const navigateTo = (url: any) => {
        navigate(url);
    }
    return (
        <>
            <script type="application/ld+json">{JSON.stringify(breadcrumb_schema)}</script>
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp;  <div className="text-sm font-normal text-theme underline">Videos</div>
                    </div>
                    <div className="py-3">
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
                            {videos?.data?.data.length > 0 && videos?.data?.data.map((video: any, index: any) => (
                                <div key={index} >
                                    <Link to={'https://www.youtube.com/watch?v=' + video.url} target="_blank" className="relative">
                                        <img src={'https://i.ytimg.com/vi/' + video.url + '/hqdefault.jpg'} alt={video.title} className="shadow-md rounded" />
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                                            <span className="relative flex h-[40px] w-[40px]">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex items-center justify-center rounded-full h-[40px] w-[40px]">
                                                    <i className="fab fa-youtube text-[30px] text-red-500 hover:text-red-600"></i>
                                                </span>
                                            </span>
                                        </div>
                                    </Link>
                                    <div className="mt-2">
                                        <Link to={'https://www.youtube.com/watch?v=' + video.url} target="_blank" className="font-normal text-lg line-clamp-1">{video.title}</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!(videos?.data?.data).length ?
                            <div className="font-normal text-[#131B23] text-lg text-center py-5">Latest Videos Coming Soon.</div>
                            : ''
                        }
                    </div>
                </div>
            </div>
            <>
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
            </>
            <>
                <div className="container mx-auto pb-8">
                    <div>
                        <div className="text-3xl font-bold text-center">Frequently Asked Questions</div>
                        <p className="text-sm font-normal text-center my-2">Have any questions about sand blasting & shot blasting machine? Find answers here</p>
                        <div className="py-4">
                            <Accordion faqs={faqs.data.data} />
                        </div>
                    </div>
                </div>
            </>
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
