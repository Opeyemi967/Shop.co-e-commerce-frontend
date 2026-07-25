// ==============================================
// PRODUCT TABS (Navigation)
// ==============================================

const ProductTabs = ({ activeTab, setActiveTab, tabs }) => {
  const defaultTabs = tabs || ["details", "reviews", "faqs"];

  const tabLabels = {
    details: "Product Details",
    reviews: "Rating & Reviews",
    faqs: "FAQs",
  };

  return (
    <div className="mt-24 border-b">
      <div className="flex justify-center gap-16 text-lg">
        {defaultTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-5 cursor-pointer transition ${
              activeTab === tab
                ? "border-b-2 border-black font-semibold text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tabLabels[tab] || tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductTabs;
