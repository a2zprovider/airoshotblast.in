import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, NavLink, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import config from "~/config";

export let loader: LoaderFunction = async ({ request, params }) => {
    

    const page = await fetch(config.apiBaseURL + 'pages?limit=100');
    const pages = await page.json();

    const career = await fetch(config.apiBaseURL + 'career/' + params.slug);
    const careers = await career.json();

    const setting = await fetch(config.apiBaseURL + 'setting');
    const settings = await setting.json();

    const full_url = request.url;
    const slug = "careers";

    return json({ pages, settings, full_url, slug, careers });
};

export default function CareerDetail() {

    const navigate = useNavigate();
    const { slug, pages, settings, full_url, careers }: any = useLoaderData();

    const handleClick = (url: any) => {
        navigate(`/${url}`);
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
                                        <div className="content-detail">
                                            <div className="pb-4">
                                                <div className="font-medium text-2xl text-[#4356A2]">Job Title:</div>
                                                <p className="font-normal text-[#131B23] text-lg">{careers.data.title}</p>
                                            </div>
                                            <div className="pb-4">
                                                <div className="font-medium text-2xl text-[#4356A2]">Job Vacancy:</div>
                                                <p className="font-normal text-[#131B23] text-lg">{careers.data.vacancy}</p>
                                            </div>
                                            <div className="pb-4">
                                                <div className="font-medium text-2xl text-[#4356A2]">Office Address:</div>
                                                <p className="font-normal text-[#131B23] text-lg">C-5, Block 1, Vaibhav Vihar, Shikargarh Jodhpur, Rajasthan, 342015</p>
                                            </div>
                                            <div className="pb-4">
                                                <div className="font-medium text-2xl text-[#4356A2]">Job Overview:</div>
                                                <p className="font-normal text-[#131B23] text-lg">We are looking for a motivated and technically skilled Sales Engineer to join our sales team. The ideal candidate will work closely with customers to identify their needs and provide technical solutions to meet those needs. This role requires a combination of technical expertise, communication skills, and the ability to build strong relationships with clients.</p>
                                            </div>
                                        </div>
                                        <div className="py-4">
                                            <form action="" className="flex items-center justify-between">
                                                <input type="file" name="resume" id="resume" className="hidden" placeholder="" />
                                                <label htmlFor="resume" className=" flex items-center bg-[#4356A2] text-[#F6F6F6] font-medium text-xl py-2 px-3 rounded-[10px] gap-2"><i className="fa fa-upload"></i><div className="text-xl">Upload Resume</div></label>
                                                <button className="bg-[#131B23] text-[#F6F6F6] font-medium text-xl py-2 px-3 rounded-[10px]">Apply Now</button>
                                            </form>
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
