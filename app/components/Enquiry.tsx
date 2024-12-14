import { useModal } from './Modalcontext'; // Assuming you have a Modal context
import EnquiryDetail from './EnquiryDetail';

const Enquiry = () => {
    const { isEnquiryOpen, modalEnquiryData, closeEnquiry } = useModal();
    if (!isEnquiryOpen) {
        return null;
    }
    const product = modalEnquiryData;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
        >
            <div
                className="bg-[#E9F1F7] rounded-2xl animate-modalIn transform transition-all duration-500 ease-out translate-y-0 opacity-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing modal on content click
            >
                <div>
                    <button
                        className="absolute top-1 right-3 text-4xl text-white-500 hover:text-white-700"
                        onClick={closeEnquiry}
                        title="close"
                    >
                        &times;
                    </button>
                    <EnquiryDetail product_detail={product} />
                </div>
            </div>
        </div>
    )
};

export default Enquiry;
