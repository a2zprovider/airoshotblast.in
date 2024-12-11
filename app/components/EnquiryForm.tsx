import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import config from '~/config';
import { useModal } from './Modalcontext';

const EnquiryForm = () => {
    const { openStatusShow } = useModal();
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
            setStatus(status);
            setError(error);
            setSuccess(success);

            openStatusShow({ success: success, error: error, status: status });

            if (status && status == '1') {
                const form = document.getElementById('enquiry-form') as HTMLFormElement;
                if (form) form.reset();
            }
        }
    }, [fetcher.data]);

    return (
        <>
            <form className="mt-4" id="enquiry-form" onSubmit={handleSubmit}>
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
                            pattern="^\+?\d{10,15}$"
                            placeholder="Enter Your Mobile No."
                            className="flex-1 px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-r-md outline-none"
                        />
                    </div>
                </div>
                <input type="hidden" name="captcha" defaultValue="true" />
                <div className="flex flex-col mb-4">
                    <label htmlFor="message" className="text-white text-lg font-medium">Your Requirement</label>
                    <textarea name="message" id="" rows={5} placeholder="Describe Your Requirement in Detail..." className="px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-md outline-none"></textarea>
                </div>
                <div className="flex flex-row mb-2 items-center gap-2">
                    <div className="g-recaptcha" data-sitekey={config.RECAPTCHA_SITE_KEY}></div>
                    <button type="submit" className="bg-white text-lg text-[#4356A2] font-medium rounded-md w-[196px] h-[46px]">Submit</button>
                </div>
            </form>
        </>
    );
};

export default EnquiryForm;


