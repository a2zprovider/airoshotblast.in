import { useState } from "react";
import config from "~/config";

export default function LeftSideTabs({ settings }: any) {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = ["Company Profile", "Infrastructure & Facilities", "Quality & Compliance"]; // Define your tabs here

    return (
        <div className="flex md:flex-row flex-col gap-2 min-h-screen">
            {/* Sidebar (Tabs) */}
            <div className="md:flex md:w-1/4 ">
                <ul className="space-y-2 w-full">
                    {tabs.map((tab, index) => (
                        <li key={index}>
                            <button
                                className={`w-full text-left font-medium text-lg py-4 px-4 border outline-0 ${activeTab === index
                                    ? "bg-[#4356A2] border-[#4356A2] text-white"
                                    : "text-gray-700 border-[#CCCCCC80]"
                                    }`}
                                onClick={() => setActiveTab(index)}
                            >
                                {tab}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            className="w-full text-left font-medium text-lg py-4 px-4 border outline-0 text-gray-700 border-[#CCCCCC80]"
                            // onClick={() => console.log('Download Brochure')}
                            onClick={() => window.open(config.imgBaseURL + 'setting/brochure/' + settings.data.brochure, "_blank")}
                        >
                            Download Brochure
                        </button>
                    </li>
                </ul>
            </div>

            {/* Content Area */}
            <div className="md:w-3/4">
                <div className="px-2">
                    {activeTab === 0 &&
                        <div className="font-normal text-lg text-justify space-y-4">
                            <p>We are one of the leading manufacturer, supplier, exporter, distributor of Airless Shot blasting Machine- equipment, table, tumble shot blasting machine, spinner hanger shot blast machine, pipe descaling equipment, drum-type cabinet, satellite machine, internal pipe cleaning equipment, plate cleaning, drum-type, stone blasting machine. Pneumatic Operated Equipments -blaster, Shot blasting room System, booth, vacuum blast room.  Spares -blast cabinet gloves, shot blast hose, sand blasting nozzle.</p>
                            <div className="font-medium text-2xl text-[#4356A2]">Shot Blasting Machine Supplier in India</div>
                            <p>Airo Shot Blast Equipments, Jodhpur Rajasthan India. We are among the oldest in the Industry of Shot Blasting, Blast Room System, Vacuum blast machine, table shot blast machine, tumble shot blast Manufacturers in India  The Company commenced production of Shotblasting & Blast Room many years. Since then it has delivered more than 8000 Shot Blasting & table blast equipment, tumble shot-blasting machine. Our Manufacturing Facilities consisting of the workshop is having an 18000 sq. ft. covered area. Airo Shot Blast vision to expand its horizon by entering the export market with international quality products to achieve global recognition.</p>
                            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                                <div>
                                    <div className="font-medium text-2xl text-[#4356A2]">Our Team</div>
                                    <p>A dexterous team of professionals is recruited by us which works round the clock to offer an impeccable spectrum of products & services to the clients. These hard-working, sincere and dedicated employees are masters of their respective fields of specialization. They make excellent use of all the resources to manufacture the products that stand ahead of the clients' expectations. Furthermore, to attain the organizational goals and objectives in an effective and efficient manner, these experts work hard in close proximity with each other. Besides, we arrange training sessions and workshops at regular intervals to enhance the skills & knowledge of our teammates.</p>
                                    <p>We have following members in our workforce:</p>
                                    <ul className="list-disc ml-8">
                                        <li>Engineers & technicians</li>
                                        <li>Quality controllers</li>
                                        <li>Research & development professionals</li>
                                        <li>Warehousing & packaging experts</li>
                                        <li>Sales & marketing executives</li>
                                    </ul>
                                </div>
                                <div>
                                    <img src="/about/1.png" alt="About 1" loading="lazy" className="rounded-lg" />
                                </div>
                            </div>
                            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                                <div>
                                    <img src="/about/2.png" alt="About 2" loading="lazy" className="rounded-lg" />
                                </div>
                                <div>
                                    <div className="font-medium text-2xl text-[#4356A2]">Why Us</div>
                                    We are identified by the patrons in a short span of time owing to our superior quality products. Our ethical business policies and transparency in dealings have enabled us to carve an inexorable niche in the industry. Airo Shot Blast vision to expand its horizon by entering the export market with international quality products to achieve global recognition. Our Manufacturing Facilities consisting of the workshop is having an 18000 sq. ft.Apart from this, varied other cardinal factors that have helped us in becoming the prime choice of our clients are follows:
                                    <ul className="list-disc ml-8">
                                        <li>Multifaceted infrastructure</li>
                                        <li>Experienced workforce</li>
                                        <li>Timely delivery of consignments</li>
                                        <li>Competitive rates</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    }
                    {activeTab === 1 &&
                        <div className="font-normal text-lg text-justify space-y-3">
                            <p>Our Team
                                A dexterous team of professionals is recruited by us which works round the clock to offer an impeccable spectrum of products & services to the clients. These hard-working, sincere and dedicated employees are masters of their respective fields of specialization. They make excellent use of all the resources to manufacture the products that stand ahead of the clients' expectations. Furthermore, to attain the organizational goals and objectives in an effective and efficient manner, these experts work hard in close proximity with each other. Besides, we arrange training sessions and workshops at regular intervals to enhance the skills & knowledge of our teammates.
                                <p>We have following members in our workforce:</p>
                                <ul>
                                    <li>Engineers & technicians</li>
                                    <li>Quality controllers</li>
                                    <li>Research & development professionals</li>
                                    <li>Warehousing & packaging experts</li>
                                    <li>Sales & marketing executives</li>
                                </ul>
                            </p>
                            <div className="font-medium text-2xl text-[#4356A2]">Shot Blasting Machine Supplier in India</div>
                            <p>Airo Shot Blast Equipments, Jodhpur Rajasthan India. We are among the oldest in the Industry of Shot Blasting, Blast Room System, Vacuum blast machine, table shot blast machine, tumble shot blast Manufacturers in India  The Company commenced production of Shotblasting & Blast Room many years. Since then it has delivered more than 8000 Shot Blasting & table blast equipment, tumble shot-blasting machine. Our Manufacturing Facilities consisting of the workshop is having an 18000 sq. ft. covered area. Airo Shot Blast vision to expand its horizon by entering the export market with international quality products to achieve global recognition.</p>
                        </div>
                    }
                    {activeTab === 2 &&
                        <div className="font-normal text-lg text-justify space-y-3">
                            <p>We are one of the leading manufacturer, supplier, exporter, distributor of Airless Shot blasting Machine- equipment, table, tumble shot blasting machine, spinner hanger shot blast machine, pipe descaling equipment, drum-type cabinet, satellite machine, internal pipe cleaning equipment, plate cleaning, drum-type, stone blasting machine. Pneumatic Operated Equipments -blaster, Shot blasting room System, booth, vacuum blast room.  Spares -blast cabinet gloves, shot blast hose, sand blasting nozzle.</p>
                            <div className="font-medium text-2xl text-[#4356A2]">Shot Blasting Machine Supplier in India</div>
                            <p>Airo Shot Blast Equipments, Jodhpur Rajasthan India. We are among the oldest in the Industry of Shot Blasting, Blast Room System, Vacuum blast machine, table shot blast machine, tumble shot blast Manufacturers in India  The Company commenced production of Shotblasting & Blast Room many years. Since then it has delivered more than 8000 Shot Blasting & table blast equipment, tumble shot-blasting machine. Our Manufacturing Facilities consisting of the workshop is having an 18000 sq. ft. covered area. Airo Shot Blast vision to expand its horizon by entering the export market with international quality products to achieve global recognition.</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
