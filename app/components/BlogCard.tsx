import { Link } from '@remix-run/react';
import config from '~/config';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const BlogCard = ({ blog }: any) => {
    const [full_url, setFullUrl] = useState('');

    useEffect(() => {
        // Access the full URL from the browser's window.location
        const currentUrl = window.location.href;
        setFullUrl(currentUrl);
    }, []);
    return (
        <div>
            <div className='relative'>
                <img src={config.imgBaseURL + `/blog/${blog.image}`} alt={blog.title} loading="lazy" className="rounded-t-2xl h-[260px] w-full" />
                {blog.createdAt ?
                    <div className='absolute bottom-2 left-2 bg-white px-2 py-1 rounded-lg text-sm font-normal text-[#131B23]'>{format(new Date(blog.createdAt), 'dd MMM yyyy')}</div>
                    : <></>}
                <div className='absolute bottom-2 right-2 bg-white px-2 py-1 rounded-lg text-sm font-normal text-[#131B23] flex items-center gap-2'>
                    <div className='text-sm'>Share:</div>
                    <Link to={'https://api.whatsapp.com/send?text=' + blog.title + ' ' + full_url}><i className='fab fa-whatsapp'></i></Link>
                    <Link to={'https://www.facebook.com/sharer/sharer.php?u=' + full_url}><i className='fab fa-facebook-f'></i></Link>
                </div>
            </div>
            <div className="bg-[#f4f4f4] p-3 rounded-b-2xl shadow-md">
                <Link to={'/blog/' + blog.slug}>
                    <div className="text-sm font-medium text-[#131B23] pb-1 truncate">{blog.title}</div>
                </Link>
                <p className="text-sm font-normal text-[#131B23] line-clamp-4 leading-5">{blog.except}</p>
            </div>
        </div>
    );
};

export default BlogCard;
