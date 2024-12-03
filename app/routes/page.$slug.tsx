import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, NavLink, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { useState } from "react";

export let loader: LoaderFunction = async ({ request, params }) => {
    const { slug } = params;

    const page = await fetch('http://localhost:5000/api/pages?limit=100');
    const pages = await page.json();

    const p_detail = await fetch('http://localhost:5000/api/page/' + params.slug);
    const page_detail = await p_detail.json();

    const setting = await fetch('http://localhost:5000/api/setting');
    const settings = await setting.json();

    const full_url = request.url;

    return json({ slug, pages, page_detail, settings, full_url });
};

// export const meta: MetaFunction = ({ data }) => {
//     const { settings, full_url }: any = data;
//     const seo_details = JSON.parse(settings.data.seo_details);

//     return [
//         // Seo Details
//         { title: seo_details.p_seo_title },
//         { name: "description", content: seo_details.p_seo_description },
//         { name: "keywords", content: seo_details.p_seo_keywords },

//         // OG Details
//         { name: "og:title", content: seo_details.p_seo_title },
//         { name: "og:description", content: seo_details.p_seo_description },
//         { name: "og:image", content: imageUrl + 'setting/logo/' + settings.data.logo },
//         { name: "og:url", content: full_url },

//         // Twitter Card Details
//         { name: "twitter:twitter", content: "summary_large_image" },
//         { name: "twitter:title", content: seo_details.p_seo_title },
//         { name: "twitter:description", content: seo_details.p_seo_description },
//         { name: "twitter:image", content: imageUrl + 'setting/logo/' + settings.data.logo },
//     ];
// };


export default function Pages() {
    const navigate = useNavigate();
    const { slug, pages, page_detail, settings, full_url }: any = useLoaderData();

    const handleClick = (url: any) => {
        navigate(`${url}`);
    };

    return (
        <>
            <div className="bg-[#E9F1F7]">
                <div className="container mx-auto">
                    <div className="bg-[#f6f6f6] px-6 py-3">
                        <div className="flex items-center py-2 text-sm font-normal">
                            <Link to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <div className="text-sm font-normal text-[#4356A2] underline">Pages</div>
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
                                                            : "bg-white text-gray-700 border-[#CCCCCC80]"
                                                            }`}
                                                        onClick={() => handleClick('/page/' + page.slug)}
                                                    >
                                                        {page.title}
                                                    </button>
                                                </li>
                                                : ''
                                        ))}
                                        <li>
                                            <button
                                                className="w-full text-left font-medium text-lg py-4 px-4 border outline-0 bg-white text-gray-700 border-[#CCCCCC80]"
                                                onClick={() => handleClick('/careers')}
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