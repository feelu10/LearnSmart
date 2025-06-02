import React from 'react';
import './LandingPage.css'; // Optional: only if you add custom styles

function LandingPage() {
  return (
    <div className="bg-gray-50 text-gray-800 font-['Inter']">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
                src="logo.png"
                className="h-16 w-16"
                alt="Logo"
                />
            <h1 className="text-2xl font-bold text-sky-600">
              Learn<span className="text-gray-900">Smart</span>
            </h1>
          </div>
          <div className="space-x-4">
            <a href="/web/login" className="text-sm font-medium text-gray-700 hover:text-sky-600">
              Login
            </a>
            <a
              href="/web/register"
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 shadow"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-sky-50 to-white">
        <h2 className="text-4xl font-bold mb-4">AI-Powered Quiz Generation</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Instantly create engaging, curriculum-based quizzes using AI. Save time and empower students to learn smarter.
        </p>
        <a
          href="/web/generate-quiz"
          className="px-6 py-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 text-lg transition"
        >
          Generate Your First Quiz
        </a>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition">
            <img src="https://img.icons8.com/fluency/48/ai.png" className="mx-auto mb-4" alt="AI Icon" />
            <h3 className="text-xl font-semibold mb-2">AI-Generated Questions</h3>
            <p className="text-gray-600">
              Upload material or enter a topic to instantly get tailored questions based on your content.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition">
            <img
              src="https://img.icons8.com/color/48/000000/graduation-cap.png"
              className="mx-auto mb-4"
              alt="Analytics Icon"
            />
            <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
            <p className="text-gray-600">
              Visualize student performance and adapt your teaching strategy with real-time analytics.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition">
            <img
              src="https://img.icons8.com/color/48/cloud-storage.png"
              className="mx-auto mb-4"
              alt="Cloud Icon"
            />
            <h3 className="text-xl font-semibold mb-2">Secure Cloud Access</h3>
            <p className="text-gray-600">
              All your quizzes and data are stored safely in the cloud — accessible anytime, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-sky-50 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Building Smarter Quizzes Today</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Join thousands of educators using LearnSmart to revolutionize their classrooms with AI.
        </p>
        <a
          href="/web/register"
          className="px-8 py-3 text-white bg-sky-500 rounded-full hover:bg-sky-600 text-lg shadow"
        >
          Create an Account
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; 2025 LearnSmart Inc. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-600 hover:text-sky-600">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-sky-600">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
