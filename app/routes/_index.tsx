import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import Accordion from "~/components/Accordion";
import BlogSlider from "~/components/BlogSlider";
import ProductSlider from "~/components/ProductSlider";
import Slider from "~/components/Slider";
import imageUrl from "~/config";

export let loader: LoaderFunction = async ({ request }) => {
  // Fetching data from an external API
  const category = await fetch('http://localhost:5000/api/category?limit=100');
  const categories = await category.json();

  const product = await fetch('http://localhost:5000/api/products');
  const products = await product.json();

  const blog = await fetch('http://localhost:5000/api/blogs');
  const blogs = await blog.json();

  const faq = await fetch('http://localhost:5000/api/faqs');
  const faqs = await faq.json();

  const setting = await fetch('http://localhost:5000/api/setting');
  const settings = await setting.json();

  const full_url = request.url;

  return json({ categories, products, blogs, faqs, settings, full_url });
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
    { name: "og:title", content: seo_details.h_seo_title },
    { name: "og:description", content: seo_details.h_seo_description },
    { name: "og:image", content: imageUrl + 'setting/logo/' + settings.data.logo },
    { name: "og:url", content: full_url },

    // Twitter Card Details
    { name: "twitter:twitter", content: "summary_large_image" },
    { name: "twitter:title", content: seo_details.h_seo_title },
    { name: "twitter:description", content: seo_details.h_seo_description },
    { name: "twitter:image", content: imageUrl + 'setting/logo/' + settings.data.logo },
  ];
};

export default function Index() {
  const { categories, products, blogs, faqs, settings }: any = useLoaderData();

  return (
    <div>
      <div className="bg-[#E9F1F7]">
        <div className="container mx-auto py-8">
          <div className="flex lg:justify-center items-start w-full lg:gap-8 md:gap-4 overflow-x-auto">
            {categories.data.data.map((category: any, index: any) => (
              category.parent == null ?
                <Link to={'/' + category.slug} key={index} className="group min-w-[100px] w-[100px] text-center flex flex-col justify-center items-center">
                  <div className="mb-4 overflow-hidden">
                    <img src={imageUrl + `/category/${category.image}`} alt={category.title} className="w-[80px] h-[80px] object-cover rounded-full bg-[#0000001A] border-[2px] border-[#E9F1F7] group-hover:border-[#4356A2] transition-all duration-500 ease-in-out" />
                  </div>
                  <p className="text-sm font-normal">{category.title}</p>
                </Link>
                : ''
            ))}
            <Link to="/products" className="group min-w-[100px] w-[100px] text-center flex flex-col justify-center items-center">
              <div className="mb-4 overflow-hidden text-[40px] text-[#4356A2]">
                <div className="flex justify-center items-center w-[80px] h-[80px] object-cover rounded-full bg-[#0000001A] border-[2px] border-[#E9F1F7] group-hover:border-[#4356A2] transition-all duration-500 ease-in-out">
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

      <div className="bg-[#E9F1F7]">
        <div className="container mx-auto py-8">
          {/* Section 1 */}
          <div className="py-6">
            <div className="text-3xl font-bold text-center">Sand Blasting</div>
            <p className="text-sm font-normal text-center my-2">We are one of the leading manufacturer, supplier, exporter of sand blasting equipments, machines, sand blasting cabinets, sand blasting rooms, vacuum sand blasting machine </p>
            <ProductSlider products={products.data.data} />
          </div>
          {/* Section 2 */}
          <div className="py-6">
            <div className="text-3xl font-bold text-center">Shot Blasting</div>
            <p className="text-sm font-normal text-center my-2">Shot Blasting
              We are one of the leading manufacturer, supplier, exporter of airless shot blasting machine, tumble shot blasting machine & spinner hanger shot blast machine</p>
            <div>
              <ProductSlider products={products.data.data} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="container mx-auto py-8">
          <div className="grid lg:grid-cols-2 md:grid-cols-1 items-center">
            <div className="p-3 text-center my-6">
              <div className="font-bold text-3xl">Product Videos</div>
              <div className="font-normal text-sm py-2">Check Out Our Latest Videos of Sand Blasting Machine, & Shot Blasting Machine</div>
              <div className="flex justify-center py-5">
                <iframe src="https://www.youtube.com/embed/LDWDr4uCk8I?si=qzGW-lSpZrhpkXDE" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>
              </div>
              <button className="bg-[#4356A2]  text-lg text-white font-medium rounded-md w-[196px] h-[46px]">
                View all Videos
              </button>
            </div>
            <div className="bg-[#4356A2] p-6 my-6">
              <div className="text-center text-white font-bold text-3xl">Contact Us</div>
              <form className="mt-4">
                <div className="flex flex-col mb-2">
                  <label htmlFor="name" className="text-white text-lg font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Your Name"
                    className="px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-md outline-none"
                  />
                </div>
                <div className="flex flex-col mb-2">
                  <label htmlFor="email" className="text-white text-lg font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Your E-Mail"
                    className="px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-md outline-none"
                  />
                </div>
                <div className="flex flex-col mb-2">
                  <label htmlFor="mobile" className="text-white text-lg font-medium">Mobile No.</label>
                  <div className="flex items-center">
                    <select
                      className="h-[44px] px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-l-md outline-none border-r"
                      name="options"
                      id="options"
                    >
                      <option value="option1">+91</option>
                      <option value="option2">+1</option>
                      <option value="option3">+001</option>
                    </select>
                    <input
                      type="mobile"
                      name="mobile"
                      placeholder="Enter Your Mobile No."
                      className="flex-1 px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-r-md outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="requirement" className="text-white text-lg font-medium">Your Requirement</label>
                  <textarea name="requirement" id="" rows={5} placeholder="Describe Your Requirement in Detail..." className="px-3 py-2 bg-[#fff] text-lg font-medium text-[#131B234D] rounded-md outline-none"></textarea>
                </div>
                <div className="flex flex-col mb-2">
                  <button className="bg-white text-lg text-[#4356A2] font-medium rounded-md w-[196px] h-[46px]">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#E9F1F7]">
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
            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6 py-10">
              <div>
                <div className="text-[#4356A2] text-[22px] font-medium mb-2">Sand Blasting Machine</div>
                <p className="text-[#131B23] text-lg font-normal text-justify">Sand blasting machine is a type of equipment used for sandblasting. It uses high-speed centrifugal force to remove paint, coatings, and even rust from metal surfaces. Sand blasting is an environmentally friendly process that can be used on all kinds of metals. The equipment comes in different sizes and capacities to suit the needs of various users. Sand blasting involves blasting abrasive particles at a surface to abrade away paint or other coatings. Sand blasting is an effective method of cleaning rust off metal surfaces as well as removing paint and other coatings.
                  The sand particles are propelled by the compressed air and impact against the surface at very high velocity. The particles wear away at the target material's surface creating cavities that can be used for subsequent chemical etching or electroplating processes. It may also be referred to as dry sanding because no water is involved in its operation, unlike wet sanding which uses liquid abrasives like grinding paste or paint remover with water added to create slurry before it's applied to the workpiece.</p>
              </div>
              <div>
                <img src="/home1.png" alt="Home 1" className="w-full rounded-[20px]" />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6 py-10">
              <div>
                <img src="/home2.png" alt="Home 2" className="w-full rounded-[20px] border border-t-0 border-b-0 border-[4px] border-[#4356A2]" />
              </div>
              <div>
                <div className="text-[#4356A2] text-[22px] font-medium mb-2">Diabola Shot Blasting Machine</div>
                <p className="text-[#131B23] text-lg font-normal text-justify">Sand blasting machine is a type of equipment used for sandblasting. It uses high-speed centrifugal force to remove paint, coatings, and even rust from metal surfaces. Sand blasting is an environmentally friendly process that can be used on all kinds of metals. The equipment comes in different sizes and capacities to suit the needs of various users. Sand blasting involves blasting abrasive particles at a surface to abrade away paint or other coatings. Sand blasting is an effective method of cleaning rust off metal surfaces as well as removing paint and other coatings.
                  The sand particles are propelled by the compressed air and impact against the surface at very high velocity. The particles wear away at the target material's surface creating cavities that can be used for subsequent chemical etching or electroplating processes. It may also be referred to as dry sanding because no water is involved in its operation, unlike wet sanding which uses liquid abrasives like grinding paste or paint remover with water added to create slurry before it's applied to the workpiece.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#E9F1F7]">
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