import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import config from "~/config";

export let loader: LoaderFunction = async ({ request, params }) => {
    const page = await fetch(config.apiBaseURL + 'pages?limit=100&parent=null');
    const pages = await page.json();

    const career = await fetch(config.apiBaseURL + 'careers');
    const careers = await career.json();

    const setting = await fetch(config.apiBaseURL + 'setting');
    const settings = await setting.json();

    const full_url = request.url;
    const slug = "careers";

    return json({ pages, settings, full_url, slug, careers });
};

export const meta: MetaFunction = ({ data }) => {
    const { settings, full_url }: any = data;
    const seo_details = JSON.parse(settings.data.seo_details);

    return [
        // Seo Details
        { title: seo_details.career_seo_title },
        { name: "description", content: seo_details.career_seo_description },
        { name: "keywords", content: seo_details.career_seo_keywords },

        // OG Details
        { name: "og:type", content: "website" },
        { name: "og:title", content: seo_details.career_seo_title },
        { name: "og:description", content: seo_details.career_seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
        { name: "og:url", content: full_url },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo_details.career_seo_title },
        { name: "twitter:description", content: seo_details.career_seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
        
        // Canonical URL
        { rel: 'canonical', href: full_url },
    ];
};

export default function Careers() {
    const navigate = useNavigate();
    const { slug, pages, settings, full_url, careers }: any = useLoaderData();

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
                                                className="w-full text-left font-medium text-lg py-4 px-4 border outline-0 bg-[#4356A2] border-[#4356A2] text-white"
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
                                        <div className="font-medium text-2xl text-[#4356A2] pb-4">Open Job Positions</div>
                                        {(careers.data.data).length ?
                                            careers.data.data.map((career: any, index: any) => (
                                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-[#F1F1F1] shadow-md md:divide-x divide-[#ccc] mb-4 p-3">
                                                    <div className="px-4 py-2">
                                                        <div className="text-[#4356A2] text-xl font-medium py-1">{career.title}</div>
                                                        <div className="flex items-center gap-2 py-1">
                                                            <i className="fa fa-map-marker-alt"></i>
                                                            <div className="text-[#131B23] font-normal text-lg">{career.address}</div>
                                                        </div>
                                                    </div>
                                                    <div className="px-4 py-2">
                                                        <div className="font-normal text-[#131B23] text-lg py-1">
                                                            <span>Posted on: </span>
                                                            <span className="text-[#4356A2] text-xl font-medium">Nov 13, 2024</span>
                                                        </div>
                                                        <div className="font-normal text-[#131B23] text-lg py-1">
                                                            <span>No. of Vacancies: </span>
                                                            <span className="text-[#4356A2] text-xl font-medium">{career.vacancy}</span>
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
            </div>
        </>
    );
}
