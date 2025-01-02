import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import config from '~/config';
import { useModal } from './Modalcontext';

const EnquiryDetail = (data: any) => {
    const { product_detail } = data;

    const { openStatusShow } = useModal();
    const fetcher = useFetcher();
    const [btnLoading, setBtnLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setBtnLoading(true);
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        fetcher.submit(formData, { method: "post", action: "/contact" });
    };

    const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

    useEffect(() => {
        // Load reCAPTCHA script dynamically
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            // Once the script is loaded, set recaptchaLoaded to true
            setRecaptchaLoaded(true);
        };
        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (recaptchaLoaded && typeof window.grecaptcha !== "undefined") {
            // Check that grecaptcha is defined before calling render
            const recaptchaContainer = document.getElementById("recaptcha-container1");
            if (recaptchaContainer) {
                // Render the reCAPTCHA widget if grecaptcha is available
                window.grecaptcha.render("recaptcha-container1", {
                    sitekey: config.RECAPTCHA_SITE_KEY, // Replace with your site key
                });
            }
        }
    }, [recaptchaLoaded]);

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
    }, []); // This effect runs only once on mount

    const [c_loading, setLoading] = useState<boolean>(true);
    const [countryCodes, setCountryCodes] = useState<{ dial_code: string, name: string }[]>([]);
    // Fetch country codes from the API
    useEffect(() => {
        const fetchCountryCodes = async () => {
            try {
                // Fetch data from the proxy endpoint in your Remix app
                const response = await fetch('/country-codes');
                const result = await response.json();

                if (result.error) {
                    console.error(result.error);
                    return;
                }

                setCountryCodes(result);
            } catch (error) {
                console.error('Error fetching country codes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCountryCodes();
    }, []);

    useEffect(() => {
        if (fetcher.data) {
            const { status, error, success }: any = fetcher.data || {};
            setBtnLoading(false);

            openStatusShow({ success: success, error: error, status: status });

            if (status && status == '1') {
                window.grecaptcha.reset();
                const form = document.getElementById('enquiry-form1') as HTMLFormElement;
                if (form) form.reset();
            }
        }
    }, [fetcher.data]);
    const [selectedCode, setSelectedCode] = useState<string>('+971');
    const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCode(e.target.value);
    };

    return (
        <>
            <div className="bg-theme font-normal text-white text-xl px-10 py-6 rounded-t-2xl text-center">Tell us your requirement, and we'll send you quotes</div>
            <div className="p-6">
                <form onSubmit={handleSubmit} id="enquiry-form1">
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
                                defaultValue=""
                                id="subject">
                                <option value="">Select Product/Service Name</option>
                                {products.map((product: any, index: any) => (
                                    product_detail?.slug == product.slug ?
                                        <option key={index} selected value={product.title}>{product.title}</option>
                                        :
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
                                <select className="h-[52px] block w-full py-2 pl-4 pr-4 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-l-md outline-none border-r appearance-none"
                                    name="code"
                                    value={selectedCode}
                                    onChange={handleCodeChange}
                                    id="code">
                                    {c_loading ? (
                                        <option value="">Loading...</option>
                                    ) : (
                                        countryCodes.map((country, index) => (
                                            <option key={index} value={country.dial_code}>{country.dial_code}</option>
                                        ))
                                    )}
                                </select>
                                <span className="absolute right-[5px] top-1/2 transform -translate-y-1/2 pointer-events-none">
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
                    <div className="flex flex-col md:flex-row mb-2 md:items-center gap-2">
                        <div id="recaptcha-container1" className="mb-1 md:mb-0"></div>
                        {
                            btnLoading ?
                                <button type="submit" title='Processing' className="n_btn1 bg-[#131B23] text-lg text-white font-medium rounded-md w-full h-[75px] text-center px-2 relative overflow-hidden z-0 transition duration-[800ms] hover:text-theme flex items-center justify-center gap-3" disabled>
                                    <i className="fa fa-spinner animate-spin"></i> <p className="text-lg">Processing...</p>
                                </button>
                                :
                                <button type="submit" title='submit' className="n_btn1 bg-[#131B23] text-lg text-white font-medium rounded-md w-full h-[75px] text-center px-2 relative overflow-hidden z-0 transition duration-[800ms] hover:text-theme">Submit</button>
                        }
                    </div>
                </form>
            </div>
        </>
    );
};

export default EnquiryDetail;


