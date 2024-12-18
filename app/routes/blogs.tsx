import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useSearchParams } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import BlogCard from "~/components/BlogCard";
import config from "~/config";

export let loader: LoaderFunction = async ({ request }) => {
    const url_params = new URL(request.url).searchParams;
    const year = url_params.get('year');
    let blog_url = config.apiBaseURL + 'blogs?limit=1000';
    if (year) {
        blog_url = config.apiBaseURL + 'blogs?limit=1000&year=' + year;
    }

    const blog = await fetch(blog_url);
    const blogs = await blog.json();

    const tag = await fetch(config.apiBaseURL + 'tags');
    const tags = await tag.json();

    const blogcategory = await fetch(config.apiBaseURL + 'blogcategory');
    const blogcategories = await blogcategory.json();

    const recent_blog = await fetch(config.apiBaseURL + 'blogs?limit=5');
    const recent_blogs = await recent_blog.json();

    const setting = await fetch(config.apiBaseURL + 'setting');
    const settings = await setting.json();

    const full_url = request.url;

    return json({ blogs, blogcategories, tags, recent_blogs, settings, full_url, year });
};

export const meta: MetaFunction = ({ data }) => {
    const { settings, full_url }: any = data;
    const seo_details = JSON.parse(settings.data.seo_details);

    return [
        // Seo Details
        { title: seo_details.b_seo_title },
        { name: "description", content: seo_details.b_seo_description },
        { name: "keywords", content: seo_details.b_seo_keywords },

        // OG Details
        { name: "og:type", content: "website" },
        { name: "og:title", content: seo_details.b_seo_title },
        { name: "og:description", content: seo_details.b_seo_description },
        { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
        { name: "og:url", content: full_url },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo_details.b_seo_title },
        { name: "twitter:description", content: seo_details.b_seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
        
        // Canonical URL
        { rel: 'canonical', href: full_url },
    ];
};

export default function Blog() {
    const { blogs, blogcategories, tags, recent_blogs, year }: any = useLoaderData();
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => currentYear - i);
    return (
        <div className="bg-[#E9F1F799]">
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link title="Home" to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp;  <div className="text-sm font-normal text-[#4356A2] underline">Blogs</div>
                    </div>
                    <div className="py-3">
                        <div className="flex lg:flex-row flex-col gap-4">
                            <div className="lg:w-1/4 pb-4 lg:border-r lg:border-[#dbdada] pr-2">
                                <div className="pb-4">
                                    <div className="text-[#4356A2] font-medium text-xl underline pb-3">Blog Categories</div>
                                    <div>
                                        {blogcategories.data.data.map((blogcategory: any, index: any) => (
                                            <div className="text-lg" key={index}>
                                                <Link title={blogcategory.title} to={'/blog-category/' + blogcategory.slug} className="text-lg leading-10 text-normal text-[#131B23] py-1">{blogcategory.title} ({blogcategory.blogCount})</Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <div className="text-[#4356A2] font-medium text-xl underline pb-3">Recent Blogs</div>
                                    <div>
                                        {recent_blogs.data.data.map((r_blog: any, index: any) => (
                                            <div className="text-lg text-normal text-[#131B23] py-1" key={index}>
                                                <Link title={r_blog.title} to={'/blog/' + r_blog.slug} className="text-lg p-0">{r_blog.title}</Link>
                                                <div className="text-md text-normal text-[#969696]">{format(new Date(r_blog.createdAt), 'MMM dd, yyyy')}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <div className="text-[#4356A2] font-medium text-xl underline pb-5">Latest Tags</div>
                                    <div className="gap-4 flex flex-wrap">
                                        {tags.data.data.map((tag: any, index: any) => (
                                            <Link title={tag.title} to={'/tag/' + tag.slug} key={index} className="text-lg text-normal text-[#131B23] py-2 px-2 border border-[#ccc]">{tag.title}</Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <div className="text-[#4356A2] font-medium text-xl underline pb-5">Publishing Year</div>
                                    <div className="gap-4 flex flex-wrap">
                                        {years.map((y: any, index: any) => (
                                            <Link title={y} key={index} to={'/blogs?year=' + y} className={`text-lg text-normal py-2 px-2 border ${y == year ? 'text-[#4356A2] border-[#4356A2]' : 'text-[#131B23] border-[#ccc]'}`}>{y}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-3/4 pb-4">
                                <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6">
                                    {blogs.data.data.map((blog: any, index: any) => (
                                        <div key={index}>
                                            <BlogCard blog={blog} />
                                        </div>
                                    ))}
                                </div>
                                {!(blogs.data.data).length ?
                                    <div className="font-normal text-[#131B23] text-lg text-center">No Blogs Found.</div>
                                    : ''
                                }
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
