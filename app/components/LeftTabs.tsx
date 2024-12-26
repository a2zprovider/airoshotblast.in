import { useEffect, useState } from "react";
import config from "~/config";

export default function LeftSideTabs({ settings }: any) {
    const [activeTab, setActiveTab] = useState(0);

    const [pages, setPages] = useState<any[]>([]);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const page = await fetch(config.apiBaseURL + 'pages?parent=about-us');
                const pages = await page.json();
                setPages(pages.data.data);
            } catch (error) {
                console.error('Error fetching pages:', error);
            }
        };

        fetchPages();
    }, []);

    return (
        <div className="flex lg:flex-row flex-col gap-2 min-h-screen">
            {/* Sidebar (Tabs) */}
            <div className="lg:flex lg:w-1/4 ">
                <ul className="space-y-2 w-full">
                    {pages.map((page, index) => (
                        <li key={index}>
                            <button
                                className={`w-full text-left font-medium text-lg py-4 px-4 border outline-0 ${activeTab === index
                                    ? "bg-[#4356A2] border-[#4356A2] text-white"
                                    : "text-gray-700 border-[#CCCCCC80]"
                                    }`}
                                title={page.title}
                                onClick={() => setActiveTab(index)}
                            >
                                {page.title}
                            </button>
                        </li>
                    ))}
                    {settings.data.brochure ?
                        <li>
                            <button
                                className="w-full text-left font-medium text-lg py-4 px-4 border outline-0 text-gray-700 border-[#CCCCCC80]"
                                // onClick={() => console.log('Download Brochure')}
                                title="Download Brochure"
                                onClick={() => window.open(config.imgBaseURL + 'setting/brochure/' + settings.data.brochure, "_blank")}
                            >
                                Download Brochure
                            </button>
                        </li>
                        : ''
                    }
                </ul>
            </div>

            {/* Content Area */}
            <div className="lg:w-3/4">
                <div className="px-2">
                    {pages.map((page, index) => (
                        activeTab === index &&
                        <div key={index} className="content-details font-normal text-lg text-justify space-y-4">
                            <div dangerouslySetInnerHTML={{ __html: page.description }} ></div>
                            {page.field && JSON.parse(page.field).title.map((f: any, i: any) => (
                                <div key={i} className={`grid ${JSON.parse(page.field).image[i] ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} grid-cols-1 gap-4`}>
                                    <>
                                        <div className={i % 2 === 0 ? 'flex-1 order-1' : 'flex-1 order-1 lg:order-2'}>
                                            <div className="font-medium text-2xl text-[#4356A2]">{f}</div>
                                            <div dangerouslySetInnerHTML={{ __html: JSON.parse(page.field).description[i] }} ></div>
                                        </div>
                                        <div className={i % 2 === 0 ? 'flex-1 order-2' : 'flex-1 order-2 lg:order-1'}>
                                            {
                                                JSON.parse(page.field).image[i] ?
                                                    <img src={config.imgBaseURL + `/page/other/${JSON.parse(page.field).image[i]}`} alt={f} loading="lazy" className="rounded-lg border-x-[4px] border-[#4356A2] w-full" />
                                                    : ''
                                            }
                                        </div>
                                    </>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

