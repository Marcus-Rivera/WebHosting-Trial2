import React, { useState } from "react";
import bg from "./assets/BG.png"; 
import { FaBars, FaTimes, FaFacebookF, FaInstagram } from "react-icons/fa";

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-yellow-300 rounded-lg shadow-lg p-6 w-[90%] max-w-3xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black text-xl cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-[#272343]">
          Contact Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form */}
          <form className="space-y-3">
            <input
              type="text"
              placeholder="Fullname"
              className="w-full px-3 py-2 border rounded-md focus:outline-none bg-white font-bold"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none bg-white font-bold"
            />
            <textarea
              placeholder="Message"
              rows="4"
              className="w-full px-3 py-2 border rounded-md focus:outline-none bg-white font-bold"
            ></textarea>
            <button
              type="submit"
              className="w-full py-2 rounded-md bg-[#272343] text-white hover:bg-yellow-400 hover:text-black transition"
            >
              Contact Us
            </button>
          </form>

          {/* Contact Info */}
          <div className="space-y-4 text-[#272343] font-semibold">
            <div>
              <p className="font-bold">Contact</p>
              <p className="text-sm">TaraTrabaho@gmail.com</p>
            </div>
            <div>
              <p className="font-bold">Based in</p>
              <p className="text-sm italic">Magsaysay Avenue, Makati</p>
            </div>
            <div>
              <p className="font-bold">Socials</p>
              <div className="flex gap-3 mt-1">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:scale-110 transition"
                >
                  <FaFacebookF size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:scale-110 transition"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Faqs = () => {
  const [isOpen, setIsOpen] = useState(false); // for mobile menu
  const [activeIndex, setActiveIndex] = useState(null); // track open FAQ
  const [contactOpen, setContactOpen] = useState(false); // for contact modal

  const faqs = [
    {
      question: "Wala ako pera pambayad subscription",
      answer: "Contact Kayle Matthew Calagui.",
    },
    {
      question: "How can I reset my password?",
      answer:
        "Click 'Forgot Password?' on the login page and enter your email. You'll receive an OTP or reset link to create a new password. For security, choose a strong password.",
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
        "Our AI Resume Builder helps you create professional resumes quickly by guiding you step-by-step and suggesting improvements.",
    },
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
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full text-[#272343] shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold italic">
            Tara
            <span className="text-yellow-400 drop-shadow-[2px_2px_0px_black]">
              Trabaho!
            </span>
          </h1>
          <ul className="hidden md:flex gap-8 font-bold">
            <li>
              <a href="/" className="hover:text-yellow-400 underline">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-yellow-400 underline">
                About Us
              </a>
            </li>
            <li>
              <button
                onClick={() => setContactOpen(true)}
                className="hover:text-yellow-400 underline"
              >
                Contact
              </button>
            </li>
            <li>
              <a href="/faqs" className="hover:text-yellow-400 underline">
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
              onClick={() => {
                setContactOpen(true);
                setIsOpen(false);
              }}
              className="block hover:text-yellow-400"
            >
              Contact
            </button>
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

      {/* CONTACT MODAL (reused from AboutUs) */}
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
};

export default Faqs;
