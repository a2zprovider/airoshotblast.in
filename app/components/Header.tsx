import { json, LoaderFunction } from "@remix-run/node";
import { Link, NavLink } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function Header({ settings }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header className="bg-[#E9F1F799]">
        <div className="container mx-auto md:py-3">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <Link to={'mailto:' + settings.email} className="bg-[#4356A2] text-base text-white font-normal rounded-md flex items-center gap-2 px-3 py-2">
                <i className="fa fa-envelope "></i>
                <span className="md:block hidden">Send Inquiry</span>
              </Link>
            </div>
            <div className="flex justify-center">
              <img src="/logo.webp" alt="Logo" className="md:w-[119px] w-[85px] h-auto" />
            </div>
            <div className="text-right">
              <Link to={'tel:' + settings.mobile} className="bg-[#4356A2] text-base text-white font-normal rounded-md flex items-center gap-2 px-3 py-2">
                <i className="fa fa-phone "></i>
                <span className="md:block hidden">Call Us Now</span>
              </Link>
            </div>
          </div>
        </div>

      </header>
      <div className="bg-[#dee5fd] sticky top-0 z-50 border-y border-[#D9D9D999]">
        <div className="flex items-center hidden">
          <div className="container mx-auto flex justify-between items-center py-3">
            <div>
              <div className="flex justify-center items-center">
                <form className="flex max-w-xs">
                  <input
                    type="text"
                    name="s"
                    placeholder="Search Here..."
                    className="px-3 py-2 bg-[#E9F1F799] text-lg font-normal text-[#131B234D] rounded-l-md outline-none"
                  />
                  <button
                    type="submit"
                    className="text-base px-4 py-2 bg-[#131B23] text-white rounded-r-md"
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-3">
          <div className="flex items-center justify-between">
            {/* Desktop Menu */}
            <nav className="hidden lg:flex lg:space-x-10">
              <NavLink to="/" className={({ isActive }) => isActive ? "text-[#4356A2] underline" : "text-[#131B23]"}>Home</NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? "text-[#4356A2] underline" : "text-[#131B23]"}>About Us</NavLink>
              <NavLink to="/products" className={({ isActive }) => isActive ? "text-[#4356A2] underline" : "text-[#131B23]"}>Machines & Abrasives</NavLink>
              <NavLink to="/videos" className={({ isActive }) => isActive ? "text-[#4356A2] underline" : "text-[#131B23]"}>Vidoes</NavLink>
              <NavLink to="/blogs" className={({ isActive }) => isActive ? "text-[#4356A2] underline" : "text-[#131B23]"}>Blogs</NavLink>
              <NavLink to="/contact" className={({ isActive }) => isActive ? "text-[#4356A2] underline" : "text-[#131B23]"}>Contact Us</NavLink>
            </nav>

            {/* Mobile Menu Button (Hamburger Icon) */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-800 focus:outline-none"
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

            {/* Mobile Menu */}
            {isOpen && (
              <nav className="lg:hidden bg-white shadow-md absolute top-[70px] left-0">
                <div className="space-y-2 p-4">
                  <NavLink to="/" className={({ isActive }) => isActive ? "block text-[#4356A2] underline" : "block text-[#131B23]"}>Home</NavLink>
                  <NavLink to="/about" className={({ isActive }) => isActive ? "block text-[#4356A2] underline" : "block text-[#131B23]"}>About Us</NavLink>
                  <NavLink to="/products" className={({ isActive }) => isActive ? "block text-[#4356A2] underline" : "block text-[#131B23]"}>Machines & Abrasives</NavLink>
                  <NavLink to="/about" className={({ isActive }) => isActive ? "block text-[#4356A2] underline" : "block text-[#131B23]"}>Vidoes</NavLink>
                  <NavLink to="/blog" className={({ isActive }) => isActive ? "block text-[#4356A2] underline" : "block text-[#131B23]"}>Blog</NavLink>
                  <NavLink to="/contact" className={({ isActive }) => isActive ? "block text-[#4356A2] underline" : "block text-[#131B23]"}>Contact Us</NavLink>
                </div>
              </nav>
            )}
            <div>
              <form className="flex max-w-sm">
                <input
                  type="text"
                  name="s"
                  placeholder="Search Here..."
                  className="px-3 py-2 md:max-w-sm max-w-48 bg-[#E9F1F799] text-lg font-normal text-[#131B234D] rounded-l-md outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-base bg-[#131B23] text-white rounded-r-md"
                >
                  <i className="fa fa-search"></i>
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
