import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import config from "~/config";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App Video" },
        { name: "Video description", content: "Welcome to Remix Video!" },
    ];
};
export let loader: LoaderFunction = async () => {
    const video = await fetch(config.apiBaseURL + 'video');
    const videos = await video.json();

    return json({ videos });
};

export default function Videos() {
    const { videos }: any = useLoaderData();

    return (
        <div className="bg-[#E9F1F799]">
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp;  <div className="text-sm font-normal text-[#4356A2] underline">Videos</div>
                    </div>
                    <div className="py-3">
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
                            {videos.data.data.map((video: any, index: any) => (
                                <div key={index} >
                                    <Link to={'https://www.youtube.com/watch?v=' + video.url} target="_blank" className="relative">
                                        <img src={'https://i.ytimg.com/vi/' + video.url + '/hqdefault.jpg'} alt={video.title} className="shadow-md rounded" />
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                                            <span className="relative flex h-[40px] w-[40px]">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex items-center justify-center rounded-full h-[40px] w-[40px]">
                                                    <i className="fab fa-youtube text-[30px] text-red-500 hover:text-red-600"></i>
                                                </span>
                                            </span>
                                        </div>
                                    </Link>
                                    <div className="mt-2">
                                        <Link to={'https://www.youtube.com/watch?v=' + video.url} target="_blank" className="font-normal text-lg line-clamp-1">{video.title}</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}