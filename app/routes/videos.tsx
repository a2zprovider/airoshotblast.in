import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const full_url = `${url.origin}${url.pathname}`;

    const settingsCacheKey = `settings`;
    const cachedSettings = cache[settingsCacheKey];

    const CACHE_EXPIRATION_TIME = 60 * 60 * 1000;
    setTimeout(() => {
      delete cache[settingsCacheKey];
    }, CACHE_EXPIRATION_TIME);
  
    let settings;
    if (!cachedSettings) {
        const setting = await fetch(config.apiBaseURL + 'setting');
        if (!setting.ok) {
            throw new Error(`Failed to fetch settings: ${setting.statusText}`);
        }
        settings = await setting.json();
        cache[settingsCacheKey] = settings;
    } else {
        settings = cachedSettings;
    }

    const video = await fetch(config.apiBaseURL + 'video');
    const videos = await video.json();

    return json({ videos, settings, full_url });
};

export const meta: MetaFunction = ({ data }) => {
    const { settings, full_url }: any = data;
    const seo_details = JSON.parse(settings.data.seo_details);

    return [
        // Seo Details
        { title: seo_details.v_seo_title },
        { name: "description", content: seo_details.v_seo_description },
        { name: "keywords", content: seo_details.v_seo_keywords },

        // OG Details
        { name: "og:type", content: "website" },
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:title", content: seo_details.v_seo_title },
        { name: "og:description", content: seo_details.v_seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo_details.v_seo_title },
        { name: "twitter:description", content: seo_details.v_seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
    ];
};

export default function Videos() {
    const { videos }: any = useLoaderData();

    return (
        <div className="bg-[#E9F1F799]">
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp;  <div className="text-sm font-normal text-[#4356A2] underline">Videos</div>
                    </div>
                    <div className="py-3">
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
                            {videos.data.data.map((video: any, index: any) => (
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
                        {!(videos.data.data).length ?
                            <div className="font-normal text-[#131B23] text-lg text-center">No Videos Found.</div>
                            : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}