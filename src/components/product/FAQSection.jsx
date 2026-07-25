// ==============================================
// FAQ SECTION
// ==============================================

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "Is this product true to size?",
      answer:
        "Yes, this product follows standard sizing. We recommend choosing your usual size for the best fit.",
    },
    {
      question: "What material is used?",
      answer:
        "This product is made from premium soft cotton designed for comfort, and durability.",
    },
    {
      question: "Can I return this product?",
      answer:
        "Yes, returns are accepted within 14 days of delivery if the product remains unused and in original condition.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-7 business days depending on your delivery location.",
    },
  ];

  return (
    <div className="mt-16 space-y-5">
      {faqs.map((faq, index) => (
        <div key={index} className="border rounded-[20px] p-6">
          <button
            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-bold">{faq.question}</h3>
            <FaChevronDown
              className={`transition duration-300 ${
                openFAQ === index ? "rotate-180" : ""
              }`}
            />
          </button>
          {openFAQ === index && (
            <p className="text-gray-600 leading-8 mt-5">{faq.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQSection;
