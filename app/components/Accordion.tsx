import { useState } from 'react';

export default function Accordion({ faqs }: any) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="w-full mx-auto space-y-4">
      {faqs.map((item: any, index: any) => (
        <div key={index} className="">
          {/* Accordion Header */}
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full p-4 text-left bg-[#4356A2]"
            title='header'
          >
            <div className="flex justify-between items-center text-white">
              <span className='text-lg font-normal'>{item.title}</span>
              <span className='text-xl font-normal'>{openIndex === index ? '-' : '+'}</span>
            </div>
          </button>

          {/* Accordion Content */}
          <div
            className={`transition-max-height duration-500 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
          >
            <div className="p-4 bg-white text-[#131B23] text-lg font-normal"><p>{item.description}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}
