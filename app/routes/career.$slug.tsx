import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, NavLink, useFetcher, useLoaderData, useNavigate, useParams, useRouteError } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useModal } from "~/components/Modalcontext";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request, params }) => {
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

        const careerCacheKey = `career-${params.slug}`;
        const cachedCareer = cache[careerCacheKey];
        let careers;
        if (!cachedCareer) {
            const c_detail = await fetch(config.apiBaseURL + 'career/' + params.slug);
            if (!c_detail.ok) { throw c_detail; }
            careers = await c_detail.json();
            cache[careerCacheKey] = careers;
            setTimeout(() => {
                delete cache[careerCacheKey];
            }, CACHE_EXPIRATION_TIME);
        } else {
            careers = cachedCareer;
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

    const { careers, settings, full_url }: any = data;
    return [
        // Seo Details
        { charSet: "UTF-8" },
        { title: careers.data.seo_title },
        { name: "description", content: careers.data.seo_description },
        { name: "keywords", content: careers.data.seo_keywords },

        // OG Details
        { name: "og:type", content: "article" },
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:site_name", content: settings?.data?.title },
        { name: "og:title", content: careers.data.title },
        { name: "og:description", content: careers.data.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: settings?.data?.title },
        { name: "twitter:title", content: careers.data.title },
        { name: "twitter:description", content: careers.data.seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
    ];
};

export default function CareerDetail() {
    const { slug, pages, settings, full_url, baseUrl, careers }: any = useLoaderData();
    const { openStatusShow } = useModal();
    const [fileName, setFileName] = useState('No file selected');
    const [careerid, setCareerid] = useState<any | null>(careers.data._id);
    const [file, setFile] = useState<File | null>(null);

    const [btnLoading, setBtnLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setFileName(file ? file.name : 'No file selected');
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
        setCareerid(careers.data._id);
    };

    const navigate = useNavigate();

    const handleClick = (url: any) => {
        navigate(`${url}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBtnLoading(true);

        const formData = new FormData();
        if (!file) {
            openStatusShow({ success: null, error: 'Please select a resume.', status: 0 });
            setBtnLoading(false);
            return;
        }
        formData.append('file', file);
        formData.append('career', careerid);
        try {
            const response = await fetch(config.apiBaseURL + 'job', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const result = await response.json();
                openStatusShow({ success: result.message, error: null, status: 1 });
                setBtnLoading(false);
                setFileName('No file selected');
                setFile(null);
            } else {
                openStatusShow({ success: null, error: 'File upload failed.', status: 0 });
                setBtnLoading(false);
            }
        } catch (error) {
            openStatusShow({ success: null, error: 'An error occurred while uploading the file.', status: 0 });
            setBtnLoading(false);
        }
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
            "item": baseUrl + '/careers'
        }, {
            "@type": "ListItem",
            "position": 3,
            "name": careers.data.title,
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
                                    <div className="content-detail">
                                        <div className="pb-4">
                                            <div className="font-medium text-2xl text-theme">Job Title:</div>
                                            <p className="font-normal text-[#131B23] text-lg">{careers.data.title}</p>
                                        </div>
                                        <div className="pb-4">
                                            <div className="font-medium text-2xl text-theme">Job Vacancy:</div>
                                            <p className="font-normal text-[#131B23] text-lg">{careers.data.vacancy}</p>
                                        </div>
                                        <div className="pb-4">
                                            <div className="font-medium text-2xl text-theme">Office Address:</div>
                                            <p className="font-normal text-[#131B23] text-lg">{careers.data.address}</p>
                                        </div>
                                        <div className="pb-4">
                                            <div className="font-medium text-2xl text-theme">Job Overview:</div>
                                            <div className="content-detailsfont-normal text-[#131B23] text-lg text-justify">
                                                <div dangerouslySetInnerHTML={{ __html: careers.data.description }} ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 border rounded-md">
                                        <form onSubmit={handleSubmit} className="flex items-center justify-between flex-col md:flex-row">
                                            <input type="hidden" name="career" defaultValue={careers.data._id} />
                                            <span className="flex flex-col md:flex-row items-center gap-2">
                                                <input type="file" name="resume" id="resume" className="hidden" placeholder="" onChange={handleFileChange} />
                                                <label htmlFor="resume" className="flex items-center bg-theme text-[#F6F6F6] font-medium text-xl py-2 px-3 rounded-[10px] gap-2"><i className="fa fa-upload"></i><div className="text-xl">Upload Resume</div></label>
                                                <span className="text-gray-700">{fileName}</span>
                                            </span>
                                            {
                                                btnLoading ?
                                                    <button type="submit" title="Processing" className="bg-[#131B23] text-[#F6F6F6] font-medium text-xl py-2 px-3 rounded-[10px] flex items-center gap-3" disabled><i className="fa fa-spinner animate-spin"></i> <p className="text-xl">Processing...</p></button>
                                                    :
                                                    <button type="submit" title="Apply Now" className="bg-[#131B23] text-[#F6F6F6] font-medium text-xl py-2 px-3 rounded-[10px]">Apply Now</button>
                                            }
                                        </form>
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
