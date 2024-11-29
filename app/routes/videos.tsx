import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App Video" },
        { name: "Video description", content: "Welcome to Remix Video!" },
    ];
};

export default function Videos() {
    // const data = useLoaderData();
    const videos = [
        { id: 1, name: 'Video 1', imageUrl: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Video 2', imageUrl: 'https://via.placeholder.com/150' },
        { id: 3, name: 'Video 3', imageUrl: 'https://via.placeholder.com/150' },
        { id: 4, name: 'Video 4', imageUrl: 'https://via.placeholder.com/150' },
        { id: 5, name: 'Video 5', imageUrl: 'https://via.placeholder.com/150' },
        { id: 6, name: 'Video 6', imageUrl: 'https://via.placeholder.com/150' },
    ];
    return (
        <div className="bg-[#E9F1F7]">
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp;  <div className="text-sm font-normal text-[#4356A2] underline">Videos</div>
                    </div>
                    <div className="py-3">
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
                            {videos.map((video: any) => (
                                <div key={video.id}>
                                    <iframe className="w-full h-48 shadow-md" src="https://www.youtube.com/embed/LDWDr4uCk8I?si=qzGW-lSpZrhpkXDE" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}