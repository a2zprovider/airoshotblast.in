import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useActionData, useFetcher } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import config from "~/config";
import { useState } from "react";

export let loader: LoaderFunction = async ({ request }) => {
    const setting = await fetch(config.apiBaseURL + 'setting');
    const settings = await setting.json();

    const full_url = request.url;

    return json({ settings, full_url });
};

export let action: ActionFunction = async ({ request }: { request: Request }) => {
    const formData = new URLSearchParams(await request.text());
    const name = formData.get("name");
    const email = formData.get("email");
    const mobile = `${formData.get("code")} ${formData.get("mobile")}`;
    const message = formData.get("message");
    const captchaToken = formData.get("g-recaptcha-response");

    // Ensure CAPTCHA response exists
    if (!captchaToken) {
        return json({ error: "Please complete the CAPTCHA.", status: 0 });
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

    // Process the form data (you could save to a database or send an email)
    try {
        // Add your custom form processing here (like saving to DB or sending an email)
        console.log("Form submitted:", { name, email, mobile, message });

        const response = await fetch(config.apiBaseURL + 'enquiry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, mobile, message }),
        });

        const data = await response.json();

        if (!response.ok) {
            return json({ error: data.message, status: response.status });
        }

        return json({ success: "Your enquiry has been submitted successfully!", status: 1 });
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
        { name: "og:title", content: seo_details.c_seo_title },
        { name: "og:description", content: seo_details.c_seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
        { name: "og:url", content: full_url },

        // Twitter Card Details
        { name: "twitter:twitter", content: "summary_large_image" },
        { name: "twitter:title", content: seo_details.c_seo_title },
        { name: "twitter:description", content: seo_details.c_seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
    ];
};

export default function Contact() {
    const { settings }: any = useLoaderData();
    const { status, error, success }: any = useActionData() || {};

    return (
        <div className="bg-[#E9F1F7]">
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp;  <div className="text-sm font-normal text-[#4356A2] underline">Contact Us</div>
                    </div>
                    <div className="py-3">
                        <div className="grid lg:grid-cols-2 grid-cols-1 bg-white items-center">
                            <div className="bg-[#4356A2] p-4">
                                <div className="font-medium text-lg text-[#f6f6f6] text-center py-2">Tell us your requirement, and we'll send you quotes</div>
                                {status === 0 && error && <p className="text-md font-bold text-[#B62C2C]">{error}</p>}
                                {status === 1 && success && <p className="text-md font-bold text-[#2cb651]">{success}</p>}

                                <form method="POST" className="mt-4">
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
                                                placeholder="Enter Your Mobile No."
                                                className="flex-1 px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-r-md outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col mb-4">
                                        <label htmlFor="requirement" className="text-white text-lg font-medium">Your Requirement</label>
                                        <textarea name="message" id="" required rows={5} placeholder="Describe Your Requirement in Detail..." className="px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-md outline-none"></textarea>
                                    </div>
                                    <div className="flex flex-row mb-2 items-center gap-2">
                                        <div className="g-recaptcha" data-sitekey={config.RECAPTCHA_SITE_KEY}></div>
                                        <button className="bg-[#131B23] text-lg text-white font-medium rounded-md w-[196px] h-[46px]">Submit</button>
                                    </div>
                                </form>
                            </div>
                            <div className="bg-white text-center px-4 py-8">
                                <div className="text-[#131B23] text-xl text-medium py-2">Get In Touch</div>
                                <p className="text-[#131B23] text-base text-normal">If you have any requirement, you can connect with us. Our customer service representative will send you quote ASAP.</p>
                                <hr className="my-4" />
                                <div className="px-4">
                                    <div className="flex items-center justify-center gap-4 py-3">
                                        <i className="fa fa-map-marker-alt"></i>
                                        <div className="text-[#131B23] text-lg text-normal">{settings.data.address}</div>
                                    </div>
                                    <div className="flex items-center justify-center gap-4 py-3">
                                        <i className="fa fa-phone"></i>
                                        <Link to={'tel:' + settings.data.mobile} className="text-[#131B23] text-lg text-normal">{settings.data.mobile}</Link>
                                    </div>
                                    <div className="flex items-center justify-center gap-4 py-3">
                                        <i className="fa fa-envelope"></i>
                                        <Link to={'mailto:' + settings.data.email} className="text-[#131B23] text-lg text-normal">info@airoshotblast.in</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="py-6">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d752.0959708061051!2d73.07040902438835!3d26.274917651314368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1731482967937!5m2!1sen!2sin" width="100%" height="450" loading="lazy"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

