import React, { useState } from "react";
import bg from "./assets/BG.png"; // ✅ background image
import { FaBars, FaTimes } from "react-icons/fa";

const Faqs = () => {
  const [isOpen, setIsOpen] = useState(false); // for mobile menu
  const [activeIndex, setActiveIndex] = useState(null); // track open FAQ

  // ✅ FAQ items (EDIT THIS PART to change questions & answers)
  const faqs = [
    {
      question: "Wala ako pera pambayad subscription",
      answer:
        "Contact Kayle Matthew Calagui. "
    },
    {
      question: "How can I reset my password?",
      answer:
        "If you need to reset your TaraTrabaho account password, simply click on the 'Forgot Password?' link on the login page and enter the email address associated with your account. You will receive a One-Time Password (OTP) or a reset link in your email. Use the OTP or follow the link to create a new password. Once updated, you can log in again using your new credentials. For security, we recommend choosing a strong password and keeping it private."
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach our support team by clicking on the Contact option in the navigation bar or by sending an email to support@taratrabaho.com."
    },
    {
      question: "Is my personal data secure?",
      answer:
        "Yes, we prioritize your privacy and security. All personal data is encrypted and handled in compliance with data protection laws."
    },
    {
      question: "How does the AI Resume Builder work?",
      answer:
        "Our AI Resume Builder helps you create professional resumes quickly by guiding you step-by-step and suggesting improvements to your content."
    }
  ];

  // Toggle accordion
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div
      className="bg-cover min-h-screen flex flex-col"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* NAVBAR (same design as AboutUsPage) */}
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
                About us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-yellow-400">
                Contact
              </a>
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
              About us
            </a>
            <a href="/contact" className="block hover:text-yellow-400">
              Contact
            </a>
            <a href="/faqs" className="block hover:text-yellow-400">
              FAQs
            </a>
          </div>
        )}
      </nav>

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
