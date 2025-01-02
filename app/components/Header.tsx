import { Link, NavLink, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import config from "~/config";
import { useModal } from "./Modalcontext";
import { formatPhoneNumber } from "~/utils/format-mobile-number";

export default function Header({ settings }: any) {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const search = urlParams.get('s');
  const [isOpen, setIsOpen] = useState(false);
  const { openEnquiry } = useModal();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const mes2 = 'your products';
  const message = "Hi, I've visited on " + "" + ". And I'm interested in " + mes2 + " & need more information regarding " + mes2 + ".\nThank You.";
  const encodedMessage = encodeURIComponent(message);

  const [displayText, setDisplayText] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (settings?.mobile) {
        setDisplayText((prevText) =>
          prevText === true ? false : true
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [settings?.mobile]);

  return (
    <>
      <header className="bg-[#E9F1F799]">
        <div className="container mx-auto md:py-3">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <Link title={settings?.email} to={'mailto:' + settings?.email} className="n_btn2 bg-theme text-base text-white font-normal rounded-md flex items-center gap-2 px-3 py-2 relative overflow-hidden z-0 transition duration-[800ms]">
                <i className="fa fa-envelope "></i>
                <span className="md:block hidden">Send Inquiry</span>
              </Link>
            </div>
            <div className="flex justify-center">
              <Link title={settings?.title} to="/">
                <img src={config.imgBaseURL + 'setting/logo/' + settings?.logo} alt={settings?.title} loading="lazy" className="md:w-[119px] w-[85px] h-auto" />
              </Link>
            </div>
            <div className="text-right">
              {settings?.mobileStatus ?
                <Link title={formatPhoneNumber(settings?.mobile)} to={'tel:' + settings?.mobile} className="n_btn2 bg-theme text-base text-white font-normal rounded-md flex items-center gap-2 px-3 py-2 relative overflow-hidden z-0 transition duration-[800ms]">
                  <i className="fa fa-phone rotate-90"></i>
                  <span className="md:block hidden">Call Us Now</span>
                </Link>
                :
                <div onClick={() => openEnquiry('')} className="n_btn2 bg-theme text-base text-white font-normal rounded-md flex items-center gap-2 px-3 py-2 relative overflow-hidden z-0 transition duration-[800ms]">
                  <i className="fa fa-phone rotate-90"></i>
                  <span className="md:block hidden">Call Us Now</span>
                </div>
              }
            </div>
          </div>
        </div>
      </header>
      <div className="bg-theme1 sticky top-0 z-50 border-y border-[#D9D9D999]">
        <div className="container mx-auto py-3">
          <div className="flex items-center justify-between">
            {/* Desktop Menu */}
            <nav className="hidden lg:flex lg:space-x-3 xl:space-x-10">
              <NavLink to="/" className={({ isActive }) => isActive ? "n_btn active" : "n_btn"}>Home</NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? "n_btn active" : "n_btn"}>About Us</NavLink>
              <NavLink to="/products" className={({ isActive }) => isActive ? "n_btn active" : "n_btn"}>Machines & Abrasives</NavLink>
              <NavLink to="/videos" className={({ isActive }) => isActive ? "n_btn active" : "n_btn"}>Videos</NavLink>
              <NavLink to="/blogs" className={({ isActive }) => isActive ? "n_btn active" : "n_btn"}>Blogs</NavLink>
              <NavLink to="/contact" className={({ isActive }) => isActive ? "n_btn active" : "n_btn"}>Contact Us</NavLink>
            </nav>

            {/* Mobile Menu Button (Hamburger Icon) */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-800 focus:outline-none"
                title="Menu"
              >
                {/* Hamburger icon */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
            </div>
            <div>
              <form action="/products" className="flex max-w-sm">
                <input
                  type="text"
                  name="s"
                  defaultValue={search ? search : ''}
                  placeholder="Search Here..."
                  className="px-3 py-2 md:max-w-sm max-w-48 bg-[#E9F1F7] text-lg font-normal text-[#131B23] rounded-l-md outline-none border-[1px] border-r-0 focus:border-[#131B23] hover:border-[#131B23] transition-all duration-[800ms] ease-out"
                />
                <button type="submit" title="Submit" className="n_btn1 px-4 py-2 bg-[#131B23] text-base text-white font-medium rounded-r-md w-full text-center px-2 relative overflow-hidden z-0 transition duration-[800ms] hover:text-theme border-[1px] border-[#131B23]"><i className="fa fa-search"></i></button>
              </form>
            </div>
          </div>
        </div>

      </div>
      <div>
        {/* Mobile Menu */}
        <>
          <div className={`bg-[#131B23] lg:hidden shadow-md fixed z-[100] top-0 bottom-0 ${!isOpen ? '-left-[110%] right-[110%]' : 'left-0 right-0'} transition-all duration-500 ease-in-out`}>
            <div className="lg:hidden flex items-center justify-center mt-3 mb-3">
              <Link title={settings?.title} to="/" className="flex justify-center">
                <img src={config.imgBaseURL + 'setting/logo2/' + settings?.logo2} alt={settings?.title} loading="lazy" className="w-[50%] h-auto" />
              </Link>
            </div>
            <hr className="border-[#ffffff45]" />
            <nav>
              <div className="space-y-2 p-4">
                <NavLink to="/" onClick={toggleMenu} className={({ isActive }) => isActive ? "block text-theme bg-[#fff] px-3 rounded" : "block text-[#fff] px-3"}><i className="fa fa-home mr-3"></i> <span>Home</span></NavLink>
                <NavLink to="/about" onClick={toggleMenu} className={({ isActive }) => isActive ? "block text-theme bg-[#fff] px-3 rounded" : "block text-[#fff] px-3"}><i className="fa fa-info-circle mr-3"></i> <span>About Us</span></NavLink>
                <NavLink to="/products" onClick={toggleMenu} className={({ isActive }) => isActive ? "block text-theme bg-[#fff] px-3 rounded" : "block text-[#fff] px-3"}><i className="fa fa-th-large mr-3"></i> <span>Machines & Abrasives</span></NavLink>
                <NavLink to="/videos" onClick={toggleMenu} className={({ isActive }) => isActive ? "block text-theme bg-[#fff] px-3 rounded" : "block text-[#fff] px-3"}><i className="fab fa-youtube mr-3"></i> <span>Videos</span></NavLink>
                <NavLink to="/blogs" onClick={toggleMenu} className={({ isActive }) => isActive ? "block text-theme bg-[#fff] px-3 rounded" : "block text-[#fff] px-3"}><i className="fa fa-blog mr-3"></i> <span>Blogs</span></NavLink>
                <NavLink to="/contact" onClick={toggleMenu} className={({ isActive }) => isActive ? "block text-theme bg-[#fff] px-3 rounded" : "block text-[#fff] px-3"}><i className="fa fa-phone rotate-90 mr-3"></i> <span>Contact Us</span></NavLink>
              </div>
            </nav>
            <div className="lg:hidden absolute left-[50%] bottom-[20px]">
              <button
                onClick={toggleMenu}
                className="text-[#fff] focus:outline-none mt-3 mb-3"
                title="Menu"
              >
                {/* Hamburger icon */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </>
      </div>
      <div>
        <div onClick={() => openEnquiry('')} title="Enquiry" className="group fixed bottom-[110px] md:bottom-[160px] right-[10px] z-[9] gradient_btn h-[40px] w-[40px] md:h-[50px] md:w-[50px] rounded-full flex items-center justify-center shadow-xl animate-zoom-in-out">
          <i className="fa fa-file-alt text-white text-lg md:text-2xl group-hover:animate-shake1"></i>
        </div>
        {settings?.mobileStatus ?
          <>
            <Link to={`tel:${settings?.mobile}`} title={formatPhoneNumber(settings?.mobile)} className="group fixed bottom-[60px] md:bottom-[90px] right-[10px] z-[9] gradient_btn h-[40px] w-[40px] md:h-[50px] md:w-[50px] rounded-full flex items-center justify-center shadow-xl animate-zoom-in-out">
              <i className="fa fa-phone text-white rotate-90 text-lg md:text-2xl group-hover:animate-shake"></i>
            </Link>
            <Link to={`https://wa.me/${settings?.mobile}?text=${encodedMessage}`} title="Whatsapp" target="_blank" className="group fixed bottom-[10px] md:bottom-[20px] right-[10px] z-[9] bg-[#25d366] h-[40px] w-[40px] md:h-[50px] md:w-[50px] rounded-full flex items-center justify-center shadow-xl animate-zoom-in-out">
              <i className="fab fa-whatsapp text-white text-lg md:text-2xl group-hover:animate-shake1"></i>
            </Link>
          </> : <></>}
      </div>
    </>
  );
}
