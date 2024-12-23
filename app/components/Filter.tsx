import { useEffect, useState } from "react";
import config from "~/config";

export default function Filter({ isOpen, onClose, onApplyFilter, selectedAllCategories, allcategories }: any) {
    if (!isOpen) return null;

    const [loading, setLoading] = useState(true);
    const [categories, setCategory] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const category = await fetch(config.apiBaseURL + 'category?parent=null&sortOrder=asc');
                const categories = await category.json();
                setCategory(categories.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();

        if (selectedAllCategories && selectedAllCategories.length > 0) {
            setSelectedCategories(selectedAllCategories);
        }

    }, [selectedAllCategories]);

    const changeCategory = (category: any) => {
        setSelectedCategories((prevSelected) => {
            const isSelected = prevSelected.some((cat) => cat._id === category._id);
            if (isSelected) {
                return prevSelected.filter((cat) => cat._id !== category._id);
            } else {
                return [...prevSelected, category];
            }
        });
    };

    const clearAll = () => {
        setSelectedCategories([]); // Clear all selected categories
    };

    const applyFilter = () => {
        onApplyFilter(selectedCategories); // Pass the selected category IDs to the parent
        onClose();
    };

    return (
        <div>
            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={onClose}
                >
                    {/* Modal Content */}
                    <div
                        className={`bg-[#E9F1F7] rounded-2xl animate-modalIn transform transition-all duration-500 ease-out w-full max-w-[90%] md:max-w-xl  ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
                        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
                    >
                        <div className="relative">
                            <button
                                className="absolute top-1 right-3 text-4xl text-white-500 hover:text-white-700"
                                title="close"
                                onClick={onClose}
                            >
                                &times; {/* Close button (X) */}
                            </button>
                            <div className="font-normal text-[#131B23] text-xl px-10 py-4 text-center">Product Categories</div>
                            <hr className="bg-black border-[2px] border-black" />
                            <div className="font-normal text-[#131B23] text-xl md:max-h-auto overflow-auto catModalContent">
                                {categories.map((category: any, index: any) => (
                                    <div className="" key={index}>
                                        <div className="flex justify-between items-center py-2 px-4 bg-[#DEE5FD] border-b">
                                            <label htmlFor={'cat' + index} className="line-clamp-1">{category.title}</label>

                                            <label className="inline-flex items-center space-x-2">
                                                <input type="checkbox" name="category"
                                                    onChange={() => changeCategory(category)}
                                                    checked={selectedCategories.some((cat) => cat._id === category._id)}
                                                    id={'cat' + index}
                                                    className="hidden peer" />
                                                <div className="w-5 h-5 border-2 border-[#131B23] rounded-lg flex items-center justify-center peer-checked:bg-[#4356A2] text-transparent peer-checked:text-white ">
                                                    <i className="fa fa-check text-[10px]"></i>
                                                </div>
                                            </label>
                                        </div>
                                        {category.subcategory.map((scat: any, i: any) => (
                                            <div className="" key={i}>
                                                <div className="flex justify-between items-center py-2 px-4 bg-[#F6F6F6] border-b">
                                                    <label htmlFor={'cat' + index + i} className="line-clamp-1">{scat.title}</label>
                                                    <label className="inline-flex items-center space-x-2">
                                                        <input type="checkbox" name="category"
                                                            onChange={() => changeCategory(scat)}
                                                            checked={selectedCategories.some((cat) => cat._id === scat._id)}
                                                            id={'cat' + index + i} className="hidden peer" />
                                                        <div className="w-5 h-5 border-2 border-[#131B23] rounded-lg flex items-center justify-center peer-checked:bg-[#4356A2] text-transparent peer-checked:text-white ">
                                                            <i className="fa fa-check text-[10px]"></i>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between py-4 px-4">
                                <button title="Clear All" onClick={clearAll} className="bg-[#4356A2] text-lg text-white font-medium rounded-[10px] px-3 py-2">Clear All</button>
                                <button title="Apply Now" onClick={applyFilter} className="bg-[#4356A2] text-lg text-white font-medium rounded-[10px] px-3 py-2">Apply Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
