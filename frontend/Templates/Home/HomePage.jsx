import React from 'react';
import { ArrowRight } from 'lucide-react';

const features = [
  "Collaborative Budgeting",
  "Expense Tracking",
  "Financial Goal Setting",
  "Insightful Reports"
];

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-4">Welcome to Smart Budget</h1>
      <p className="text-lg text-center text-gray-700 max-w-2xl">
        A collaborative family financial management tool to help you track expenses, set goals, and manage budgets efficiently.
      </p>
      <div className="mt-6 flex space-x-4">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          Get Started <ArrowRight size={20} />
        </button>
        <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition">
          Learn More
        </button>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-lg font-medium">{feature}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 flex space-x-4">
        {/* Social Media Icons */}
        <a href="#" className="text-gray-600 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.26 4.26 0 001.88-2.37 8.63 8.63 0 01-2.7 1.03 4.24 4.24 0 00-7.23 3.87 12.07 12.07 0 01-8.77-4.44 4.24 4.24 0 001.31 5.67 4.2 4.2 0 01-1.92-.53v.05a4.24 4.24 0 003.4 4.15 4.22 4.22 0 01-1.91.07 4.24 4.24 0 003.96 2.95 8.51 8.51 0 01-5.26 1.81A8.62 8.62 0 002 19.29a12.11 12.11 0 006.57 1.92c7.88 0 12.2-6.53 12.2-12.2l-.01-.56A8.6 8.6 0 0024 6.79a8.49 8.49 0 01-2.54.7z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
