// ==============================================
// PRODUCT BREADCRUMB
// ==============================================

import Breadcrumb from "../common/Breadcrumb";

const ProductBreadcrumb = ({ productName }) => {
  return (
    <Breadcrumb
      items={[
        {
          name: "Products",
          path: "/products",
        },
        {
          name: productName,
        },
      ]}
    />
  );
};

export default ProductBreadcrumb;
