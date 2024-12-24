import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useNavigate, useLoaderData } from "@remix-run/react";
import Accordion from "~/components/Accordion";
import BlogSlider from "~/components/BlogSlider";
import CategorySection from "~/components/CategoryProductSection";
import EnquiryForm from "~/components/EnquiryForm";
import Slider from "~/components/Slider";
import VideoSlider from "~/components/VideoSlider";
import config from "~/config";

export let loader: LoaderFunction = async ({ request }) => {

  // Fetching data from an external API
  const category = await fetch(config.apiBaseURL + 'category?parent=null&limit=7');
  const categories = await category.json();

  const blog = await fetch(config.apiBaseURL + 'blogs');
  const blogs = await blog.json();

  const faq = await fetch(config.apiBaseURL + 'faqs');
  const faqs = await faq.json();

  const setting = await fetch(config.apiBaseURL + 'setting');
  const settings = await setting.json();

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const full_url = `${url.origin}${url.pathname}`;

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
    { name: "og:title", content: seo_details.h_seo_title },
    { name: "og:description", content: seo_details.h_seo_description },
    { name: "og:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },
    { name: "og:url", content: full_url },

    // Twitter Card Details
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seo_details.h_seo_title },
    { name: "twitter:description", content: seo_details.h_seo_description },
    { name: "twitter:image", content: config.imgBaseURL + 'setting/logo/' + settings.data.logo },

    // Canonical URL
    { tag: 'link', rel: 'canonical', href: full_url },
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

            <div className="content-details font-normal text-lg text-justify space-y-4">
              {settings.data.field && JSON.parse(settings.data.field).title.map((f: any, i: any) => (
                <div key={i} className={`grid ${JSON.parse(settings.data.field).image[i] ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} grid-cols-1 gap-4`}>
                  <>
                    <div className={i % 2 === 0 ? 'flex-1 order-1' : 'flex-1 order-2'}>
                      <div className="font-medium text-2xl text-[#4356A2]">{f}</div>
                      <div dangerouslySetInnerHTML={{ __html: JSON.parse(settings.data.field).description[i] }} ></div>
                    </div>
                    <div className={i % 2 === 0 ? 'flex-1 order-2' : 'flex-1 order-1'}>
                      {
                        JSON.parse(settings.data.field).image[i] ?
                          <img src={config.imgBaseURL + `/setting/other/${JSON.parse(settings.data.field).image[i]}`} alt={f} loading="lazy" className="rounded-lg" />
                          : ''
                      }
                    </div>
                  </>
                </div>
              ))}
            </div>
            {/* <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6 py-10">
              <div>
                <div className="text-[#4356A2] text-[22px] font-medium mb-2">Sand Blasting Machine</div>
                <p className="text-[#131B23] text-lg font-normal text-justify">Sand blasting machine is a type of equipment used for sandblasting. It uses high-speed centrifugal force to remove paint, coatings, and even rust from metal surfaces. Sand blasting is an environmentally friendly process that can be used on all kinds of metals. The equipment comes in different sizes and capacities to suit the needs of various users. Sand blasting involves blasting abrasive particles at a surface to abrade away paint or other coatings. Sand blasting is an effective method of cleaning rust off metal surfaces as well as removing paint and other coatings.
                  The sand particles are propelled by the compressed air and impact against the surface at very high velocity. The particles wear away at the target material's surface creating cavities that can be used for subsequent chemical etching or electroplating processes. It may also be referred to as dry sanding because no water is involved in its operation, unlike wet sanding which uses liquid abrasives like grinding paste or paint remover with water added to create slurry before it's applied to the workpiece.</p>
              </div>
              <div>
                <img src="/home1.png" loading="lazy" alt="Home 1" className="w-full rounded-[20px]" />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6 py-10">
              <div>
                <img src="/home2.png" loading="lazy" alt="Home 2" className="w-full rounded-[20px] border border-t-0 border-b-0 border-[4px] border-[#4356A2]" />
              </div>
              <div>
                <div className="text-[#4356A2] text-[22px] font-medium mb-2">Diabola Shot Blasting Machine</div>
                <p className="text-[#131B23] text-lg font-normal text-justify">Sand blasting machine is a type of equipment used for sandblasting. It uses high-speed centrifugal force to remove paint, coatings, and even rust from metal surfaces. Sand blasting is an environmentally friendly process that can be used on all kinds of metals. The equipment comes in different sizes and capacities to suit the needs of various users. Sand blasting involves blasting abrasive particles at a surface to abrade away paint or other coatings. Sand blasting is an effective method of cleaning rust off metal surfaces as well as removing paint and other coatings.
                  The sand particles are propelled by the compressed air and impact against the surface at very high velocity. The particles wear away at the target material's surface creating cavities that can be used for subsequent chemical etching or electroplating processes. It may also be referred to as dry sanding because no water is involved in its operation, unlike wet sanding which uses liquid abrasives like grinding paste or paint remover with water added to create slurry before it's applied to the workpiece.</p>
              </div>
            </div> */}
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