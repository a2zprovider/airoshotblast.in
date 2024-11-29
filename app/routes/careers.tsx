import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, NavLink, useLoaderData, useNavigate, useParams } from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App Page" },
        { name: "Page description", content: "Welcome to Remix Page!" },
    ];
};

export let loader: LoaderFunction = async ({ request, params }) => {

    const page = await fetch('http://localhost:5000/api/pages?limit=100');
    const pages = await page.json();

    const p_detail = await fetch('http://localhost:5000/api/pages');
    const page_detail = await p_detail.json();

    const setting = await fetch('http://localhost:5000/api/setting');
    const settings = await setting.json();

    const full_url = request.url;

    return json({ pages, page_detail, settings, full_url });
};

export default function Careers() {
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
                                                className="w-full text-left font-medium text-lg py-4 px-4 border outline-0 bg-[#4356A2] border-[#4356A2] text-white"
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
                                        <div className="text-medium text-2xl text-[#4356A2] pb-4">Open Job Positions</div>
                                        <div className="grid grid-cols-3 gap-2 bg-[#F1F1F1] shadow-md divide-x divide-[#ccc] mb-4 p-3">
                                            <div className="px-4 py-2">
                                                <div className="text-[#4356A2] text-xl font-medium py-1">Sales Engineer</div>
                                                <div className="flex items-center gap-2 py-1">
                                                    <i className="fa fa-map-marker-alt"></i>
                                                    <div className="text-[#131B23] font-normal text-lg">Jodhpur, Rajasthan</div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-2">
                                                <div className="font-normal text-[#131B23] text-lg py-1">
                                                    <span>Posted on: </span>
                                                    <span className="text-[#4356A2] text-xl font-medium">Nov 13, 2024</span>
                                                </div>
                                                <div className="font-normal text-[#131B23] text-lg py-1">
                                                    <span>No. of Vacancies: </span>
                                                    <span className="text-[#4356A2] text-xl font-medium">5</span>
                                                </div>
                                            </div>
                                            <div className="p-5 flex items-center justify-center">
                                                <button onClick={() => handleClick('career/first')} className="bg-[#131B23] text-[#F6F6F6] font-medium text-xl py-2 px-3 rounded-[10px]">Apply Now</button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 bg-[#F1F1F1] shadow-md divide-x divide-[#ccc] mb-4 p-3">
                                            <div className="px-4 py-2">
                                                <div className="text-[#4356A2] text-xl font-medium py-1">Sales Engineer</div>
                                                <div className="flex items-center gap-2 py-1">
                                                    <i className="fa fa-map-marker-alt"></i>
                                                    <div className="text-[#131B23] font-normal text-lg">Jodhpur, Rajasthan</div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-2">
                                                <div className="font-normal text-[#131B23] text-lg py-1">
                                                    <span>Posted on: </span>
                                                    <span className="text-[#4356A2] text-xl font-medium">Nov 13, 2024</span>
                                                </div>
                                                <div className="font-normal text-[#131B23] text-lg py-1">
                                                    <span>No. of Vacancies: </span>
                                                    <span className="text-[#4356A2] text-xl font-medium">5</span>
                                                </div>
                                            </div>
                                            <div className="p-5 flex items-center justify-center">
                                                <button onClick={() => handleClick('career/second')} className="bg-[#131B23] text-[#F6F6F6] font-medium text-xl py-2 px-3 rounded-[10px]">Apply Now</button>
                                            </div>
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
