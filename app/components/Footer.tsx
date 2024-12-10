import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import config from "~/config";

// app/components/Footer.tsx
export default function Footer({ settings }: any) {
  const social_links = JSON.parse(settings.social_links);

  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const page = await fetch(config.apiBaseURL + 'pages?parent=null');
        const pages = await page.json();

        setPages(pages.data.data);
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };

    fetchPages();
  }, []);

  return (
    <footer className="bg-[#11151C]">
      <div className="container mx-auto py-10">
        <div className="flex   lg:flex-row md:flex-col flex-col  items-center justify-between">
          <div className="py-2">
            <img src="/logo.webp" alt="Logo" loading="lazy" className="w-[119px] h-auto" />
          </div>
          <div className="py-2">
            <ul className="grid md:grid-flow-col sm:grid-flow-row auto-cols-max md:gap-2 lg:gap-5 xl:gap-[50px] text-center text-lg text-white font-normal">
              <li><Link to="/careers" className="">Careers</Link></li>
              {pages.map((page: any, index: any) => (
                page.slug != 'about-us' ?
                  <li key={index}><Link to={'/page/' + page.slug} className="">{page.title}</Link></li>
                  : ''
              ))}
              <li><Link to="/faqs" className="">FAQ's</Link></li>
            </ul>
          </div>
          <div className="flex justify-end py-2">
            <ul className="grid grid-flow-col auto-cols-max gap-4 text-xl text-white font-normal">
              <li><Link to={social_links.facebook} className="text-white"><i className="fab fa-facebook-f  text-blue-600 hover:text-blue-800"></i></Link></li>
              <li><Link to={social_links.instagram} className="text-white"><i className="fab fa-instagram text-pink-600 hover:text-pink-800"></i></Link></li>
              <li><Link to={social_links.twitter} className="text-white"><i className="fab fa-twitter text-blue-400 hover:text-blue-600"></i></Link></li>
              <li><Link to={social_links.youtube} className="text-white"><i className="fab fa-youtube text-red-500 hover:text-red-600"></i></Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-white text-sm font-normal">Copyright &copy; {new Date().getFullYear()} All rights reserved Airo Shot Blast Equipments.</p>
        </div>
      </div>
    </footer>
  );
}
