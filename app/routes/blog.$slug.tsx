import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useRouteError } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request, params }) => {
    try {
        const url = new URL(request.url);
        const baseUrl = `https://${url.host}`;
        const full_url = `https://${url.host}${url.pathname}`;

        const settingsCacheKey = `settings`;
        const cachedSettings = cache[settingsCacheKey];

        const CACHE_EXPIRATION_TIME = 2 * 60 * 1000;
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

        const blog_detail = await fetch(config.apiBaseURL + 'blog/' + params.slug);
        if (!blog_detail.ok) { throw blog_detail; }
        const blog = await blog_detail.json();

        const all_blogs = await fetch(config.apiBaseURL + 'blogs?limit=1000');
        if (!all_blogs.ok) { throw all_blogs; }
        const blogs = await all_blogs.json();

        const currentIndex = blogs.data.data.findIndex((b: any) => b.slug === params.slug);
        const previousBlog = currentIndex > 0 ? blogs.data.data[currentIndex - 1] : null;
        const nextBlog = currentIndex < blogs.data.data.length - 1 ? blogs.data.data[currentIndex + 1] : null;

        const tag = await fetch(config.apiBaseURL + 'tags');
        if (!tag.ok) { throw tag; }
        const tags = await tag.json();

        const recent_blog = await fetch(config.apiBaseURL + 'blogs?limit=5');
        if (!recent_blog.ok) { throw recent_blog; }
        const recent_blogs = await recent_blog.json();

        const blogcategory = await fetch(config.apiBaseURL + 'blogcategory');
        if (!blogcategory.ok) { throw blogcategory; }
        const blogcategories = await blogcategory.json();

        return json({ blog, full_url, baseUrl, tags, blogcategories, recent_blogs, previousBlog, nextBlog, settings });
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

    const { blog, settings, full_url }: any = data;

    return [
        // Seo Details
        { charSet: "UTF-8" },
        { title: blog.data.seo_title },
        { name: "description", content: blog.data.seo_description },
        { name: "keywords", content: blog.data.seo_keywords },

        // Twitter Card Details
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: settings?.data?.title },
        { name: "twitter:title", content: blog.data.title },
        { name: "twitter:description", content: blog.data.seo_description },
        { name: "twitter:image", content: config.imgBaseURL + 'blog/thumb/' + blog.data.thumb_image },

        // OG Details
        { name: "og:type", content: "article" },
        { name: "og:locale", content: "en_US" },
        { name: "og:url", content: full_url },
        { name: "og:site_name", content: settings?.data?.title },
        { name: "og:title", content: blog.data.title },
        { name: "og:description", content: blog.data.seo_description },
        { name: "og:image", content: config.imgBaseURL + 'blog/thumb/' + blog.data.thumb_image },
    ];
};

export default function BlogSingle() {
    const { blog, full_url, baseUrl, tags, blogcategories, recent_blogs, previousBlog, nextBlog, settings }: any = useLoaderData();
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => currentYear - i);

    const blog_schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.data.title,
        "description": blog.data.seo_description,
        "datePublished": blog.data.createdAt,
        "dateModified": blog.data.updatedAt,
        "url": baseUrl + '/blog/' + blog.data.slug,
        "image": config.imgBaseURL + 'blog/' + blog.data.image,
        "publisher": {
            "@type": "Organization",
            "name": settings.data.title,
            "logo": {
                "@type": "ImageObject",
                "url": config.imgBaseURL + 'setting/logo/' + settings.data.logo
            }
        }
    }
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
            "name": 'Blogs',
            "item": baseUrl + '/blogs'
        }, {
            "@type": "ListItem",
            "position": 3,
            "name": blog.data.title,
            "item": full_url
        }]
    }
    return (
        <div className="bg-[#E9F1F799]">
            <script type="application/ld+json">{JSON.stringify(blog_schema)}</script>
            <script type="application/ld+json">{JSON.stringify(breadcrumb_schema)}</script>
            <div className="container mx-auto">
                <div className="bg-[#f6f6f6] px-3 md:px-6 py-3">
                    <div className="flex items-center py-2 text-sm font-normal">
                        <Link title="Home" to="/" className="text-sm font-normal text-[#131B23]">Home</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <Link title="Blogs" to="/blogs" className="text-sm font-normal text-[#131B23]">Blogs</Link> &nbsp;<i className="fa fa-chevron-right text-[10px]"></i><i className="fa fa-chevron-right text-[10px]"></i>&nbsp; <div className="text-sm font-normal text-theme underline">{blog.data.title}</div>
                    </div>
                    <div className="py-3">
                        <div className="flex lg:flex-row flex-col-reverse gap-4">
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
                                                <Link title={tag.title} to={'/tag/' + tag.slug} key={index} className="text-lg text-normal text-[#131B23] py-2 px-2 border border-[#ccc]">{tag.title}</Link>
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
                            <div className="lg:w-3/4 pb-4 blog-section">
                                <h1 className="text-3xl font-medium text-theme">{blog.data.title}</h1>
                                <div className="category flex flex-wrap text-[#969696] text-lg font-normal my-2 mb-4">
                                    {blog.data.categories.map((cat: any, index: any) => (
                                        <div className="relative flex items-center" key={index}>
                                            <div className="leading-none text-lg pr-2 lowercase">{cat.title}</div>
                                            <div className="absolute right-0 top-1/6 bottom-[2.5px] border-r w-1 h-[9px] border-[#ccc]"></div>
                                        </div>
                                    ))}
                                    {blog.data.createdAt ?
                                        <div className="leading-none text-lg lowercase">Published On : {format(new Date(blog.data.createdAt), 'MMM dd, yyyy')}</div>
                                        : <></>
                                    }
                                </div>
                                <div>
                                    <img src={config.imgBaseURL + 'blog/' + blog.data.image} alt={blog.data.title} loading="lazy" className="lg:h-[425px] w-full object-contain" />
                                </div>
                                <div className="content-details font-normal text-lg text-justify space-y-4 py-4 pt-2">
                                    <div dangerouslySetInnerHTML={{ __html: blog.data.description }} ></div>
                                </div>
                                <div className="flex flex-wrap justify-end gap-4 pb-4">
                                    <div>Share : </div>
                                    <Link title="Facebook" target="_blank" to={'https://www.facebook.com/sharer/sharer.php?u=' + full_url} ><i className="fab fa-facebook-f"></i></Link>
                                    <Link title="Whatsapp" target="_blank" to={'https://api.whatsapp.com/send?text=' + blog.data.title + ' ' + full_url} ><i className="fab fa-whatsapp"></i></Link>
                                    <Link title="Linkedin" target="_blank" to={'https://www.linkedin.com/sharing/share-offsite/?url=' + full_url} ><i className="fab fa-linkedin"></i></Link>
                                    <Link title="Twitter" target="_blank" to={'https://twitter.com/intent/tweet?url=' + full_url + '&text=' + blog.data.title} ><i className="fab fa-twitter"></i></Link>
                                    <Link title="Pinterest" target="_blank" to={'https://pinterest.com/pin/create/button/?url=' + full_url + '&media=' + config.imgBaseURL + 'blog/' + blog.data.image + '&description=' + blog.data.title} ><i className="fab fa-pinterest"></i></Link>
                                </div>
                                <hr />
                                <div className="flex justify-between">
                                    {previousBlog ?
                                        <div className="flex items-center text-left py-4 gap-4">
                                            <Link title={previousBlog.title} to={'/blog/' + previousBlog.slug}><i className="fa fa-chevron-circle-left text-black text-4xl"></i></Link>
                                            <div>
                                                <div className="font-normal text-sm leading-10">PREVIOUS</div>
                                                <div className="font-normal text-lg leading-10 line-clamp-1">{previousBlog.title}</div>
                                            </div>
                                        </div>
                                        : <div></div>
                                    }
                                    {nextBlog ?
                                        <div className="flex items-center text-right py-4 gap-4">
                                            <div>
                                                <div className="font-normal text-sm leading-10">NEXT</div>
                                                <div className="font-normal text-lg leading-10 line-clamp-1">{nextBlog.title}</div>
                                            </div>
                                            <Link title={nextBlog.title} to={'/blog/' + nextBlog.slug}><i className="fa fa-chevron-circle-right text-black text-4xl"></i></Link>
                                        </div>
                                        : <div></div>
                                    }
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
