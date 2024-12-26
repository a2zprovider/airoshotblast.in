import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import BlogCard from "~/components/BlogCard";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const full_url = `${url.origin}${url.pathname}`;

    const blog = await fetch(config.apiBaseURL + 'tag/' + params.slug);
    const blogs = await blog.json();

    const tag = await fetch(config.apiBaseURL + 'tags');
    const tags = await tag.json();

    const blogcategory = await fetch(config.apiBaseURL + 'blogcategory');
    const blogcategories = await blogcategory.json();

    const recent_blog = await fetch(config.apiBaseURL + 'blogs?limit=5');
    const recent_blogs = await recent_blog.json();


    return json({ blogs, full_url, baseUrl, blogcategories, tags, recent_blogs });
};

export const meta: MetaFunction = ({ data }) => {
    const { blogs, full_url }: any = data;
    return [
        // Seo Details
        { title: blogs.data.seo_title },
        { name: "description", content: blogs.data.seo_description },
        { name: "keywords", content: blogs.data.seo_keywords },

        // OG Details
        { name: "og:type", content: "article" },
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:title", content: blogs.data.title },
        { name: "og:description", content: blogs.data.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'blog/' + blogs.data.image },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: blogs.data.title },
        { name: "twitter:description", content: blogs.data.seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'blog/' + blogs.data.image },
    ];
};

export default function Blog() {
    const { blogs, blogcategories, tags, recent_blogs, full_url, baseUrl }: any = useLoaderData();
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => currentYear - i); const breadcrumb_schema = {
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
            "name": 'Blogs',
            "item": baseUrl + '/blogs'
        }, {
            "@type": "ListItem",
            "position": 3,
            "name": blogs.data.title,
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
                        <Link title="Home" to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <Link title="Blogs" to="/blogs" className="text-sm font-normal text-[#131B23]">Blogs</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp;  <div className="text-sm font-normal text-[#4356A2] underline">{blogs.data.title}</div>
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
                                                <div className="text-md text-normal text-[#969696]">Published on: {format(new Date(r_blog.createdAt), 'MMM dd, yyyy')}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <div className="text-[#4356A2] font-medium text-xl underline pb-5">Latest Tags</div>
                                    <div className="gap-4 flex flex-wrap">
                                        {tags.data.data.map((tag: any, index: any) => (
                                            <Link title={tag.title} to={'/tag/' + tag.slug} key={index} className={`text-lg text-normal py-2 px-2 border ${tag.slug == blogs.data.slug ? 'text-[#4356A2] border-[#4356A2]' : 'text-[#131B23] border-[#ccc]'}`}>{tag.title}</Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <div className="text-[#4356A2] font-medium text-xl underline pb-5">Publishing Year</div>
                                    <div className="gap-4 flex flex-wrap">
                                        {years.map((year: any, index: any) => (
                                            <Link title={year} key={index} to={'/blogs?year=' + year} className="text-lg text-normal text-[#131B23] py-2 px-2 border border-[#ccc]">{year}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-3/4 pb-4">
                                <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6">
                                    {blogs?.blogs?.map((blog: any, index: any) => (
                                        <div key={index}>
                                            <BlogCard blog={blog} />
                                        </div>
                                    ))}
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
