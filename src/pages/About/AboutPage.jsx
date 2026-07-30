// ==============================================
// IMPORTS
// ==============================================

import { Link } from "react-router-dom";
import { FaTshirt, FaShippingFast, FaAward, FaUsers } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

// Import image helper
import { getImage } from "../../config/images";

// ==============================================
// ABOUT PAGE
// ==============================================

function About() {
  return (
    <>
      {/* ================================= */}
      {/* HERO SECTION */}
      {/* ================================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          {/* On tablet (md) and below: image first, content second */}
          {/* On desktop (lg): image left, content right */}
          <div className="order-1 lg:order-1 mb-8 lg:mb-0">
            <img
              src={getImage("aboutHero", {
                width: 700,
                height: 400,
                quality: 75,
              })}
              alt="About SHOP.CO"
              loading="lazy"
              // FIXED: Changed static h-125 to responsive heights
              className="rounded-3xl shadow-lg w-full h-64 md:h-80 lg:h-125 object-cover"
            />
          </div>

          {/* Right - Content */}
          {/* On tablet (md) and below: content below image */}
          {/* On desktop (lg): content right of image */}
          <div className="order-2 lg:order-2">
            <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
              About Us
            </span>
            <h1 className="text-5xl font-akira-super mt-2 mb-6">
              Redefining Fashion
              <br />
              <span className="text-yellow-600">For Everyone</span>
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              At SHOP.CO, we believe that style is a universal language. Founded
              in 2020, our mission has been to make high-quality, fashionable
              clothing accessible to everyone, regardless of their budget or
              body type.
            </p>
            <p className="text-gray-600 text-lg mb-8">
              We curate collections from over 200 international brands, ensuring
              that every piece in our store meets our rigorous standards for
              quality, sustainability, and design excellence.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors cursor-pointer duration-300 group"
            >
              Explore Our Collection
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================= */}
      {/* STATS SECTION - No images here, so no changes needed */}
      {/* ================================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-black-600">200+</h3>
            <p className="text-gray-600 mt-1">International Brands</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-black-600">2,000+</h3>
            <p className="text-gray-600 mt-1">Products</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-black-600">30K+</h3>
            <p className="text-gray-600 mt-1">Happy Customers</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-black-600">4.9★</h3>
            <p className="text-gray-600 mt-1">Average Rating</p>
          </div>
        </div>
      </section>

      {/* ================================= */}
      {/* VALUES SECTION - Icons (no images) */}
      {/* ================================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
            Our Values
          </span>
          <h2 className="text-4xl font-akira-super mt-2">What We Stand For</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Value 1 - Quality */}
          <div className="text-center p-6 hover:shadow-lg rounded-2xl transition-shadow">
            <div className="w-16 h-16 border rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTshirt className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quality First</h3>
            <p className="text-gray-600">
              Every product undergoes rigorous quality checks before reaching
              you.
            </p>
          </div>

          {/* Value 2 - Fast Delivery */}
          <div className="text-center p-6 hover:shadow-lg rounded-2xl transition-shadow">
            <div className="w-16 h-16 border rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShippingFast className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Free express shipping on orders over $50. Delivered in 2-3 days.
            </p>
          </div>

          {/* Value 3 - Trusted */}
          <div className="text-center p-6 hover:shadow-lg rounded-2xl transition-shadow">
            <div className="w-16 h-16 border rounded-full flex items-center justify-center mx-auto mb-4">
              <FaAward className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trusted Quality</h3>
            <p className="text-gray-600">
              Curated from 200+ trusted international fashion brands.
            </p>
          </div>

          {/* Value 4 - Community */}
          <div className="text-center p-6 hover:shadow-lg rounded-2xl transition-shadow">
            <div className="w-16 h-16 border rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community Driven</h3>
            <p className="text-gray-600">
              30,000+ happy customers trust us for their fashion needs.
            </p>
          </div>
        </div>
      </section>

      {/* ================================= */}
      {/* MISSION SECTION - No images here */}
      {/* ================================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-black rounded-3xl p-12 text-white">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
                Our Mission
              </span>
              <h2 className="text-4xl font-bold mt-2 mb-6">
                Making Fashion <br />
                Accessible to All
              </h2>
              <p className="text-gray-300 text-lg">
                We're on a mission to democratize fashion. We believe everyone
                deserves to feel confident and stylish without breaking the
                bank. Our commitment to sustainability and ethical sourcing
                ensures that you can look good and feel good about your choices.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h4 className="text-3xl font-bold">2020</h4>
                <p className="text-gray-300 text-sm">Founded</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h4 className="text-3xl font-bold">200+</h4>
                <p className="text-gray-300 text-sm">Brands</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h4 className="text-3xl font-bold">30K+</h4>
                <p className="text-gray-300 text-sm">Customers</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h4 className="text-3xl font-bold">4.9★</h4>
                <p className="text-gray-300 text-sm">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================= */}
      {/* CTA SECTION - No images here */}
      {/* ================================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-akira-super mb-4">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover your new favorite
            outfit today.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors group cursor-pointer duration-300"
          >
            Start Shopping
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
          </Link>
        </div>
      </section>
    </>
  );
}

export default About;
