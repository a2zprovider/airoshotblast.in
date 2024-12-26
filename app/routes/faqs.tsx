import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import Accordion from "~/components/Accordion";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const full_url = `${url.origin}${url.pathname}`;

    const settingsCacheKey = `settings`;
    const cachedSettings = cache[settingsCacheKey];

    const CACHE_EXPIRATION_TIME = 10 * 60 * 1000;
    setTimeout(() => {
        delete cache[settingsCacheKey];
    }, CACHE_EXPIRATION_TIME);

    let settings;
    if (!cachedSettings) {
        const setting = await fetch(config.apiBaseURL + 'setting');
        if (!setting.ok) {
            throw new Error(`Failed to fetch settings: ${setting.statusText}`);
        }
        settings = await setting.json();
        cache[settingsCacheKey] = settings;
    } else {
        settings = cachedSettings;
    }

    const faq = await fetch(config.apiBaseURL + 'faqs');
    const faqs = await faq.json();

    return json({ faqs, settings, full_url, baseUrl });
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
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:title", content: seo_details.f_seo_title },
        { name: "og:description", content: seo_details.f_seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo_details.f_seo_title },
        { name: "twitter:description", content: seo_details.f_seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
    ];
};

export default function Faqs() {
    const { faqs, full_url, baseUrl }: any = useLoaderData();

    const breadcrumb_schema = {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": 'Faqs',
            "item": full_url
        }]
    }
    return (
        <div className="bg-[#E9F1F799]">
        <head>
            <script type="application/ld+json">{JSON.stringify(breadcrumb_schema)}</script>
        </head>
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
