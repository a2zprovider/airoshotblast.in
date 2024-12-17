import { Link } from '@remix-run/react';
import QuickView from './QuickView';
import { useState } from 'react';
import config from '~/config';
import { useModal } from './Modalcontext';

const ProductCard = ({ product }: any) => {
    const { openEnquiry, openQuickView } = useModal();

    return (
        <div>
            <div>
                <div className="relative group overflow-hidden shadow-md rounded-2xl">
                    <img src={product.thumb_image ? config.imgBaseURL + `/product/thumb/${product.thumb_image}` : config.imgBaseURL + `/product/${product.image}`} alt={product.title} loading="lazy" className="rounded-2xl w-full h-[456px] object-cover" />
                    <div>
                        <div className="absolute -bottom-[100px] left-0 right-0 top-[456px] group-hover:bottom-0 group-hover:top-0 transition-all duration-500 ease-in-out z-1 bg-[#00000030] text-white text-center text-2xl font-medium p-2 py-3 rounded-b-2xl gap-1"></div>
                        <button onClick={() => openQuickView(product)} title='Quick View' className="absolute top-2 -right-[130px] group-hover:right-2 transition-all duration-500 ease-in-out flex items-center z-1 bg-white text-base p-2 rounded-full gap-1">
                            <i className="fa fa-eye text-[#4356A2]"></i>Quick View
                        </button>
                        <button onClick={() => openEnquiry(product)} title='INQUIRY NOW' className="absolute -bottom-[100px] left-0 right-0 group-hover:bottom-0 transition-all duration-500 ease-in-out z-1 bg-[#00000099] text-white text-center text-2xl font-medium p-2 py-3 rounded-b-2xl gap-1">
                            INQUIRY NOW
                        </button>
                    </div>
                </div>
            </div>
            <Link title={product.title} to={`/product/${product.slug}`} className="text-sm font-normal text-[#131B23]">
                <div className='text-sm font-normal text-[#131B23] line-clamp-1 mt-4'>{product.title}</div>
            </Link>
            <div className="my-2 text-sm font-bold text-[#B62C2C]">₹ {product.price}</div>
        </div>
    );
};

export default ProductCard;
