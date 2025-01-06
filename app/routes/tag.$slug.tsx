import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useRouteError } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import BlogCard from "~/components/BlogCard";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request, params }) => {
    try {
        const settingsCacheKey = `settings`;
        const cachedSettings = cache[settingsCacheKey];

        const CACHE_EXPIRATION_TIME = 1 * 60 * 60 * 1000;
        setTimeout(() => {
            delete cache[settingsCacheKey];
        }, CACHE_EXPIRATION_TIME);

        let settings;
        if (!cachedSettings) {
            const setting = await fetch(config.apiBaseURL + 'setting');
            if (!setting.ok) { throw setting; }
            settings = await setting.json();
            cache[settingsCacheKey] = settings;
        } else {
            settings = cachedSettings;
        }

        const url = new URL(request.url);
        const baseUrl = `https://${url.host}`;
        const full_url = `https://${url.host}${url.pathname}`;

        const blog = await fetch(config.apiBaseURL + 'tag/' + params.slug);
        if (!blog.ok) { throw blog; }
        const blogs = await blog.json();

        const tag = await fetch(config.apiBaseURL + 'tags');
        if (!tag.ok) { throw tag; }
        const tags = await tag.json();

        const blogcategory = await fetch(config.apiBaseURL + 'blogcategory');
        if (!blogcategory.ok) { throw blogcategory; }
        const blogcategories = await blogcategory.json();

        const recent_blog = await fetch(config.apiBaseURL + 'blogs?limit=5');
        if (!recent_blog.ok) { throw recent_blog; }
        const recent_blogs = await recent_blog.json();

        return json({ blogs, full_url, baseUrl, blogcategories, tags, settings, recent_blogs });
    } catch (error) {
        throw error;
    }
};

export const meta: MetaFunction = ({ data }: any) => {
    if (!data || data.error) {
        return [
            { charSet: "UTF-8" },
            { title: "Error - Not found" },
            { name: "description", content: "We couldn't find you're looking for." },
        ];
    }

    const { blogs, settings, full_url }: any = data;
    return [
        // Seo Details
        { charSet: "UTF-8" },
        { title: blogs.data.seo_title },
        { name: "description", content: blogs.data.seo_description },
        { name: "keywords", content: blogs.data.seo_keywords },

        // OG Details
        { name: "og:type", content: "article" },
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:site_name", content: settings?.data?.title },
        { name: "og:title", content: blogs.data.title },
        { name: "og:description", content: blogs.data.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'blog/' + blogs.data.image },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: settings?.data?.title },
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
            <script type="application/ld+json">{JSON.stringify(breadcrumb_schema)}</script>
            <div className="container mx-auto">
                <div className="py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link title="Home" to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <Link title="Blogs" to="/blogs" className="text-sm font-normal text-[#131B23]">Blogs</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp;  <div className="text-sm font-normal text-theme underline">{blogs.data.title}</div>
                    </div>
                    <div className="py-3">
                        <div className="flex lg:flex-row flex-col gap-4">
                            <div className="lg:w-1/4 pb-4 lg:border-r lg:border-[#dbdada] pr-2">
                                {blogcategories?.data?.data.length ?
                                    <div className="pb-4">
                                        <div className="text-theme font-medium text-xl underline pb-3">Blog Categories</div>
                                        <div>
                                            {blogcategories.data.data.map((blogcategory: any, index: any) => (
                                                <div className="text-lg" key={index}>
                                                    <Link title={blogcategory.title} to={'/blog-category/' + blogcategory.slug} className="text-lg leading-10 text-normal text-[#131B23] py-1">{blogcategory.title} ({blogcategory.blogCount})</Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    : <></>}
                                {recent_blogs?.data?.data.length ?
                                    <div className="pb-4">
                                        <div className="text-theme font-medium text-xl underline pb-3">Recent Blogs</div>
                                        <div>
                                            {recent_blogs.data.data.map((r_blog: any, index: any) => (
                                                <div className="text-lg text-normal text-[#131B23] py-1" key={index}>
                                                    <Link title={r_blog.title} to={'/blog/' + r_blog.slug} className="text-lg p-0">{r_blog.title}</Link>
                                                    <div className="text-md text-normal text-[#969696]">Published on: {format(new Date(r_blog.createdAt), 'MMM dd, yyyy')}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    : <></>}
                                {tags?.data?.data.length ?
                                    <div className="pb-4">
                                        <div className="text-theme font-medium text-xl underline pb-5">Latest Tags</div>
                                        <div className="gap-4 flex flex-wrap">
                                            {tags.data.data.map((tag: any, index: any) => (
                                                <Link title={tag.title} to={'/tag/' + tag.slug} key={index} className={`text-lg text-normal py-2 px-2 border ${tag.slug == blogs.data.slug ? 'text-theme border-theme' : 'text-[#131B23] border-[#ccc]'}`}>{tag.title}</Link>
                                            ))}
                                        </div>
                                    </div>
                                    : <></>}
                                <div className="pb-4">
                                    <div className="text-theme font-medium text-xl underline pb-5">Publishing Year</div>
                                    <div className="gap-4 flex flex-wrap">
                                        {years.map((year: any, index: any) => (
                                            <Link title={year} key={index} to={'/blogs?year=' + year} className="text-lg text-normal text-[#131B23] py-2 px-2 border border-[#ccc]">{year}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-3/4 pb-4">
                                <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-[1.3rem]">
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

export function ErrorBoundary() {
    const error = useRouteError() as { status: number; statusText: string; data?: { message?: string } };
    return (
        <>
            <div className="bg-[#E9F1F799]">
                <div className="container mx-auto">
                    <div className="py-8">
                        <div className="text-center">
                            <div className="font-medium text-9xl mb-5">{error.status}</div>
                            <div className="font-medium text-3xl mb-5">{error.statusText}</div>
                            <p>{error && error?.data && error.data.message ? error.data.message : 'Sorry, something went wrong.'}</p>
                            <div className="mt-5 pt-5">
                                <Link to="/" className="bg-theme text-white rounded p-5 font-medium text-xl">Go To Homepage</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
