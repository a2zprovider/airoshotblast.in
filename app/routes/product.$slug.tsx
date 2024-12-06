import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useFetcher, useParams } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useModal } from "~/components/Modalcontext";
import ProductSlider from "~/components/ProductSlider";
import config from "~/config";

export let loader: LoaderFunction = async ({ request, params }) => {

    const product_detail = await fetch(config.apiBaseURL + 'product/' + params.slug);
    const product = await product_detail.json();

    const full_url = request.url;

    return json({ product, full_url });
};

export const meta: MetaFunction = ({ data }) => {
    const { product, full_url }: any = data;

    return [
        // Seo Details
        { title: product.data.seo_title },
        { name: "description", content: product.data.seo_description },
        { name: "keywords", content: product.data.seo_keywords },

        // OG Details
        { name: "og:title", content: product.data.title },
        { name: "og:description", content: product.data.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'product/' + product.data.image },
        { name: "og:url", content: full_url },

        // Twitter Card Details
        { name: "twitter:twitter", content: "summary_large_image" },
        { name: "twitter:title", content: product.data.title },
        { name: "twitter:description", content: product.data.seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'product/' + product.data.image },
    ];
};

export default function ProductSingle() {
    const { product }: any = useLoaderData();

    const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Track the selected image
    const handleThumbnailClick = (index: any) => {
        setSelectedImageIndex(index);
    };

    const handleNext = () => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setSelectedImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const [activeTab, setActiveTab] = useState(0);

    const [btnLoading, setBtnLoading] = useState(false);

    const tabs = ["Additional Information", "Applications", "Product Description"]; // Define your tabs here

    const images = [];
    images.push(`${config.imgBaseURL}product/${product.data.image}`);
    const imgs: [string] = JSON.parse(product.data.images);
    imgs.forEach(img => {
        images.push(`${config.imgBaseURL}product/imgs/${img}`);
    });

    const { openStatusShow } = useModal();
    const fetcher = useFetcher();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setBtnLoading(true);
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        fetcher.submit(formData, { method: "post", action: "/contact" });
    };

    useEffect(() => {
        if (fetcher.data) {
            const { status, error, success }: any = fetcher.data || {};

            openStatusShow({ success: success, error: error, status: status });
            setBtnLoading(false);

            if (status && status == '1') {
                const form = document.getElementById('enquiry-form') as HTMLFormElement;
                if (form) form.reset();
            }
        }
    }, [fetcher.data]);

    return (
        <>
            <div className="bg-[#E9F1F799]">
                <div className="container mx-auto">
                    <div className="bg-[#f6f6f6] px-6 py-3">
                        <div className="flex items-center py-2 text-sm font-normal">
                            <Link to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <Link to="/products" className="text-sm font-normal text-[#131B23]">Machines & Abrasives</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <div className="text-sm font-normal text-[#4356A2] underline">{product.data.title}</div>
                        </div>
                        <div className="py-2">
                            <div>
                                <div className="flex lg:flex-row flex-col gap-2">
                                    <div className="lg:w-[50%] py-1">
                                        <div>
                                            <div className="relative">
                                                <div className="flex justify-center">
                                                    <img
                                                        src={images[selectedImageIndex]}
                                                        alt={`.images Image ${selectedImageIndex + 1}`} loading="lazy"
                                                        className="h-[425px] width-full object-contain rounded-2xl"
                                                    />
                                                </div>
                                                {/* Prev/Next Buttons */}
                                                <button
                                                    onClick={handlePrev}
                                                    className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-500 rounded-full text-white px-4 py-[1px] landing-0"
                                                >
                                                    <i className="fa fa-chevron-left"></i>
                                                </button>
                                                <button
                                                    onClick={handleNext}
                                                    className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-500 rounded-full text-white px-4 py-[1px] landing-0"
                                                >
                                                    <i className="fa fa-chevron-right"></i>
                                                </button>
                                            </div>

                                            <div className="flex mt-4 space-x-2 justify-center">
                                                {images.map((image: any, index: any) => (
                                                    <div
                                                        key={index}
                                                        className={`w-[100px] h-[100px] cursor-pointer rounded-xl overflow-hidden border-2 ${selectedImageIndex === index
                                                            ? "border-blue-500"
                                                            : "border-transparent"
                                                            }`}
                                                        onClick={() => handleThumbnailClick(index)}
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={`Thumbnail ${index + 1}`} loading="lazy"
                                                            className="w-[100px] h-[100px] object-cover"
                                                        />

                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:w-[50%] py-1">
                                        <div className="text-3xl text-[#131B23] font-normal">{product.data.title}</div>
                                        <div className="text-2xl text-[#BF0707] font-normal py-2">₹ {product.data.price}</div>
                                        <div>
                                            <div className="text-[#131B23] bg-[#DEE5FD] text-2xl font-normal py-3 text-center border-t-[3px] border-[#131B23]">Technical Specification</div>
                                            <div className="p-4">
                                                {JSON.parse(product.data.field).name.map((f: any, index: any) => (
                                                    <div className="grid grid-cols-2">
                                                        <div>{f} :</div>
                                                        <div>{JSON.parse(product.data.field).value[index]}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-[#00539C] p-4">
                                            <div className="text-[#F6F6F6] text-2xl font-medium">Request Urgent Quote</div>
                                            <form className="mt-4 flex flex-col md:flex-row gap-4" id="enquiry-form" onSubmit={handleSubmit}>
                                                <div className="flex items-center">
                                                    <div className="relative">
                                                        <select className="h-[44px] block w-full py-2 pl-4 pr-10 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-l-md outline-none border-r appearance-none"
                                                            name="code"
                                                            defaultValue="+91"
                                                            id="code">
                                                            <option value="+91">+91</option>
                                                            <option value="+1">+1</option>
                                                            <option value="+001">+001</option>
                                                        </select>
                                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="mobile"
                                                        name="mobile"
                                                        required
                                                        placeholder="Enter Your Mobile No."
                                                        className="flex-1 px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-r-md outline-none"
                                                    />
                                                </div>
                                                <input type="hidden" name="message" defaultValue={product.data.title} />
                                                <input type="hidden" name="captcha" defaultValue="false" />
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    placeholder="Qty"
                                                    className="px-3 py-2 md:w-[100px] w-[100%] bg-[#fff] text-lg font-medium text-[#131B234D] rounded-md outline-none"
                                                />
                                                {
                                                    btnLoading ?
                                                        <button type="submit" className="px-3 py-2 bg-[#131B23] text-lg text-white font-medium rounded-md h-[44px] gap-4" disabled>
                                                            <i className="fa fa-spinner animate-spin"></i> <span className="text-lg">Processing...</span>
                                                        </button>
                                                        :
                                                        <button type="submit" className="px-3 py-2 bg-[#131B23] text-lg text-white font-medium rounded-md h-[44px] gap-4">
                                                            <i className="fa fa-paper-plane"></i> &nbsp; <span className="text-lg">Send Now</span>
                                                        </button>
                                                }
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="py-10">
                                {/* Topbar (Tabs) */}
                                <div>
                                    <ul className="flex items-center justify-between w-full">
                                        {tabs.map((tab, index) => (
                                            <li key={index} className="w-full">
                                                <button
                                                    className={`w-full font-normal text-2xl py-4 px-4 border-t-[3px] border-[#131B23] outline-0  bg-[#DEE5FD] ${activeTab === index
                                                        ? "text-[#4356A2]"
                                                        : "text-[#131B23]"
                                                        }`}
                                                    onClick={() => setActiveTab(index)}
                                                >
                                                    <span className={activeTab === index ? "border-b-[3px] border-[#4356A2] py-4 px-2" : ""}>{tab}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Content Area */}
                                <div className="">
                                    <div className="px-2">
                                        {activeTab === 0 &&
                                            <div className="content-details font-normal text-lg text-justify space-y-4 px-3 py-8">
                                                <table className="w-full">
                                                    <tbody>
                                                        {JSON.parse(product.data.field1).name.map((f1: any, index: any) => (
                                                            <tr className="bg-[#f1f1f1]">
                                                                <td className="px-4 py-2">{f1} : </td>
                                                                <td className="px-4 py-2">{JSON.parse(product.data.field1).value[index]}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        }
                                        {activeTab === 1 &&
                                            <div className="content-details applications font-normal text-lg text-justify space-y-4 px-3 py-8">
                                                <p>
                                                    <div dangerouslySetInnerHTML={{ __html: product.data.application }} ></div>
                                                </p>
                                            </div>
                                        }
                                        {activeTab === 2 &&
                                            <div className="content-details font-normal text-lg text-justify space-y-4 px-3 py-8">
                                                <p>
                                                    <div dangerouslySetInnerHTML={{ __html: product.data.description }} ></div>
                                                </p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <hr />
                            {product.relatedProducts.length ?
                                <div className="py-4">
                                    <div className="text-2xl font-normal text-[#131B23]">Related Products</div>
                                    <div>
                                        <ProductSlider products={product.relatedProducts} />
                                    </div>
                                </div>
                                :
                                <></>}

                            {/* {product.relatedProducts.length ?
                                <div className="py-4">
                                    <div className="text-2xl font-normal text-[#131B23]">Related Blogs</div>
                                    <div>
                                        <BlogSlider blogs={blogs} />
                                    </div>
                                </div>
                                :
                                <></>} */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function ErrorBoundary({ error }: { error: Error }) {

    return (
        <div>
            <h1>Error</h1>
            <p>There was an error: {error ? error.message : ''}</p>
            <Link to="/">Go back to Homepage</Link>
        </div>
    );
}
