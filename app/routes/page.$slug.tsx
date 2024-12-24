import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, NavLink, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request, params }) => {
    const { slug } = params;

    const pageCacheKey = `page-${slug}`;
    const pagesCacheKey = `pages`;
    const settingsCacheKey = `settings`;

    const cachedPageDetail = cache[pageCacheKey];
    const cachedPages = cache[pagesCacheKey];
    const cachedSettings = cache[settingsCacheKey];

    const url = new URL(request.url);
    const full_url = `${url.origin}${url.pathname}`;

    if (cachedPageDetail && cachedPages && cachedSettings) {
        return json({ slug, pages: cachedPages, page_detail: cachedPageDetail, settings: cachedSettings, full_url });
    }

    try {
        let pages;
        if (!cachedPages) {
            const page = await fetch(config.apiBaseURL + 'pages?limit=100&parent=null');
            if (!page.ok) {
                throw new Error(`Failed to fetch page details: ${page.statusText}`);
            }
            pages = await page.json();
            cache[pagesCacheKey] = pages;
        }

        let page_detail;
        if (!cachedPageDetail) {
            const p_detail = await fetch(config.apiBaseURL + 'page/' + slug);
            if (!p_detail.ok) {
                throw new Error(`Failed to fetch page details: ${p_detail.statusText}`);
            }
            page_detail = await p_detail.json();
            cache[pageCacheKey] = page_detail;
        }

        let settings;
        if (!cachedSettings) {
            const setting = await fetch(config.apiBaseURL + 'setting');
            if (!setting.ok) {
                throw new Error(`Failed to fetch settings: ${setting.statusText}`);
            }
            settings = await setting.json();
            cache[settingsCacheKey] = settings;
        }

        return json({ slug, pages, page_detail, settings, full_url });
    } catch (error) {
        console.error('Error during loader execution:', error);
        return json({ error: 'An error occurred while fetching data.' }, { status: 500 });
    }
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

export default function Pages() {
    const navigate = useNavigate();
    const { slug, pages, page_detail, settings, full_url }: any = useLoaderData();

    const handleClick = (url: any) => {
        navigate(`${url}`);
    };

    return (
        <>
            <div className="bg-[#E9F1F799]">
                <div className="container mx-auto">
                    <div className="bg-[#f6f6f6] px-3 md:px-6 py-3">
                        <div className="flex items-center py-2 text-sm font-normal">
                            <Link title="Home" to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <div className="text-sm font-normal text-[#4356A2] underline">Pages</div>
                        </div>
                        <div className="py-3">
                            <div className="flex md:flex-row flex-col gap-2 min-h-screen">
                                {/* Sidebar (Tabs) */}
                                <div className="md:w-1/4 ">
                                    <ul className="space-y-2 w-full">
                                        {pages.data.data.map((page: any, index: any) => (
                                            page.slug != 'about-us' ?
                                                <li key={index}>
                                                    <button
                                                        className={`w-full text-left font-medium text-lg py-4 px-4 border outline-0 ${slug == page.slug
                                                            ? "bg-[#4356A2] border-[#4356A2] text-white"
                                                            : "text-gray-700 border-[#CCCCCC80]"
                                                            }`}
                                                        title={page.title}
                                                        onClick={() => handleClick('/page/' + page.slug)}
                                                    >
                                                        {page.title}
                                                    </button>
                                                </li>
                                                : ''
                                        ))}
                                        <li>
                                            <button
                                                className="w-full text-left font-medium text-lg py-4 px-4 border outline-0 text-gray-700 border-[#CCCCCC80]"
                                                onClick={() => handleClick('/careers')}
                                                title="Career"
                                            >
                                                Career
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                {/* Content Area */}
                                <div className="md:w-3/4">
                                    <div className="px-2">
                                        <div className="content-details font-normal text-lg text-justify space-y-4">
                                            <div dangerouslySetInnerHTML={{ __html: page_detail.data.description }} ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
