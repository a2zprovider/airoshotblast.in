import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import Accordion from "~/components/Accordion";
import config from "~/config";

export let loader: LoaderFunction = async ({ request }) => {
    const faq = await fetch(config.apiBaseURL + 'faqs');
    const faqs = await faq.json();

    const setting = await fetch(config.apiBaseURL + 'setting');
    const settings = await setting.json();

    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const full_url = `${url.origin}${url.pathname}`;

    return json({ faqs, settings, full_url });
};

export const meta: MetaFunction = ({ data }) => {
    const { settings, full_url }: any = data;
    const seo_details = JSON.parse(settings.data.seo_details);

    return [
        // Seo Details
        { title: seo_details.f_seo_title },
        { name: "description", content: seo_details.f_seo_description },
        { name: "keywords", content: seo_details.f_seo_keywords },

        // OG Details
        { name: "og:type", content: "website" },
        { name: "og:title", content: seo_details.f_seo_title },
        { name: "og:description", content: seo_details.f_seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
        { name: "og:url", content: full_url },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo_details.f_seo_title },
        { name: "twitter:description", content: seo_details.f_seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },

        // Canonical URL
        { rel: 'canonical', href: full_url },
    ];
};

export default function Faqs() {
    const { faqs }: any = useLoaderData();
    return (
        <div className="bg-[#E9F1F799]">
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link title="Home" to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp;  <div className="text-sm font-normal text-[#4356A2] underline">Faq's</div>
                    </div>
                    <div className="py-3">
                        <Accordion faqs={faqs.data.data} />
                    </div>
                </div>
            </div>
        </div>
    );
}
