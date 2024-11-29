import type { MetaFunction } from "@remix-run/node";
import { Link, NavLink, useNavigate, useParams } from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App Page" },
        { name: "Page description", content: "Welcome to Remix Page!" },
    ];
};

export default function CareerDetail() {

    const navigate = useNavigate();
    const slug = 'careers';

    const handleClick = (url: any) => {
        navigate(`/${url}`);
    };

    const pages = [
        { id: 1, slug: 'privacy-policy', title: 'Privacy Policy', imageUrl: 'https://via.placeholder.com/150' },
        { id: 2, slug: 'terms-conditions', title: 'Terms & Conditions', imageUrl: 'https://via.placeholder.com/150' },
        { id: 3, slug: 'careers', title: 'Careers', imageUrl: 'https://via.placeholder.com/150' },
    ];
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
                                        {pages.map((page, index) => (
                                            <li key={index}>
                                                <button
                                                    className={`w-full text-left font-medium text-lg py-4 px-4 border outline-0 ${slug == page.slug
                                                        ? "bg-[#4356A2] border-[#4356A2] text-white"
                                                        : "bg-white text-gray-700 border-[#CCCCCC80]"
                                                        }`}
                                                    onClick={() => handleClick(page.slug)}
                                                >
                                                    {page.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Content Area */}
                                <div className="md:w-3/4">
                                    <div className="px-2">
                                        <div className="content-detail">
                                            <div className="pb-4">
                                                <div className="font-medium text-2xl text-[#4356A2]">Job Title:</div>
                                                <p className="font-normal text-[#131B23] text-lg">Sales Engineer</p>
                                            </div>
                                            <div className="pb-4">
                                                <div className="font-medium text-2xl text-[#4356A2]">Job Location:</div>
                                                <p className="font-normal text-[#131B23] text-lg">Jodhpur, Rajasthan</p>
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
