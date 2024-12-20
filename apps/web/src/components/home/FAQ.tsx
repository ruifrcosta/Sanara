import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is Sanara?',
      answer: 'Sanara is a comprehensive healthcare management platform designed to streamline clinic operations, improve patient care, and enhance overall efficiency.'
    },
    {
      question: 'How secure is my data?',
      answer: 'We employ industry-leading security measures, including end-to-end encryption and regular security audits, to ensure your data is protected at all times.'
    },
    {
      question: 'Can I integrate with existing systems?',
      answer: 'Yes, Sanara offers seamless integration with most popular healthcare systems and third-party applications through our robust API.'
    },
    {
      question: 'What support options are available?',
      answer: 'We provide 24/7 customer support through multiple channels, including live chat, email, and phone. Our dedicated team is always ready to assist you.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center py-20 px-[156px] bg-[#F8FAFC]">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-[#1A1D1F] mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-[#6F767E]">
          Find answers to common questions about our platform
        </p>
      </div>

      <div className="w-full max-w-3xl">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="mb-4 overflow-hidden rounded-2xl bg-white"
          >
            <button
              className="flex w-full items-center justify-between p-6 text-left"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-lg font-semibold text-[#1A1D1F]">
                {faq.question}
              </span>
              <ChevronDownIcon
                className={`h-5 w-5 text-[#6F767E] transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all ${
                openIndex === index ? 'max-h-40' : 'max-h-0'
              }`}
            >
              <p className="px-6 pb-6 text-[#6F767E]">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ; 