import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import {
  FiCheckCircle,
  FiArrowRight,
  FiPackage,
  FiTruck,
  FiClock,
} from "react-icons/fi";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const { order, orderNumber } = location.state || {};

  //  Calculate delivery date once using useMemo
  const deliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  //  If no order, show fallback
  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
        <Link
          to="/products"
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  //  Safety check: if order.items is missing or empty
  const orderItems = order.items || [];
  const subtotal = order.subtotal || 0;
  const discount = order.discount || 0;
  const deliveryFee = order.deliveryFee || 0;
  const total = order.total || 0;

  //  If no items, show fallback
  if (orderItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Order is Empty</h2>
        <p className="text-gray-500 mb-6">
          Your order doesn't contain any items.
        </p>
        <Link
          to="/products"
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <FiCheckCircle className="text-green-500 text-8xl" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </div>

      {/* Order Info */}
      <div className="border rounded-2xl p-8 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-bold">
              {orderNumber || order.orderNumber || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="font-bold">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-bold text-2xl">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-2xl p-6 text-center">
          <FiPackage className="text-2xl mx-auto mb-3 text-blue-500" />
          <h4 className="font-semibold">Order Confirmed</h4>
          <p className="text-sm text-gray-500">Your order has been confirmed</p>
        </div>
        <div className="border rounded-2xl p-6 text-center">
          <FiTruck className="text-2xl mx-auto mb-3 text-yellow-500" />
          <h4 className="font-semibold">Processing</h4>
          <p className="text-sm text-gray-500">Your order is being processed</p>
        </div>
        <div className="border rounded-2xl p-6 text-center">
          <FiClock className="text-2xl mx-auto mb-3 text-green-500" />
          <h4 className="font-semibold">Estimated Delivery</h4>
          <p className="text-sm text-gray-500">{deliveryDate}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="border rounded-2xl p-8 mb-8">
        <h3 className="text-xl font-bold mb-4">Order Items</h3>
        <div className="divide-y">
          {orderItems.map((item, index) => {
            const itemPrice = item.price || 0;
            const itemQuantity = item.quantity || 1;
            const itemImage = item.image || "https://via.placeholder.com/64";

            return (
              <div key={index} className="py-4 flex justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={itemImage}
                    alt={item.name || "Product"}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/64";
                    }}
                  />
                  <div>
                    <p className="font-medium">{item.name || "Product"}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {itemQuantity}
                    </p>
                  </div>
                </div>
                <p className="font-bold">
                  ${(itemPrice * itemQuantity).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="border rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">Shipping Address</h3>
          <div className="space-y-1 text-gray-600">
            <p>
              {order.shippingAddress.firstName || ""}{" "}
              {order.shippingAddress.lastName || ""}
            </p>
            <p>{order.shippingAddress.address || ""}</p>
            <p>
              {order.shippingAddress.city || ""},{" "}
              {order.shippingAddress.state || ""}{" "}
              {order.shippingAddress.zipCode || ""}
            </p>
            <p>{order.shippingAddress.country || ""}</p>
            <p className="mt-2">Email: {order.shippingAddress.email || ""}</p>
            {order.shippingAddress.phone && (
              <p>Phone: {order.shippingAddress.phone}</p>
            )}
          </div>
        </div>
      )}

      {/* Continue Shopping */}
      <div className="flex justify-center">
        <Link
          to="/products"
          className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition flex items-center gap-2"
        >
          Continue Shopping
          <FiArrowRight className="text-xl" />
        </Link>
      </div>
    </section>
  );
};

export default OrderConfirmationPage;
