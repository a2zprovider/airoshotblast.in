import { useModal } from './Modalcontext';

const Enquiry = () => {
    const { isEnquiryOpen, modalEnquiryData, closeEnquiry } = useModal();

    if (!isEnquiryOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
            onClick={closeEnquiry}>
            {/* Modal Content */}
            <div
                className="bg-[#E9F1F7] rounded-2xl animate-modalIn transform transition-all duration-500 ease-out translate-y-0 opacity-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing on content click
            >
                <div className="">
                    <button
                        className="absolute top-1 right-3 text-4xl text-white-500 hover:text-white-700"
                        onClick={closeEnquiry}
                    >
                        &times; {/* Close button (X) */}
                    </button>
                    <div className="bg-[#4356A2] font-normal text-white text-xl px-10 py-6 rounded-t-2xl">Tell us your requirement, and we'll send you quotes</div>
                    <div className="p-6">
                        <form>
                            <div className="flex flex-col mb-2">
                                <label htmlFor="name" className="text-[#131B23] text-lg font-medium">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter Your Name"
                                    className="px-3 py-3 bg-[#fff] text-lg font-medium text-[#D9D9D9] rounded-md outline-none shadow-md"
                                />
                            </div>
                            <div className="flex flex-col mb-2">
                                <label htmlFor="product" className="text-[#131B23] text-lg font-medium">I Want Quotes For</label>
                                <select
                                    className="h-[52px] px-3 py-3 bg-[#fff] text-lg font-medium text-[#D9D9D9] rounded-md outline-none border-r"
                                    name="product"
                                    id="options"
                                >
                                    <option value="">Select Product/Service Name</option>
                                    <option value="option1">Steel Shots</option>
                                    <option value="option2">Sand Blasting</option>
                                    <option value="option3">Portable Sand Blasting Machine</option>
                                </select>
                            </div>
                            <div className="flex flex-col mb-2">
                                <label htmlFor="mobile" className="text-[#131B23] text-lg font-medium">Mobile No.</label>
                                <div className="flex items-center shadow-md">
                                    <select
                                        className="h-[52px] px-3 py-3 bg-[#fff] text-lg font-medium text-[#D9D9D9] rounded-l-md outline-none border-r"
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
                                        className="flex-1 px-3 py-3 bg-[#fff] text-lg font-medium text-[#D9D9D9] rounded-r-md outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col mb-4">
                                <label htmlFor="requirement" className="text-[#131B23] text-lg font-medium">Additional Detail</label>
                                <textarea name="requirement" id="" rows={5} placeholder="Additional Details About Your Requirement...." className="px-3 py-3 bg-[#fff] text-lg font-medium text-[#D9D9D9] rounded-md outline-none shadow-md">{modalEnquiryData?.title}</textarea>
                            </div>
                            <div className="flex flex-col mb-2">
                                <button className="bg-[#131B23] text-lg text-white font-medium rounded-md  h-[46px] shadow-md">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Enquiry;


