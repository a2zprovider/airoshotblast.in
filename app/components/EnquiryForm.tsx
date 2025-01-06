import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import config from '~/config';
import { useModal } from './Modalcontext';

const EnquiryForm = () => {
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
            const recaptchaContainer = document.getElementById("recaptcha-container");
            if (recaptchaContainer) {
                // Render the reCAPTCHA widget if grecaptcha is available
                window.grecaptcha.render("recaptcha-container", {
                    sitekey: config.RECAPTCHA_SITE_KEY, // Replace with your site key
                });
            }
        }
    }, [recaptchaLoaded]);

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

    const [selectedCode, setSelectedCode] = useState<string>('+971');
    const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCode(e.target.value);
    };
    return (
        <>
            <form className="mt-4" id="enquiry-form" onSubmit={handleSubmit}>
                <div className="flex flex-col mb-2 py-2">
                    <label htmlFor="name" className="text-white text-lg font-medium py-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Enter Your Name"
                        className="px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B23] rounded-md outline-none"
                    />
                </div>
                <div className="flex flex-col mb-2 py-2">
                    <label htmlFor="email" className="text-white text-lg font-medium py-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                        placeholder="Enter Your E-Mail"
                        className="px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B23] rounded-md outline-none"
                    />
                </div>
                <div className="flex flex-col mb-2 py-2">
                    <label htmlFor="mobile" className="text-white text-lg font-medium py-2">Mobile No.</label>
                    <div className="flex items-center">
                        <div className="relative">
                            <select className="h-[44px] block w-full py-2 pl-4 pr-4 bg-[#fff] text-lg font-medium text-[#131B23] rounded-l-md outline-none border-r appearance-none"
                                name="code"
                                value={selectedCode}
                                onChange={handleCodeChange}
                                id="code">
                                {c_loading ? (
                                    <option value={selectedCode}>{selectedCode}</option>
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
                            placeholder="Enter Your Mobile No."
                            className="flex-1 px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B23] rounded-r-md outline-none"
                        />
                    </div>
                </div>
                <input type="hidden" name="captcha" defaultValue="true" />
                <div className="flex flex-col mb-4 py-2">
                    <label htmlFor="message" className="text-white text-lg font-medium py-2">Your Requirement</label>
                    <textarea name="message" id="" rows={5} placeholder="Describe Your Requirement in Detail..." className="px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B23] rounded-md outline-none"></textarea>
                </div>
                <div className="flex flex-col md:flex-row mb-2 md:items-center gap-2 py-2">
                    <div id="recaptcha-container" className="mb-1 md:mb-0"></div>
                    {
                        btnLoading ?
                            <button type="submit" title='Processing' className="n_btn2 bg-white text-lg text-theme font-medium rounded-md w-full h-[75px] text-center px-2 relative overflow-hidden z-0 transition duration-[800ms] hover:text-[#fff] flex items-center justify-center gap-3" disabled>
                                <i className="fa fa-spinner animate-spin"></i> <p className="text-lg">Processing...</p>
                            </button>
                            :
                            <button type="submit" title='Submit' className="n_btn2 bg-white text-lg text-theme font-medium rounded-md w-full h-[75px] text-center px-2 relative overflow-hidden z-0 transition duration-[800ms] hover:text-[#fff]">Submit</button>
                    }
                </div>
            </form>
        </>
    );
};

export default EnquiryForm;


