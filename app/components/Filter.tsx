export default function Filter(data: any) {
    const { isOpen, onClose } = data;
    if (!isOpen) return null;
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
                        className={`bg-[#E9F1F7] rounded-2xl animate-modalIn w-full max-w-xl transform transition-all duration-500 ease-out ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
                        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
                    >
                        <div className="">
                            <button
                                className="absolute top-1 right-3 text-4xl text-white-500 hover:text-white-700"
                                onClick={onClose}
                            >
                                &times; {/* Close button (X) */}
                            </button>
                            <div className="font-normal text-[#131B23] text-xl px-10 py-4 text-center">Product Categories</div>
                            <hr className="bg-black border-[2px] border-black" />
                            <div className="font-normal text-[#131B23] text-xl">
                                <div className="">
                                    <div className="flex justify-between items-center py-2 px-4 bg-[#DEE5FD] border-b">
                                        <label htmlFor="C1">Sand Blasting</label>

                                        <label className="inline-flex items-center space-x-2">
                                            <input type="checkbox" name="sand-blasting" id="C1" className="hidden peer" />
                                            <div className="w-5 h-5 border-2 border-[#131B23] rounded-lg flex items-center justify-center peer-checked:bg-[#4356A2] text-transparent peer-checked:text-white ">
                                                <i className="fa fa-check text-[10px]"></i>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="">
                                        <div className="flex justify-between items-center py-2 px-4 bg-[#F6F6F6] border-b">
                                            <label htmlFor="C1">Portable Sand Blasting Machine</label>

                                            <label className="inline-flex items-center space-x-2">
                                                <input type="checkbox" name="sand-blasting" id="C1" className="hidden peer" />
                                                <div className="w-5 h-5 border-2 border-[#131B23] rounded-lg flex items-center justify-center peer-checked:bg-[#4356A2] text-transparent peer-checked:text-white ">
                                                    <i className="fa fa-check text-[10px]"></i>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="flex justify-between items-center py-2 px-4 bg-[#F6F6F6] border-b">
                                            <label htmlFor="C1">Sand Blasting Cabinet</label>

                                            <label className="inline-flex items-center space-x-2">
                                                <input type="checkbox" name="sand-blasting" id="C1" className="hidden peer" />
                                                <div className="w-5 h-5 border-2 border-[#131B23] rounded-lg flex items-center justify-center peer-checked:bg-[#4356A2] text-transparent peer-checked:text-white ">
                                                    <i className="fa fa-check text-[10px]"></i>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="flex justify-between items-center py-2 px-4 bg-[#DEE5FD] border-b">
                                        <div>Shot Blasting</div>
                                        <label className="inline-flex items-center space-x-2">
                                            <input type="checkbox" name="sand-blasting" id="C1" className="hidden peer" />
                                            <div className="w-5 h-5 border-2 border-[#131B23] rounded-lg flex items-center justify-center peer-checked:bg-[#4356A2] text-transparent peer-checked:text-white ">
                                                <i className="fa fa-check text-[10px]"></i>
                                            </div>
                                        </label>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center py-2 px-4 bg-[#F6F6F6] border-b">
                                            <label htmlFor="C1">Air Operated</label>

                                            <label className="inline-flex items-center space-x-2">
                                                <input type="checkbox" name="sand-blasting" id="C1" className="hidden peer" />
                                                <div className="w-5 h-5 border-2 border-[#131B23] rounded-lg flex items-center justify-center peer-checked:bg-[#4356A2] text-transparent peer-checked:text-white ">
                                                    <i className="fa fa-check text-[10px]"></i>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="flex justify-between items-center py-2 px-4 bg-[#F6F6F6] border-b">
                                            <label htmlFor="C1">Airless</label>

                                            <label className="inline-flex items-center space-x-2">
                                                <input type="checkbox" name="sand-blasting" id="C1" className="hidden peer" />
                                                <div className="w-5 h-5 border-2 border-[#131B23] rounded-lg flex items-center justify-center peer-checked:bg-[#4356A2] text-transparent peer-checked:text-white ">
                                                    <i className="fa fa-check text-[10px]"></i>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between  py-4 px-4">
                                <button className="bg-[#4356A2] text-lg text-white font-medium rounded-[10px] px-3 py-2">Clear All</button>
                                <button className="bg-[#4356A2] text-lg text-white font-medium rounded-[10px] px-3 py-2">Apply Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
