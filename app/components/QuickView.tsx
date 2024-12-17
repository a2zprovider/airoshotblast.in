import { Link, useNavigate } from '@remix-run/react';
import { useModal } from './Modalcontext';
import config from '~/config';
import { useEffect, useState } from 'react';

const QuickView = () => {
    const { isQuickViewOpen, modalQuickViewData, closeQuickView, openEnquiry } = useModal();
    if (!isQuickViewOpen) {
        return null;
    }
    const product = modalQuickViewData;
    console.log('product : ', product);


    const navigate = useNavigate();

    const handleClick = (url: any) => {
        closeQuickView();
        navigate(`${url}`);
    };

    const [setting, setSetting] = useState<any>();

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const settings = await fetch(config.apiBaseURL + 'setting');
                const setting = await settings.json();

                setSetting(setting);
            } catch (error) {
                console.error('Error fetching setting:', error);
            } finally {
                // setLoading(false);
            }
        };

        fetchSetting();
    }, []);

    if (!isQuickViewOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto"
            onClick={closeQuickView}
        >
            {/* Modal Content */}
            <div
                className={`bg-[#E9F1F7] rounded-2xl animate-modalIn transform transition-all duration-500 ease-out translate-y-0 opacity-100 max-w-[90%] md:max-w-auto overflow-auto my-10`}
                onClick={(e) => e.stopPropagation()} // Prevent closing on content click
            >
                <button
                    className="absolute top-1 right-3 text-4xl text-gray-500 hover:text-gray-700"
                    onClick={closeQuickView}
                    title='close'
                >
                    &times; {/* Close button (X) */}
                </button>
                <div className="flex overflow-hidden">
                    <div className="hidden md:w-[50%] md:max-w-[60%] md:flex items-center justify-center p-4">
                        <img
                            src={product.thumb_image ? config.imgBaseURL + `/product/thumb/${product.thumb_image}` : config.imgBaseURL + `/product/${product.image}`}
                            alt={product.title} loading="lazy"
                            className="object-contain rounded-2xl"
                        />
                    </div>
                    <div className="py-8 md:w-[50%] max-w-[500px] w-[500px] overflow-hidden">
                        <div className="px-0">
                            <div className="text-3xl text-[#131B23] font-normal line-clamp-1">{product.title}</div>
                            <div className="text-2xl text-[#BF0707] font-normal py-2">₹ {product.price}</div>
                        </div>
                        <div>
                            <div className="text-[#131B23] bg-[#DEE5FD] text-2xl font-normal py-3 text-center border-t-[3px] border-[#131B23]">Technical Specification</div>
                            <div className="py-4 font-normal text-[#131B23] text-lg">
                                {JSON.parse(product.field).name.map((f: any, index: any) => (
                                    index < 4 ?
                                        <div className="flex gap-4 flex-wrap items-center border-b-[1px] border-[#cccccc61]" key={index}>
                                            <div className='w-[40%]'>{f}</div>
                                            <div className='w-[55%]'>{JSON.parse(product.field).value[index]}</div>
                                        </div>
                                        : ''
                                ))}
                            </div>
                            <div className="flex items-center gap-2 w-full pr-3">
                                <button onClick={() => openEnquiry(product)} title='Enquiry' className="w-full px-3 py-2 bg-[#4356A2] text-lg text-white font-medium rounded-md h-[44px] gap-3"><i className="fa fa-paper-plane"></i> &nbsp; <span className="text-lg">Send Inquiry</span></button>
                                <Link title='Call Us' to={'tel:' + setting?.data?.mobile} className="bg-white text-[#131B23] border border-[#131B23] px-3 py-2 rounded-lg text-lg h-[44px]"><i className="fa fa-phone rotate-90"></i></Link>
                                <Link title='Whatsapp' to={`https://api.whatsapp.com/send?phone=${setting?.data?.mobile}&text=${product.title}`} target='_blank' className="bg-white text-[#131B23] border border-[#131B23] px-3 py-2 rounded-lg text-lg h-[44px]"><i className="fab fa-whatsapp"></i></Link>
                            </div>
                            <div className="py-4 pr-3">
                                <button onClick={() => handleClick(`/product/${product.slug}`)} title='Product Detail' className=" flex items-center text-[#131B23] font-medium text-xl"><div className="text-xl">View Full Details</div> <span className="text-2xl">&nbsp;</span> &#11111; <i className="fa fa-arrow-trend-up"></i></button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default QuickView;



