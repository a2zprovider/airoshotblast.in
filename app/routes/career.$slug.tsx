import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, NavLink, useFetcher, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useModal } from "~/components/Modalcontext";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const full_url = `${url.origin}${url.pathname}`;

    const settingsCacheKey = `settings`;
    const cachedSettings = cache[settingsCacheKey];

    const CACHE_EXPIRATION_TIME = 10 * 60 * 1000;
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
    
    const page = await fetch(config.apiBaseURL + 'pages?limit=100&parent=null');
    const pages = await page.json();

    const career = await fetch(config.apiBaseURL + 'career/' + params.slug);
    const careers = await career.json();

    const slug = "careers";

    return json({ pages, settings, full_url, slug, careers });
};

export const meta: MetaFunction = ({ data }) => {
    const { careers, settings, full_url }: any = data;
    return [
        // Seo Details
        { title: careers.data.seo_title },
        { name: "description", content: careers.data.seo_description },
        { name: "keywords", content: careers.data.seo_keywords },

        // OG Details
        { name: "og:type", content: "article" },
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:title", content: careers.data.title },
        { name: "og:description", content: careers.data.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: careers.data.title },
        { name: "twitter:description", content: careers.data.seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
    ];
};

export default function CareerDetail() {
    const { slug, pages, settings, full_url, careers }: any = useLoaderData();
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
                                                <p className="font-normal text-[#131B23] text-lg">{careers.data.address}</p>
                                            </div>
                                            <div className="pb-4">
                                                <div className="font-medium text-2xl text-[#4356A2]">Job Overview:</div>
                                                <p className="content-detailsfont-normal text-[#131B23] text-lg text-justify">
                                                    <div dangerouslySetInnerHTML={{ __html: careers.data.description }} ></div>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-4 border rounded-md">
                                            <form onSubmit={handleSubmit} className="flex items-center justify-between flex-col md:flex-row">
                                                <input type="hidden" name="career" defaultValue={careers.data._id} />
                                                <span className="flex flex-col md:flex-row items-center gap-2">
                                                    <input type="file" name="resume" id="resume" className="hidden" placeholder="" onChange={handleFileChange} />
                                                    <label htmlFor="resume" className="flex items-center bg-[#4356A2] text-[#F6F6F6] font-medium text-xl py-2 px-3 rounded-[10px] gap-2"><i className="fa fa-upload"></i><div className="text-xl">Upload Resume</div></label>
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
            </div>
        </>
    );
}
