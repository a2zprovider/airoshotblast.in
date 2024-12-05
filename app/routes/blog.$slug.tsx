import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import config from "~/config";

export let loader: LoaderFunction = async ({ request, params }) => {
    

    const blog_detail = await fetch(config.apiBaseURL +'blog/' + params.slug);
    const blog = await blog_detail.json();

    const tag = await fetch(config.apiBaseURL +'tags');
    const tags = await tag.json();

    const recent_blog = await fetch(config.apiBaseURL +'blogs?limit=5');
    const recent_blogs = await recent_blog.json();

    const blogcategory = await fetch(config.apiBaseURL +'blogcategory');
    const blogcategories = await blogcategory.json();

    const full_url = request.url;

    return json({ blog, full_url, tags, blogcategories, recent_blogs });
};

export const meta: MetaFunction = ({ data }) => {
    const { blog, full_url }: any = data;
    return [
        // Seo Details
        { title: blog.data.seo_title },
        { name: "description", content: blog.data.seo_description },
        { name: "keywords", content: blog.data.seo_keywords },

        // OG Details
        { name: "og:title", content: blog.data.title },
        { name: "og:description", content: blog.data.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'blog/' + blog.data.image },
        { name: "og:url", content: full_url },

        // Twitter Card Details
        { name: "twitter:twitter", content: "summary_large_image" },
        { name: "twitter:title", content: blog.data.title },
        { name: "twitter:description", content: blog.data.seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'blog/' + blog.data.image },
    ];
};

export default function BlogSingle() {
    const { blog, full_url, tags, blogcategories, recent_blogs }: any = useLoaderData();

    return (
        <div className="bg-[#E9F1F799]">
            <div className="container mx-auto">
                <div className="bg-[#f6f6f6] px-6 py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <Link to="/blogs" className="text-sm font-normal text-[#131B23]">Blogs</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <div className="text-sm font-normal text-[#4356A2] underline">{blog.data.title}</div>
                    </div>
                    <div className="py-3">
                        <div className="flex lg:flex-row flex-col-reverse gap-4">
                            <div className="lg:w-1/4 pb-4 lg:border-r lg:border-[#dbdada] pr-2">
                                <div className="pb-4">
                                    <div className="text-[#4356A2] font-medium text-xl underline pb-3">Blog Categories</div>
                                    <div>
                                        {blogcategories.data.data.map((blogcategory: any, index: any) => (
                                            <div className="text-lg" key={index}>
                                                <Link to={'/blog-category/' + blogcategory.slug} className="text-lg leading-10 text-normal text-[#131B23] py-1">{blogcategory.title} ({blogcategory.blogCount})</Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <div className="text-[#4356A2] font-medium text-xl underline pb-3">Recent Blogs</div>
                                    <div>
                                        {recent_blogs.data.data.map((r_blog: any, index: any) => (
                                            <div className="text-lg text-normal text-[#131B23] py-1" key={index}>
                                                <Link to={'/blog/' + r_blog.slug} className="text-lg p-0">{r_blog.title}</Link>
                                                <div className="text-md text-normal text-[#969696]">{format(new Date(r_blog.createdAt), 'MMM dd, yyyy')}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <div className="text-[#4356A2] font-medium text-xl underline pb-5">Latest Tags</div>
                                    <div className="gap-4 flex flex-wrap">
                                        {tags.data.data.map((tag: any, index: any) => (
                                            <Link to="/" key={index} className="text-lg text-normal text-[#131B23] py-2 px-2 border border-[#ccc]">{tag.title}</Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <div className="text-[#4356A2] font-medium text-xl underline pb-5">Publishing Year</div>
                                    <div className="gap-4 flex flex-wrap">
                                        <Link to="/" className="text-lg text-normal text-[#131B23] py-2 px-2 border border-[#ccc]">2024</Link>
                                        <Link to="/" className="text-lg text-normal text-[#131B23] py-2 px-2 border border-[#ccc]">2023</Link>
                                        <Link to="/" className="text-lg text-normal text-[#131B23] py-2 px-2 border border-[#ccc]">2022</Link>
                                        <Link to="/" className="text-lg text-normal text-[#131B23] py-2 px-2 border border-[#ccc]">2021</Link>
                                        <Link to="/" className="text-lg text-normal text-[#131B23] py-2 px-2 border border-[#ccc]">2020</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-3/4 pb-4 blog-section">
                                <div className="text-3xl font-medium text-[#4356A2]">{blog.data.title}</div>
                                <div className="category flex flex-wrap text-[#969696] text-lg font-normal my-1 mb-3 gap-2  divide-x-2">
                                    {blog.data.categories.map((cat: any, index: any) => (
                                        <div className="text-lg">{cat.title}</div>
                                    ))}
                                    {blog.data.createdAt ?
                                        <div className="text-lg">{format(new Date(blog.data.createdAt), 'MMM dd, yyyy')}</div>
                                        : <></>
                                    }
                                </div>
                                <div>
                                    <img src={config.imgBaseURL + 'blog/' + blog.data.image} alt={blog.data.title} className="lg:h-[425px] w-full object-contain" />
                                </div>
                                <div className="content-details font-normal text-lg text-justify space-y-4 py-8">
                                    <div dangerouslySetInnerHTML={{ __html: blog.data.description }} ></div>
                                </div>
                                <div className="flex flex-wrap justify-end gap-4 pb-4">
                                    <div>Share : </div>
                                    <Link target="_blank" to={'https://www.facebook.com/sharer/sharer.php?u=' + full_url} ><i className="fab fa-facebook-f"></i></Link>
                                    <Link target="_blank" to={'https://api.whatsapp.com/send?text=' + blog.data.title + ' ' + full_url} ><i className="fab fa-whatsapp"></i></Link>
                                    <Link target="_blank" to={'https://www.linkedin.com/sharing/share-offsite/?url=' + full_url} ><i className="fab fa-linkedin"></i></Link>
                                    <Link target="_blank" to={'https://twitter.com/intent/tweet?url=' + full_url + '&text=' + blog.data.title} ><i className="fab fa-twitter"></i></Link>
                                    <Link target="_blank" to={'https://pinterest.com/pin/create/button/?url=' + full_url + '&media=' + config.imgBaseURL + 'blog/' + blog.data.image + '&description=' + blog.data.title} ><i className="fab fa-pinterest"></i></Link>
                                </div>
                                <hr />
                                <div className="flex justify-between">
                                    <div className="flex items-center text-left py-4 gap-4">
                                        <Link to="/"><i className="fa fa-chevron-circle-left text-black text-4xl"></i></Link>
                                        <div>
                                            <div className="font-normal text-sm leading-10">PREVIOUS</div>
                                            <div className="font-normal text-lg leading-10">HVOF Gun for Tungsten Carbide Coating</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-right py-4 gap-4">
                                        <div>
                                            <div className="font-normal text-sm leading-10">NEXT</div>
                                            <div className="font-normal text-lg leading-10">Steel Shots Abrasive</div>
                                        </div>
                                        <Link to="/"><i className="fa fa-chevron-circle-right text-black text-4xl"></i></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
