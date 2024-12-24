import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, NavLink, useFetcher } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import config from "~/config";
import { useEffect, useState } from "react";
import { useModal } from "~/components/Modalcontext";

export let loader: LoaderFunction = async ({ request }) => {
    const setting = await fetch(config.apiBaseURL + 'setting');
    const settings = await setting.json();

    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const full_url = `${url.origin}${url.pathname}`;

    return json({ settings, full_url });
};

export let action: ActionFunction = async ({ request }: { request: Request }) => {
    const formData = new URLSearchParams(await request.text());

    const name = formData.get("name");
    const email = formData.get("email");
    const mobile = `${formData.get("code")} ${formData.get("mobile")}`;
    const message = formData.get("message");
    const subject = formData.get("subject");
    const captcha = formData.get("captcha");
    const captchaToken = formData.get("g-recaptcha-response");

    if (captcha == 'true') {
        // Ensure CAPTCHA response exists
        if (!captchaToken) {
            return json({ error: "Please fill the CAPTCHA.", status: 0 });
        }
        // Verify CAPTCHA
        const captchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            body: new URLSearchParams({
                secret: config.RECAPTCHA_SECRET_KEY,
                response: captchaToken,
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const captchaResult = await captchaResponse.json();
        if (!captchaResult.success) {
            return json({ error: "CAPTCHA validation failed. Please try again.", status: 0 });
        }
    }

    try {
        const response = await fetch(config.apiBaseURL + 'enquiry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, mobile, subject, message }),
        });

        const data = await response.json();
        if (response.status) {
            return json({ success: data.message, status: 1 });
        }
        return json({ error: data.message, status: 0 });

    } catch (error) {
        return json({ error: "Failed to submit the form. Please try again later.", status: 0 });
    }
};

export const meta: MetaFunction = ({ data }) => {
    const { settings, full_url }: any = data;
    const seo_details = JSON.parse(settings.data.seo_details);
    return [
        // Seo Details
        { title: seo_details.c_seo_title },
        { name: "description", content: seo_details.c_seo_description },
        { name: "keywords", content: seo_details.c_seo_keywords },

        // OG Details
        { name: "og:type", content: "website" },
        { name: "og:title", content: seo_details.c_seo_title },
        { name: "og:description", content: seo_details.c_seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
        { name: "og:url", content: full_url },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo_details.c_seo_title },
        { name: "twitter:description", content: seo_details.c_seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },

        // Canonical URL
        { rel: 'canonical', href: full_url },
    ];
};

export default function Contact() {
    const { openStatusShow } = useModal();
    const { settings }: any = useLoaderData();

    const [btnLoading, setBtnLoading] = useState(false);
    const fetcher = useFetcher();

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

    return (
        <div className="bg-[#E9F1F799]">
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link title="Home" to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp;  <div className="text-sm font-normal text-[#4356A2] underline">Contact Us</div>
                    </div>
                    <div className="py-3">
                        <div className="grid lg:grid-cols-2 grid-cols-1 bg-white items-center">
                            <div className="bg-[#4356A2] p-4">
                                <div className="font-medium text-lg text-[#f6f6f6] text-center py-2">Tell us your requirement, and we'll send you quotes</div>

                                <form onSubmit={handleSubmit} id="enquiry-form" className="mt-4">
                                    <div className="flex flex-col mb-2">
                                        <label htmlFor="name" className="text-white text-lg font-medium">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Enter Your Name"
                                            className="px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-md outline-none"
                                        />
                                    </div>
                                    <input type="hidden" name="captcha" defaultValue="true" />
                                    <div className="flex flex-col mb-2">
                                        <label htmlFor="email" className="text-white text-lg font-medium">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                            placeholder="Enter Your E-Mail"
                                            className="px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-md outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col mb-2">
                                        <label htmlFor="mobile" className="text-white text-lg font-medium">Mobile No.</label>
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <select className="h-[44px] block w-full py-2 pl-4 pr-4 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-l-md outline-none border-r appearance-none"
                                                    name="code"
                                                    defaultValue=""
                                                    id="code">
                                                    {c_loading ? (
                                                        <option value="">Loading...</option>
                                                    ) : (
                                                        countryCodes.map((country, index) => (
                                                            country.dial_code == '+91' ?
                                                                <option key={index} selected value={country.dial_code}>{country.dial_code}</option>
                                                                :
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
                                                className="flex-1 px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-r-md outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col mb-4">
                                        <label htmlFor="requirement" className="text-white text-lg font-medium">Your Requirement</label>
                                        <textarea name="message" id="" required rows={5} placeholder="Describe Your Requirement in Detail..." className="px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-md outline-none"></textarea>
                                    </div>
                                    <div className="flex flex-col md:flex-row mb-2 md:items-center gap-2">
                                        <div id="recaptcha-container" className="mb-1 md:mb-0"></div>
                                        {
                                            btnLoading ?
                                                <button type="submit" title="Processing" className="n_btn1 bg-[#131B23] text-lg text-white font-medium rounded-md w-full h-[75px] text-center px-2 relative overflow-hidden z-0 transition duration-[800ms] hover:text-[#4356A2] flex items-center justify-center gap-3" disabled>
                                                    <i className="fa fa-spinner animate-spin"></i> <p className="text-lg">Processing...</p>
                                                </button>
                                                :
                                                <button type="submit" title="Submit" className="n_btn1 bg-[#131B23] text-lg text-white font-medium rounded-md w-full h-[75px] text-center px-2 relative overflow-hidden z-0 transition duration-[800ms] hover:text-[#4356A2]">Submit</button>
                                        }
                                    </div>
                                </form>
                            </div>
                            <div className="bg-white text-center px-4 py-8">
                                <div className="text-[#131B23] text-xl font-medium py-2">Get In Touch</div>
                                <p className="text-[#131B23] text-base text-normal">If you have any requirement, you can connect with us. Our customer service representative will send you quote ASAP.</p>
                                <hr className="my-4" />
                                <div className="px-4">
                                    <div className="flex items-center justify-center gap-4 py-3">
                                        <i className="fa fa-map-marker-alt"></i>
                                        <div className="text-[#131B23] text-lg text-normal">{settings.data.address}</div>
                                    </div>
                                    <div className="flex items-center justify-center gap-4 py-3">
                                        <i className="fa fa-phone rotate-90"></i>
                                        <Link title="Call Us" to={'tel:' + settings.data.mobile} className="text-[#131B23] text-lg text-normal">{settings.data.mobile}</Link>
                                    </div>
                                    <div className="flex items-center justify-center gap-4 py-3">
                                        <i className="fa fa-envelope"></i>
                                        <Link title="Mail Us" to={'mailto:' + settings.data.email} className="text-[#131B23] text-lg text-normal">{settings.data.email}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="py-6">
                            <div dangerouslySetInnerHTML={{ __html: settings.data.map }} ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

