import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useNavigate, useLoaderData } from "@remix-run/react";
import Accordion from "~/components/Accordion";
import BlogSlider from "~/components/BlogSlider";
import CategorySection from "~/components/CategoryProductSection";
import EnquiryForm from "~/components/EnquiryForm";
import Slider from "~/components/Slider";
import VideoSlider from "~/components/VideoSlider";
import config from "~/config";

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
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

  // Fetching data from an external API
  const category = await fetch(config.apiBaseURL + 'category?parent=null&limit=7');
  const categories = await category.json();

  const blog = await fetch(config.apiBaseURL + 'blogs');
  const blogs = await blog.json();

  const faq = await fetch(config.apiBaseURL + 'faqs');
  const faqs = await faq.json();

  return json({ categories, blogs, faqs, settings, full_url });
};

export const meta: MetaFunction = ({ data }) => {
  const { settings, full_url }: any = data;
  const seo_details = JSON.parse(settings.data.seo_details);

  return [
    // Seo Details
    { title: seo_details.h_seo_title },
    { name: "description", content: seo_details.h_seo_description },
    { name: "keywords", content: seo_details.h_seo_keywords },

    // OG Details
    { name: "og:type", content: "website" },
    { name: "og:url", content: full_url },
    { name: "og:locale", content: "en_US" },
    { name: "og:title", content: seo_details.h_seo_title },
    { name: "og:description", content: seo_details.h_seo_description },
    { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },

    // Twitter Card Details
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seo_details.h_seo_title },
    { name: "twitter:description", content: seo_details.h_seo_description },
    { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
  ];
};

export default function Index() {
  const { categories, blogs, faqs, settings, full_url }: any = useLoaderData();

  const navigate = useNavigate();
  const navigateTo = (url: any) => {
    navigate(url);
  };

  const social_links = JSON.parse(settings.data.social_links);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.data.title,
    "url": full_url,
    "logo": config.imgBaseURL + 'setting/logo/' + settings.data.logo,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": settings.data.mobile,
      "contactType": "sales",
      "areaServed": "IN",
      "availableLanguage": "en"
    },
    "sameAs": [
      social_links.facebook,
      social_links.instagram,
      social_links.instagram,
      social_links.linkedin,
      social_links.pinterest,
      social_links.whatsapp,
      social_links.youtube,
      full_url
    ]
  }

  return (
    <div>
      <head>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </head>
      <div className="bg-[#E9F1F799]">
        <div className="container mx-auto py-8">
          <div className="flex lg:justify-center items-start w-full lg:gap-8 md:gap-4 overflow-x-auto">
            {categories.data.data.map((category: any, index: any) => (
              category.parent == null ?
                <Link title={category.title} to={'/' + category.slug} key={index} className="group min-w-[100px] w-[100px] text-center flex flex-col justify-center items-center">
                  <div className="mb-4 overflow-hidden">
                    <img src={config.imgBaseURL + `/category/${category.image}`} alt={category.title} loading="lazy" className="w-[80px] h-[80px] object-cover rounded-full bg-[#0000001A] border-[2px] border-[#E9F1F799] group-hover:border-[#4356A2] transition-all duration-500 ease-in-out" />
                  </div>
                  <p className="text-sm font-normal">{category.title}</p>
                </Link>
                : ''
            ))}
            <Link title="View All" to="/products" className="group min-w-[100px] w-[100px] text-center flex flex-col justify-center items-center">
              <div className="mb-4 overflow-hidden text-[40px] text-[#4356A2]">
                <div className="flex justify-center items-center w-[80px] h-[80px] object-cover rounded-full bg-[#0000001A] border-[2px] border-[#E9F1F799] group-hover:border-[#4356A2] transition-all duration-500 ease-in-out">
                  <i className="fa fa-th-large"></i>
                </div>
              </div>
              <p className="text-sm font-normal">View All</p>
            </Link>
          </div>
        </div>
      </div >
      <div>
        <Slider />
      </div>
      <CategorySection />
      <div>
        <div className="container mx-auto py-8">
          <div className="grid lg:grid-cols-2 md:grid-cols-1 items-center">
            <div className="p-3 text-center my-6">
              <div className="font-bold text-3xl">Product Videos</div>
              <div className="font-normal text-sm py-2">Check Out Our Latest Videos of Sand Blasting Machine, & Shot Blasting Machine</div>
              <div className="flex justify-center py-5">
                <VideoSlider />
              </div>
              <button onClick={() => navigateTo('/videos')} title="View all Videos" className="n_btn2 bg-[#4356A2] text-lg text-white font-medium rounded-md w-[196px] h-[46px] relative overflow-hidden z-0 transition duration-[800ms]">
                View all Videos
              </button>
            </div>
            <div className="bg-[#4356A2] p-6 my-6">
              <div className="text-center text-white font-bold text-3xl">Contact Us</div>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#E9F1F799]">
        <div className="container mx-auto py-8">

          {/* Section 1 */}
          <div className="">
            <div className="py-4">
              <div className="text-3xl font-bold text-center">Shot Blasting Machine Manufacturers</div>
              <p className="text-sm font-normal text-center my-2">Our blogs explore the sand blasting, shot blasting machine, thermal spray gun and abrasive media</p>
              <div>
                <BlogSlider blogs={blogs.data.data} />
              </div>
            </div>
            <div className="my-5 content-details text-[#131B23] text-lg font-normal text-justify">
              <div dangerouslySetInnerHTML={{ __html: settings.data.description }} ></div>
            </div>

            <div className="content-details font-normal text-lg text-justify space-y-10">
              {settings.data.field && JSON.parse(settings.data.field).title.map((f: any, i: any) => (
                <div key={i} className={`grid ${JSON.parse(settings.data.field).image[i] ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} grid-cols-1 gap-10`}>
                  <>
                    <div className={i % 2 === 0 ? 'flex-1 order-1' : 'flex-1 order-2'}>
                      {/* <div className="font-medium text-2xl text-[#4356A2]">{f}</div> */}
                      <div dangerouslySetInnerHTML={{ __html: JSON.parse(settings.data.field).description[i] }} ></div>
                    </div>
                    <div className={i % 2 === 0 ? 'flex-1 order-2' : 'flex-1 order-1 justify-content-end'}>
                      {
                        JSON.parse(settings.data.field).image[i] ?
                          <img src={config.imgBaseURL + `/setting/other/${JSON.parse(settings.data.field).image[i]}`} alt={f} loading="lazy" className="rounded-lg border-x-[4px] border-[#4356A2] w-full" />
                          : ''
                      }
                    </div>
                  </>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#E9F1F799]">
        <div className="container mx-auto pb-8">
          <div>
            <div className="text-3xl font-bold text-center">Frequently Asked Questions</div>
            <p className="text-sm font-normal text-center my-2">Have any questions about sand blasting & shot blasting machine? Find answers here</p>
            <div className="py-4">
              <Accordion faqs={faqs.data.data} />
            </div>
          </div>
        </div>
      </div>

    </div >
  );
}