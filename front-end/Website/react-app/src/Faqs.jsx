import React, { useState } from "react";
import bg from "./assets/BG.png"; // ✅ background image
import { FaBars, FaTimes } from "react-icons/fa";
import { FaFacebook, FaInstagram } from "react-icons/fa"; // socials

const Faqs = () => {
  const [isOpen, setIsOpen] = useState(false); // for mobile menu
  const [activeIndex, setActiveIndex] = useState(null); // track open FAQ
  const [contactOpen, setContactOpen] = useState(false); // for contact modal

  // ✅ FAQ items (EDIT THIS PART to change questions & answers)
  const faqs = [
    {
      question: "Wala ako pera pambayad subscription",
      answer: "Contact Kayle Matthew Calagui. ",
    },
    {
      question: "How can I reset my password?",
      answer:
        "If you need to reset your TaraTrabaho account password, simply click on the 'Forgot Password?' link on the login page and enter the email address associated with your account. You will receive a One-Time Password (OTP) or a reset link in your email. Use the OTP or follow the link to create a new password. Once updated, you can log in again using your new credentials. For security, we recommend choosing a strong password and keeping it private.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach our support team by clicking on the Contact option in the navigation bar or by sending an email to support@taratrabaho.com.",
    },
    {
      question: "Is my personal data secure?",
      answer:
        "Yes, we prioritize your privacy and security. All personal data is encrypted and handled in compliance with data protection laws.",
    },
    {
      question: "How does the AI Resume Builder work?",
      answer:
        "Our AI Resume Builder helps you create professional resumes quickly by guiding you step-by-step and suggesting improvements to your content.",
    },
  ];

  // Toggle accordion
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Handle overlay click (click outside modal to close)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setContactOpen(false);
    }
  };

  return (
    <div
      className="bg-cover min-h-screen flex flex-col"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-[#272343] text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold italic">
            Tara<span className="text-yellow-400">Trabaho!</span>
          </h1>
          <ul className="hidden md:flex gap-8 font-semibold">
            <li>
              <a href="/" className="hover:text-yellow-400">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-yellow-400">
                About Us
              </a>
            </li>
            <li>
              <button
                onClick={() => setContactOpen(true)}
                className="hover:text-yellow-400"
              >
                Contact
              </button>
            </li>
            <li>
              <a href="/faqs" className="hover:text-yellow-400">
                FAQs
              </a>
            </li>
          </ul>
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-[#272343] text-white px-4 py-3 space-y-3">
            <a href="/" className="block hover:text-yellow-400">
              Home
            </a>
            <a href="/about" className="block hover:text-yellow-400">
              About Us
            </a>
            <button
              onClick={() => setContactOpen(true)}
              className="block hover:text-yellow-400 w-full text-left"
            >
              Contact
            </button>
            <a href="/faqs" className="block hover:text-yellow-400">
              FAQs
            </a>
          </div>
        )}
      </nav>

      {/* ✅ Contact Modal (No dark background) */}
      {contactOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-yellow-400 rounded-lg p-6 w-full max-w-3xl relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setContactOpen(false)}
              className="absolute top-3 right-3 text-2xl font-bold text-[#272343] hover:text-black"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-center text-[#272343] mb-6">
              Contact Us
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left - Form */}
              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Fullname"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#272343]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#272343]"
                />
                <textarea
                  placeholder="Message"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#272343]"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-[#272343] text-white py-2 rounded-md hover:bg-[#1a1a2e] transition-colors font-semibold"
                >
                  Contact Us
                </button>
              </form>

              {/* Right - Info */}
              <div className="space-y-4 text-[#272343]">
                <div>
                  <strong className="text-lg">Contact</strong>
                  <br />
                  <span>TaraTrabaho@gmail.com</span>
                </div>
                <div>
                  <strong className="text-lg">Based in</strong>
                  <br />
                  <em>Magsaysay Avenue, Makati</em>
                </div>
                <div>
                  <strong className="text-lg">Socials</strong>
                  <div className="flex gap-4 mt-2 text-2xl">
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaFacebook />
                    </a>
                    <a
                      href="#"
                      className="text-pink-600 hover:text-pink-800 transition-colors"
                    >
                      <FaInstagram />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center mt-20 px-4">
        <h2 className="text-3xl font-bold text-[#272343] mb-8">FAQs</h2>

        <div className="w-full max-w-2xl space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-400 rounded-md overflow-hidden bg-white"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-4 py-3 text-left text-lg font-semibold text-[#272343] hover:bg-gray-100"
              >
                {faq.question}
                <span>{activeIndex === index ? "▼" : "▶"}</span>
              </button>
              {activeIndex === index && (
                <div className="px-4 py-3 text-sm text-gray-700 bg-gray-50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faqs;