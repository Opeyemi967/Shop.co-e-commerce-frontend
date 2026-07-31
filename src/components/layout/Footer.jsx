// src/components/layout/Footer.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPinterest,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaApplePay,
  FaGooglePay,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiSend, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { toast } from "react-hot-toast";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickLinks = [
    { name: "All Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Wishlist", path: "/wishlist" },
  ];

  const customerServiceLinks = [
    { name: "FAQ", path: "/faq" },
    { name: "Shipping Policy", path: "/shipping" },
    { name: "Returns & Exchanges", path: "/returns" },
    { name: "Privacy Policy", path: "/privacy" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
    { icon: FaXTwitter, href: "https://twitter.com", label: "Twitter (X)" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
    { icon: FaPinterest, href: "https://pinterest.com", label: "Pinterest" },
  ];

  const paymentMethods = [
    { icon: FaCcVisa, label: "Visa" },
    { icon: FaCcMastercard, label: "Mastercard" },
    { icon: FaCcAmex, label: "American Express" },
    { icon: FaCcPaypal, label: "PayPal" },
    { icon: FaApplePay, label: "Apple Pay" },
    { icon: FaGooglePay, label: "Google Pay" },
  ];

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Newsletter subscription handler
  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Store in localStorage (for demo)
      const subscribers = JSON.parse(
        localStorage.getItem("subscribers") || "[]",
      );

      // Check if already subscribed
      if (subscribers.includes(email)) {
        toast.error("You have already subscribed!");
        setIsSubmitting(false);
        return;
      }

      // Add new subscriber
      subscribers.push(email);
      localStorage.setItem("subscribers", JSON.stringify(subscribers));

      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-black text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-400 text-sm">
                Get the latest updates on new products and upcoming sales
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
                disabled={isSubmitting}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 cursor-pointer md:px-4 md:py-2.5 md:text-sm"
              >
                <FiSend className="md:w-4 md:h-4" />
                <span className="md:hidden">Subscribe</span>
                <span className="hidden md:inline">Subscribe</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              onClick={scrollToTop}
              className="text-xl font-akira-super text-white inline-block mb-4"
            >
              SHOP.CO
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted fashion and lifestyle store. Quality products,
              exceptional service, and style that speaks for itself.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Scrolls to top */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service - Shows content pages */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {customerServiceLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <FiMapPin className="text-white mt-0.5 shrink-0" size={18} />
                <span>123 Fashion Street, NYC 10001</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FiPhone className="text-white shrink-0" size={18} />
                <a
                  href="tel:+1234567890"
                  className="hover:text-white transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FiMail className="text-white shrink-0" size={18} />
                <a
                  href="mailto:support@shopco.com"
                  className="hover:text-white transition-colors"
                >
                  support@shopco.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} SHOP.CO. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-2xl text-gray-500">
              {paymentMethods.map((method, index) => (
                <method.icon
                  key={index}
                  className="hover:text-white transition-colors"
                  aria-label={method.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
