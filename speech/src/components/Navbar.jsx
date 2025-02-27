/* eslint-disable no-unused-vars */
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <a href="/" className="hover:text-blue-200">
          
            Nepali Speech to Text Converter
          </a>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <a href="/" className="hover:text-blue-200">
              Home
            </a>
          </li>
          <li>
            <a href="/features" className="hover:text-blue-200">
              Features
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-blue-200">
              About
            </a>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={() => {
            const menu = document.getElementById("mobile-menu");
            menu.classList.toggle("hidden");
          }}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className="hidden md:hidden bg-blue-700">
        <ul className="flex flex-col items-center py-4 space-y-4">
          <li>
            <a href="/" className="hover:text-blue-300">
              Home
            </a>
          </li>
          <li>
            <a href="#features" className="hover:text-blue-300">
              Features
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-blue-300">
              About
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
