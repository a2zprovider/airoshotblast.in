import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData, useNavigate, useParams, useRouteError } from "@remix-run/react";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request, params }) => {
    try {
        const url = new URL(request.url);
        const baseUrl = `https://${url.host}`;
        const full_url = `https://${url.host}${url.pathname}`;

        const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

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

        const pagesCacheKey = `pages-limit_100-parent_null`;
        const cachedPages = cache[pagesCacheKey];
        let pages;
        if (!cachedPages) {
            const page = await fetch(config.apiBaseURL + 'pages?limit=100&parent=null');
            if (!page.ok) { throw page; }
            pages = await page.json();
            cache[pagesCacheKey] = pages;
            setTimeout(() => {
                delete cache[pagesCacheKey];
            }, CACHE_EXPIRATION_TIME);
        } else {
            pages = cachedPages;
        }

        const careersCacheKey = `careers-limit_100`;
        const cachedCareers = cache[careersCacheKey];
        let careers;
        if (!cachedCareers) {
            const career = await fetch(config.apiBaseURL + 'careers?limit=100');
            if (!career.ok) { throw career; }
            careers = await career.json();
            cache[careersCacheKey] = careers;
            setTimeout(() => {
                delete cache[cachedCareers];
            }, CACHE_EXPIRATION_TIME);
        } else {
            careers = cachedCareers;
        }

        const slug = "careers";

        return json({ pages, settings, full_url, baseUrl, slug, careers });
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
        { title: seo_details.career_seo_title },
        { name: "description", content: seo_details.career_seo_description },
        { name: "keywords", content: seo_details.career_seo_keywords },

        // OG Details
        { name: "og:type", content: "website" },
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:site_name", content: settings?.data?.title },
        { name: "og:title", content: seo_details.career_seo_title },
        { name: "og:description", content: seo_details.career_seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: settings?.data?.title },
        { name: "twitter:title", content: seo_details.career_seo_title },
        { name: "twitter:description", content: seo_details.career_seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
    ];
};

export default function Careers() {
    const navigate = useNavigate();
    const { slug, pages, settings, full_url, baseUrl, careers }: any = useLoaderData();

    const handleClick = (url: any) => {
        navigate(`${url}`);
    };

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
            "name": 'Careers',
            "item": full_url
        }]
    }
    return (
        <>
            <script type="application/ld+json">{JSON.stringify(breadcrumb_schema)}</script>
            <div className="container mx-auto">
                <div className="bg-[#f6f6f6] px-3 md:px-6 py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link title="Home" to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <div className="text-sm font-normal text-theme underline">Pages</div>
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
                                                        ? "bg-theme border-theme text-white"
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
                                            className="w-full text-left font-medium text-lg py-4 px-4 border outline-0 bg-theme border-theme text-white"
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
                                    <div className="font-medium text-2xl text-theme pb-4">Open Job Positions</div>
                                    {(careers.data.data).length ?
                                        careers.data.data.map((career: any, index: any) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-[#F1F1F1] shadow-md md:divide-x divide-[#ccc] mb-4 p-3">
                                                <div className="px-4 py-2">
                                                    <div className="text-theme text-xl font-medium py-1">{career.title}</div>
                                                    <div className="flex items-center gap-2 py-1">
                                                        <i className="fa fa-map-marker-alt"></i>
                                                        <div className="text-[#131B23] font-normal text-lg">{career.address}</div>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-2">
                                                    <div className="font-normal text-[#131B23] text-lg py-1">
                                                        <span>Posted on: </span>
                                                        <span className="text-theme text-xl font-medium">Nov 13, 2024</span>
                                                    </div>
                                                    <div className="font-normal text-[#131B23] text-lg py-1">
                                                        <span>No. of Vacancies: </span>
                                                        <span className="text-theme text-xl font-medium">{career.vacancy}</span>
                                                    </div>
                                                </div>
                                                <div className="p-5 flex items-center justify-center">
                                                    <button onClick={() => navigate('/career/' + career.slug)} title="Apply Now" className="bg-[#131B23] text-[#F6F6F6] font-medium text-xl py-2 px-3 rounded-[10px]">Apply Now</button>
                                                </div>
                                            </div>
                                        ))
                                        : <div className="font-normal text-[#131B23] text-lg">No Jobs Opening.</div>
                                    }
                                </div>
                            </div>
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
