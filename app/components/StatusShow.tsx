import { useModal } from './Modalcontext';

const StatusShow = () => {
    const { isStatusShowOpen, modalStatusShowData, closeStatusShow } = useModal();
    const data = modalStatusShowData;

    if (!isStatusShowOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-[10001]" onClick={closeStatusShow}>
                <div className="relative bg-[#E9F1F7] rounded-2xl shadow-lg w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center items-center mb-4">
                        <div className={`w-[110px] h-[110px] bg-[#4356A2] ${data.status ? '' : ''} rounded-full flex items-center justify-center`}>
                            {data.status ? <i className='fa fa-check text-6xl text-white'></i> : <i className='fa fa-times text-6xl text-white'></i>}
                        </div>
                    </div>
                    <button
                        className="absolute top-1 right-3 text-2xl text-gray-500 hover:text-gray-700"
                        onClick={closeStatusShow}
                    >
                        &times;
                    </button>

                    <div className="text-2xl font-medium text-[#131B23] text-center mb-4">
                        {data.status ? 'Thank you for getting in touch!' : 'Error Occurred!'}
                    </div>
                    <p className="text-xl font-normal text-[#131B23] text-center mb-4">
                        {data.status ? data.success : data.error}
                    </p>
                </div>
            </div>
        </>
    );
};

export default StatusShow;



