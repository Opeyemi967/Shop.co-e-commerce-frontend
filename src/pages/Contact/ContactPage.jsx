// ==============================================
// IMPORTS
// ==============================================

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";

// ==============================================
// CONTACT PAGE
// ==============================================

function Contact() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <>
      {/* ================================= */}
      {/* HERO SECTION */}
      {/* ================================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
            Contact Us
          </span>
          <h1 className="text-3xl font-akira-super mt-2 mb-6">
            We'd Love to Hear <br />
            <span className="text-yellow-600">From You</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Have questions about our products, orders, or anything else? Our
            team is here to help. Reach out to us through any of the channels
            below.
          </p>
        </div>
      </section>

      {/* ================================= */}
      {/* CONTACT INFO CARDS */}
      {/* ================================= */}
      <section className="max-w-7xl mx-auto px-6">
        {/* ============================================================ */}
        {/* CONTACT CARDS - Centered on mobile */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Address */}
          <div className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-shadow text-center md:text-left">
            <div className="w-12 h-12 border rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
              <FaMapMarkerAlt className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Visit Us</h3>
            <p className="text-gray-600 text-sm">
              123 Fashion Avenue
              <br />
              New York, NY 10001
              <br />
              United States
            </p>
          </div>

          {/* Phone */}
          <div className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-shadow text-center md:text-left">
            <div className="w-12 h-12 border rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
              <FaPhone className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm">
              +1 (555) 123-4567
              <br />
              Mon-Fri 9am-6pm EST
            </p>
          </div>

          {/* Email */}
          <div className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-shadow text-center md:text-left">
            <div className="w-12 h-12 border rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
              <FaEnvelope className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm">
              support@shopco.com
              <br />
              hello@shopco.com
            </p>
          </div>

          {/* Hours */}
          <div className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-shadow text-center md:text-left">
            <div className="w-12 h-12 border rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
              <FaClock className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Working Hours</h3>
            <p className="text-gray-600 text-sm">
              Mon - Fri: 9:00 AM - 6:00 PM
              <br />
              Sat: 10:00 AM - 4:00 PM
              <br />
              Sun: Closed
            </p>
          </div>
        </div>
      </section>

      {/* ================================= */}
      {/* CONTACT FORM + MAP */}
      {/* ================================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left - Contact Form */}
          <div className="bg-white border rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            {isSubmitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition"
                  placeholder="john@example.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition"
                  placeholder="Order Inquiry"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group duration-300 cursor-pointer"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <FiSend className="transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right - Map & Social */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-gray-100 rounded-3xl overflow-hidden h-75">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1x193595.91477246454!2d-74.11976317872931!3d40.69740344142058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shop.CO Location"
              ></iframe>
            </div>

            {/* Social Media */}
            <div className="bg-white border rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <p className="text-gray-600 mb-6">
                Follow us on social media for the latest updates, fashion tips,
                and exclusive offers.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-7 h-7" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-black hover:bg-linear-to-tr from-[#111111] via-[#333333] to-[#888888] hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <FaXTwitter className="w-6 h-6 hover:text-white" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 hover:bg-linear-to-tr from-[#fbc531] via-[#c13584] to-[#405de6] hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================= */}
      {/* FAQ SECTION */}
      {/* ================================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gray-50 rounded-3xl p-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl font-akira-super mt-2 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Can't find what you're looking for? Check out our most common
              questions below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg mb-2">
                What is your return policy?
              </h4>
              <p className="text-gray-600 text-sm">
                We offer a 30-day return policy on all unworn items. Simply
                contact our support team to initiate a return.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg mb-2">
                How long does shipping take?
              </h4>
              <p className="text-gray-600 text-sm">
                Standard shipping takes 3-5 business days. Express shipping is
                available for 2-3 day delivery.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg mb-2">
                Do you ship internationally?
              </h4>
              <p className="text-gray-600 text-sm">
                Yes, we ship to over 50 countries worldwide. Shipping fees and
                times vary by location.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg mb-2">
                How do I track my order?
              </h4>
              <p className="text-gray-600 text-sm">
                Once your order ships, you'll receive a tracking number via
                email to monitor your delivery status.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
