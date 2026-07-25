import React from "react";

const FAQPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Q: What is your return policy?
          </h3>
          <p className="text-gray-600">
            A: We accept returns within 30 days of purchase...
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Q: How long does shipping take?
          </h3>
          <p className="text-gray-600">
            A: Standard shipping takes 3-5 business days...
          </p>
        </div>
        {/* Add more FAQs here */}
      </div>
    </div>
  );
};

export default FAQPage;
