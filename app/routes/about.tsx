import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import LeftSideTabs from "~/components/LeftTabs";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App About" },
        { name: "About description", content: "Welcome to Remix About!" },
    ];
};

export default function About() {
    const data = useLoaderData();
    return (
        <>
            <div className="bg-[#E9F1F7]">
                <div className="container mx-auto">
                    <div className="bg-[#f6f6f6] px-6 py-3">
                        <div className="flex items-center py-2 text-sm font-normal">
                            <Link to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <div className="text-sm font-normal text-[#4356A2] underline">About Us</div>
                        </div>
                        <div className="py-3">
                            <LeftSideTabs />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function ErrorBoundary({ error }: { error: Error }) {
    return (
        <div>
            <h1>Error</h1>
            <p>There was an error: {error ? error.message : ''}</p>
            <Link to="/">Go back to Homepage</Link>
        </div>
    );
}
