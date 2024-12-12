import { useFetcher } from '@remix-run/react';
import { useModal } from './Modalcontext';
import { useEffect, useRef, useState } from 'react';
import config from '~/config';

const Enquiry = () => {
    const { isEnquiryOpen, modalEnquiryData, closeEnquiry, openStatusShow } = useModal();

    const [btnLoading, setBtnLoading] = useState(false);
    const [isReCaptchaReady, setIsReCaptchaReady] = useState(false);
    const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
    const recaptchaContainerRef = useRef(null); // Ref to track the reCAPTCHA container
    const [recaptchaInitialized, setRecaptchaInitialized] = useState(false); // To track if reCAPTCHA has been initialized

    useEffect(() => {
        // Dynamically load reCAPTCHA script only once
        const loadRecaptchaScript = () => {
            if (typeof window !== 'undefined' && !recaptchaLoaded) {
                const script = document.createElement('script');
                script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
                script.async = true;
                script.defer = true;

                script.onload = () => {
                    setRecaptchaLoaded(true);  // Mark reCAPTCHA script as loaded
                };

                document.head.appendChild(script);
            }
        };

        loadRecaptchaScript();

        return () => {
            // Cleanup the script if the component is unmounted or modal is closed
            setRecaptchaLoaded(false);
        };
    }, [recaptchaLoaded]);

    useEffect(() => {
        if (recaptchaLoaded && !recaptchaInitialized && recaptchaContainerRef.current) {
            // Check if the reCAPTCHA has already been initialized
            window.grecaptcha.render(recaptchaContainerRef.current, {
                sitekey: config.RECAPTCHA_SITE_KEY,
                callback: handleReCaptchaChange,
            });
            setRecaptchaInitialized(true); // Mark reCAPTCHA as initialized
        }
    }, [recaptchaLoaded, recaptchaInitialized]);

    const handleReCaptchaChange = (value: string) => {
        console.log("Captcha value:", value); // You can use this value to verify with your backend
    };

    useEffect(() => {
        if (recaptchaLoaded) {
            setIsReCaptchaReady(true);  // Mark reCAPTCHA ready to be used
        }
    }, [recaptchaLoaded]);

    const fetcher = useFetcher();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setBtnLoading(true);
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        fetcher.submit(formData, { method: "post", action: "/contact" });
    };

    const [products, setProducts] = useState<any[]>([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const product = await fetch(config.apiBaseURL + 'products?limit=10000');
                const products = await product.json();

                setProducts(products.data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (fetcher.data) {
            const { status, error, success }: any = fetcher.data || {};
            setBtnLoading(false);

            openStatusShow({ success: success, error: error, status: status });

            if (status && status == '1') {
                window.grecaptcha.reset();
                const form = document.getElementById('enquiry-form') as HTMLFormElement;
                if (form) form.reset();
            }
        }
    }, [fetcher.data]);

    if (!isEnquiryOpen) return null; // Don't render the modal if it's not open
    // console.log('modalEnquiryData : ', modalEnquiryData);

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
                        <form onSubmit={handleSubmit} id="enquiry-form">
                            <div className="flex flex-col mb-2">
                                <label htmlFor="name" className="text-[#131B23] text-lg font-medium">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required autoComplete="off"
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
                                        {products.map((product: any, index: any) => (
                                            <option key={index} value={product.title}>{product.title}</option>
                                        ))}
                                    </select>
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <input type="hidden" name="captcha" defaultValue="true" />
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
                                        pattern="^\+?\d{10,15}$"
                                        required
                                        autoComplete="off"
                                        placeholder="Enter Your Mobile No."
                                        className="flex-1 px-3 py-3 bg-[#fff] text-lg font-medium text-[#D9D9D9] rounded-r-md outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col mb-4">
                                <label htmlFor="message" className="text-[#131B23] text-lg font-medium">Additional Detail</label>
                                <textarea name="message" required id="" autoComplete="off" rows={5} placeholder="Additional Details About Your Requirement...." className="px-3 py-3 bg-[#fff] text-lg font-medium text-[#D9D9D9] rounded-md outline-none shadow-md"></textarea>
                            </div>
                            <div className="flex flex-row mb-2 items-center gap-2">
                                {isReCaptchaReady ? (
                                    <div ref={recaptchaContainerRef}></div> // reCAPTCHA will be rendered here
                                ) : (
                                    <p>Loading reCAPTCHA...</p>
                                )}
                                <div className="g-recaptcha" data-sitekey={config.RECAPTCHA_SITE_KEY}></div>
                                {
                                    btnLoading ?
                                        <button type="submit" className="bg-[#131B23] text-lg text-white font-medium rounded-md w-full h-[75px] text-center px-2 flex items-center justify-center gap-3" disabled>
                                            <i className="fa fa-spinner animate-spin"></i> <p className="text-lg">Processing...</p>
                                        </button>
                                        :
                                        <button type="submit" className="bg-[#131B23] text-lg text-white font-medium rounded-md w-full h-[75px] text-center px-2">Submit</button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Enquiry;


