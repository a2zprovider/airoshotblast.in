import { useState } from "react";

const categories = {
    Electronics: ["Laptops", "Mobile Phones", "Headphones", "Cameras"],
    Clothing: ["Men", "Women", "Kids", "Accessories"],
    HomeAppliances: ["Refrigerators", "Washing Machines", "Microwaves", "Air Conditioners"],
    Books: ["Fiction", "Non-Fiction", "Science", "History"],
    Sports: ["Football", "Basketball", "Badminton", "Cycling"],
};

function FilterModal({ isOpen, onClose, onApplyFilter }: any) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);

    // Toggle category selection
    const toggleCategory = (category: any) => {
        setSelectedCategories((prev: any) =>
            prev.includes(category)
                ? prev.filter((item: any) => item !== category)
                : [...prev, category]
        );

        // Reset selected subcategories when category is deselected
        if (!selectedCategories.includes(category)) {
            setSelectedSubcategories((prev: any) => ({ ...prev, [category]: [] }));
        }
    };

    // Toggle subcategory selection
    const toggleSubcategory = ({ category, subcategory }: any) => {
        setSelectedSubcategories((prev: any) => {
            const currentSubcategories = prev[category] || [];
            if (currentSubcategories.includes(subcategory)) {
                return {
                    ...prev,
                    [category]: currentSubcategories.filter((item: any) => item !== subcategory),
                };
            } else {
                return {
                    ...prev,
                    [category]: [...currentSubcategories, subcategory],
                };
            }
        });
    };

    const handleApplyFilter = () => {
        const filters = {
            categories: selectedCategories,
            subcategories: selectedSubcategories,
        };
        onApplyFilter(filters);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg max-w-lg w-full"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Filter Products</h2>
                    <button
                        onClick={onClose}
                        className="text-xl font-semibold text-gray-500 hover:text-gray-700"
                        title="close"
                    >
                        &times;
                    </button>
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-medium">Categories</h3>
                    <div className="space-y-2 mt-2">
                        {Object.keys(categories).map((category: any, index: any) => (
                            <div key={index}>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => toggleCategory(category)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={category} className="text-lg">
                                        {category}
                                    </label>
                                </div>

                                {/* Show subcategories if the category is selected */}
                                {selectedCategories.includes(category) && (
                                    <div className="ml-6 space-y-2">
                                        {categories[category].map((subcategory: any) => (
                                            <div key={subcategory} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={subcategory}
                                                    checked={selectedSubcategories[category]?.includes(subcategory)}
                                                    onChange={() => toggleSubcategory(category, subcategory)}
                                                    className="mr-2"
                                                />
                                                <label htmlFor={subcategory} className="text-lg">
                                                    {subcategory}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-4">
                    <button
                        onClick={handleApplyFilter}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                        title="Apply Filter"
                    >
                        Apply Filter
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
                        title="Cancel"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FilterModal;
