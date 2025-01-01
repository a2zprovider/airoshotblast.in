import { Link } from '@remix-run/react';
import config from '~/config';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const BlogCard = ({ blog }: any) => {
    const [full_url, setFullUrl] = useState('');

    useEffect(() => {
        const currentUrl = window.location.href;
        setFullUrl(currentUrl);
    }, []);
    return (
        <div className='border rounded-2xl border-transparent hover:border-theme transition-all duration-[800ms] ease-in-out'>
            <div className='relative'>
                <img src={blog.thumb_image ? config.imgBaseURL + `blog/thumb/${blog.thumb_image}` : config.imgBaseURL + `blog/${blog.image}`} alt={blog.title} loading="lazy" className="rounded-t-2xl w-full h-[260px]" />
                {blog.createdAt ?
                    <div className='absolute bottom-2 left-2 bg-white px-2 py-1 rounded-lg text-sm font-normal text-[#131B23]'>Published on: {format(new Date(blog.createdAt), 'MMM dd, yyyy')}</div>
                    : <></>}
                <div className='absolute bottom-2 right-2 bg-white px-2 py-1 rounded-lg text-sm font-normal text-[#131B23] flex items-center gap-2'>
                    <div className='text-sm'>Share:</div>
                    <Link title='whatsapp' to={'https://api.whatsapp.com/send?text=' + blog.title + ' ' + full_url}><i className='fab fa-whatsapp'></i></Link>
                    <Link title='facebook' to={'https://www.facebook.com/sharer/sharer.php?u=' + full_url}><i className='fab fa-facebook-f'></i></Link>
                </div>
            </div>
            <div className="bg-[#f4f4f4] p-3 rounded-b-2xl shadow-md">
                <Link title={blog.title} to={'/blog/' + blog.slug} className="text-base font-medium text-[#131B23] hover:text-theme pb-1 line-clamp-1 transition-all duration-[800ms] ease-in-out">{blog.title}</Link>
                <p className="text-base font-normal text-[#131B23] line-clamp-3 leading-6 h-[72px] text-justify">{blog.except}</p>
            </div>
        </div>
    );
};

export default BlogCard;
