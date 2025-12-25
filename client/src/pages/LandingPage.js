import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import img1 from '../img1.jpg';
import img2 from '../img2.jpg';
import img3 from '../img3.jpeg';
import img4 from '../img4.jpg';
import WaterBorneDiseasesChart from '../components/WaterBorneDiseasesChart';
import IndiaHeatmap from '../components/IndiaHeatmap';

const images = [img1, img2, img3, img4];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-dark-blue-bg">
      {/* Navbar */}
      <nav className="bg-opacity-75 p-4 w-full z-20 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400 transition duration-300">
            Smart Health
          </Link>
          <div className="space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white transition duration-300">Home</Link>
            <Link to="/features" className="text-gray-300 hover:text-white transition duration-300">Features</Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition duration-300">About Us</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition duration-300">Contact</Link>
            <Link to="/login" className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition duration-300">Login</Link>
            <Link to="/register" className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition duration-300">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        
        <div className="slideshow-container absolute top-0 left-0 w-full h-full overflow-hidden">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              className={`slideshow-image ${index === currentSlide ? 'active' : ''}`}
              alt={`Slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="relative z-20 text-center p-4">
          <h1 className="text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
            Empowering Health, Ensuring Safety
          </h1>
          <p className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">
            Your intelligent partner for proactive health monitoring and disease prevention.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link to="/login">
              <button className="px-10 py-4 text-xl font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transform hover:scale-105 transition duration-300 shadow-lg">
                Get Started
              </button>
            </Link>
            <Link to="/features">
              <button className="px-10 py-4 text-xl font-semibold text-white bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-900 transform hover:scale-105 transition duration-300 shadow-lg">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Water-borne Diseases Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-12 animate-fade-in-down">
            Combatting Water-borne Diseases
          </h2>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto animate-fade-in-up">
            Water-borne diseases pose a significant global health threat, affecting millions annually. Our system helps in early detection and prevention.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Disease Card 1: Cholera */}
            <div className="bg-gray-700 p-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 animate-fade-in-up">
              <h3 className="text-3xl font-semibold text-white mb-4">Cholera</h3>
              <p className="text-gray-300 mb-4">
                A severe bacterial infection causing acute watery diarrhea, leading to rapid dehydration.
              </p>
              <ul className="text-left text-gray-400 list-disc list-inside">
                <li>Severe watery diarrhea</li>
                <li>Vomiting</li>
                <li>Leg cramps</li>
              </ul>
              <a href="#!" className="mt-6 inline-block text-blue-400 hover:text-blue-300 font-medium">Learn More &rarr;</a>
            </div>

            {/* Disease Card 2: Typhoid Fever */}
            <div className="bg-gray-700 p-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 animate-fade-in-up animation-delay-200">
              <h3 className="text-3xl font-semibold text-white mb-4">Typhoid Fever</h3>
              <p className="text-gray-300 mb-4">
                Caused by Salmonella Typhi, characterized by high fever, fatigue, and abdominal pain.
              </p>
              <ul className="text-left text-gray-400 list-disc list-inside">
                <li>Sustained high fever</li>
                <li>Weakness, fatigue</li>
                <li>Stomach pain</li>
              </ul>
              <a href="#!" className="mt-6 inline-block text-blue-400 hover:text-blue-300 font-medium">Learn More &rarr;</a>
            </div>

            {/* Disease Card 3: Dysentery */}
            <div className="bg-gray-700 p-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 animate-fade-in-up animation-delay-400">
              <h3 className="text-3xl font-semibold text-white mb-4">Dysentery</h3>
              <p className="text-gray-300 mb-4">
                An infection of the intestines resulting in bloody diarrhea, fever, and abdominal cramps.
              </p>
              <ul className="text-left text-gray-400 list-disc list-inside">
                <li>Bloody or mucous diarrhea</li>
                <li>Abdominal cramps</li>
                <li>Fever</li>
              </ul>
              <a href="#!" className="mt-6 inline-block text-blue-400 hover:text-blue-300 font-medium">Learn More &rarr;</a>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-4xl font-bold text-white mb-6">Key Statistics</h3>
            <div className="flex justify-center space-x-12">
              <div className="text-center animate-fade-in-up">
                <p className="text-6xl font-extrabold text-blue-400">1.5M</p>
                <p className="text-xl text-gray-300 mt-2">Deaths Annually</p>
              </div>
              <div className="text-center animate-fade-in-up animation-delay-200">
                <p className="text-6xl font-extrabold text-green-400">842K</p>
                <p className="text-xl text-gray-300 mt-2">Due to Lack of WASH</p>
              </div>
              <div className="text-center animate-fade-in-up animation-delay-400">
                <p className="text-6xl font-extrabold text-purple-400">7.2M</p>
                <p className="text-xl text-gray-300 mt-2">Illnesses in US Annually</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="py-20 bg-gray-800 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-12 animate-fade-in-down">
            Visualizing the Impact
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="bg-gray-700 p-8 rounded-lg shadow-xl animate-fade-in-right">
              <h3 className="text-3xl font-semibold text-white mb-4">Water-borne Diseases in Northeast India</h3>
              <WaterBorneDiseasesChart />
            </div>
            <div className="bg-gray-700 p-8 rounded-lg shadow-xl animate-fade-in-left">
              <h3 className="text-3xl font-semibold text-white mb-4">Heatmap of Water-borne Diseases in India</h3>
              <IndiaHeatmap />
            </div>
          </div>
        </div>
      </section>

      {/* Health Articles and Videos Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-white mb-12 text-center animate-fade-in-down">
            Stay Informed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Article 1 */}
            <div className="bg-gray-700 rounded-lg shadow-xl overflow-hidden transform hover:-translate-y-2 transition duration-300 animate-fade-in-up">
              <img src="/images/article1.jpg" alt="Article thumbnail" className="w-full h-48 object-cover"/>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-white mb-3">Preventing Cholera and Other Waterborne Diseases</h3>
                <p className="text-gray-400 mb-4">Learn about simple yet effective measures to protect yourself and your family from waterborne illnesses.</p>
                <a href="#!" className="text-blue-400 hover:text-blue-300 font-medium">Read More &rarr;</a>
              </div>
            </div>
            {/* Article 2 */}
            <div className="bg-gray-700 rounded-lg shadow-xl overflow-hidden transform hover:-translate-y-2 transition duration-300 animate-fade-in-up animation-delay-200">
              <img src="/images/article2.jpg" alt="Article thumbnail" className="w-full h-48 object-cover"/>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-white mb-3">The Importance of Safe Drinking Water</h3>
                <p className="text-gray-400 mb-4">Discover why access to clean water is crucial for public health and how to ensure your water is safe.</p>
                <a href="#!" className="text-blue-400 hover:text-blue-300 font-medium">Read More &rarr;</a>
              </div>
            </div>
            {/* Video 1 */}
            <div className="bg-gray-700 rounded-lg shadow-xl overflow-hidden transform hover:-translate-y-2 transition duration-300 animate-fade-in-up animation-delay-400">
              <iframe className="w-full h-48" src="https://www.youtube.com/embed/pTBfPf0Z3FE?si=vjvCRJUdVHjRWYJ2" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-white mb-3">Understanding Water-borne Diseases</h3>
                <p className="text-gray-400">A short video explaining the common types of water-borne diseases and their symptoms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Placeholder) */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-12">
            Our Advanced Features
          </h2>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            Discover how our Smart Health Monitoring System provides comprehensive care and insights.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <h3 className="text-3xl font-semibold text-white mb-4">Real-time Monitoring</h3>
              <p className="text-gray-300">Track vital signs and health metrics continuously.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <h3 className="text-3xl font-semibold text-white mb-4">Symptom Checker</h3>
              <p className="text-gray-300">Intelligent analysis of symptoms for early diagnosis.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <h3 className="text-3xl font-semibold text-white mb-4">Emergency SOS</h3>
              <p className="text-gray-300">Instant alerts to emergency contacts and services.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <h3 className="text-3xl font-semibold text-white mb-4">Educational Resources</h3>
              <p className="text-gray-300">Access to a wealth of health information and guides.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <h3 className="text-3xl font-semibold text-white mb-4">Personalized Insights</h3>
              <p className="text-gray-300">Tailored health recommendations based on your data.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <h3 className="text-3xl font-semibold text-white mb-4">Family Health Management</h3>
              <p className="text-gray-300">Manage health profiles for your entire family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-opacity-75 p-8 text-center relative z-10">
        <div className="container mx-auto">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Smart Health Monitoring System. Tech Gladiators.</p>
          <div className="mt-4 space-x-4">
            <a href="#!" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a>
            <a href="#!" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
