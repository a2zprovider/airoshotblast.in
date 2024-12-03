import { useFetcher } from '@remix-run/react';
import { useModal } from './Modalcontext';
import { useEffect, useState } from 'react';
import config from '~/config';

const Enquiry = () => {
    const { isEnquiryOpen, modalEnquiryData, closeEnquiry } = useModal();

    const fetcher = useFetcher();
    const [status, setStatus] = useState();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        fetcher.submit(formData, { method: "post", action: "/contact" });
    };

    useEffect(() => {
        if (fetcher.data) {
            const { status, error, success }: any = fetcher.data || {};
            console.log('fetcher.data : ', fetcher.data);
            setStatus(status);
            setError(error);
            setSuccess(success);
        }
    }, [fetcher.data]);

    if (!isEnquiryOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
            onClick={closeEnquiry}>
            {/* Modal Content */}
            <div
                className="bg-[#E9F1F7] rounded-2xl animate-modalIn transform transition-all duration-500 ease-out translate-y-0 opacity-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing on content click
            >
                <div className="">
                    <button
                        className="absolute top-1 right-3 text-4xl text-white-500 hover:text-white-700"
                        onClick={closeEnquiry}
                    >
                        &times; {/* Close button (X) */}
                    </button>
                    <div className="bg-[#4356A2] font-normal text-white text-xl px-10 py-6 rounded-t-2xl">Tell us your requirement, and we'll send you quotes</div>
                    <div className="p-6">
                        {status == '0' && error && <p className="text-md font-bold text-[#B62C2C]">{error}</p>}
                        {status == '1' && success && <p className="text-md font-bold text-[#2cb651]">{success}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col mb-2">
                                <label htmlFor="name" className="text-[#131B23] text-lg font-medium">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Enter Your Name"
                                    className="px-3 py-3 bg-[#fff] text-lg font-medium text-[#D9D9D9] rounded-md outline-none shadow-md"
                                />
                            </div>
                            <div className="flex flex-col mb-2">
                                <label htmlFor="product" className="text-[#131B23] text-lg font-medium">I Want Quotes For</label>
                                <div className="relative">
                                    <select className="h-[52px] block w-full py-2 pl-4 pr-10 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-l-md outline-none border-r appearance-none"
                                        name="subject"
                                        required
                                        defaultValue="0"
                                        id="subject">
                                        <option value="0">Select Product/Service Name</option>
                                        <option value="Steel Shots">Steel Shots</option>
                                        <option value="Sand Blasting">Sand Blasting</option>
                                        <option value="Portable Sand Blasting Machine">Portable Sand Blasting Machine</option>
                                    </select>
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col mb-2">
                                <label htmlFor="mobile" className="text-[#131B23] text-lg font-medium">Mobile No.</label>
                                <div className="flex items-center shadow-md">
                                    <div className="relative">
                                        <select className="h-[52px] block w-full py-2 pl-4 pr-10 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-l-md outline-none border-r appearance-none"
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
                                        className="flex-1 px-3 py-3 bg-[#fff] text-lg font-medium text-[#D9D9D9] rounded-r-md outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col mb-4">
                                <label htmlFor="message" className="text-[#131B23] text-lg font-medium">Additional Detail</label>
                                <textarea name="message" required id="" rows={5} placeholder="Additional Details About Your Requirement...." className="px-3 py-3 bg-[#fff] text-lg font-medium text-[#D9D9D9] rounded-md outline-none shadow-md"></textarea>
                            </div>
                            <div className="flex flex-row mb-2 items-center gap-2">
                                <div className="g-recaptcha" data-sitekey={config.RECAPTCHA_SITE_KEY}></div>
                                <button type="submit" className="bg-[#131B23]  text-lg text-white font-medium rounded-md px-3  h-[46px] shadow-md">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Enquiry;


