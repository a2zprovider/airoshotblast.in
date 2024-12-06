import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import Accordion from "~/components/Accordion";
import config from "~/config";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App Faq" },
        { name: "Faq description", content: "Welcome to Remix Faq!" },
    ];
};

export let loader: LoaderFunction = async () => {
    const faq = await fetch(config.apiBaseURL + 'faqs');
    const faqs = await faq.json();

    return json({ faqs });
};

export default function Faqs() {
    const { faqs }: any = useLoaderData();
    return (
        <div className="bg-[#E9F1F799]">
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp;  <div className="text-sm font-normal text-[#4356A2] underline">Faq's</div>
                    </div>
                    <div className="py-3">
                        <Accordion faqs={faqs.data.data} />
                    </div>
                </div>
            </div>
        </div>
    );
}
