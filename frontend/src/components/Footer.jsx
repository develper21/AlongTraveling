import { HeartIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import discordIcon from '../assets/Discord-icon.png';
import githubIcon from '../assets/github-icon.png';
import twitterIcon from '../assets/twitter-icon.png';
import hopAlongLogo from '../assets/logo.png';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-lg">
                <img
                  src={hopAlongLogo}
                  alt="HopAlong logo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HopAlong
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Connecting travelers for memorable journeys. Find companions, share rides, and explore together.
            </p>
            <p className="text-sm text-gray-500 mt-6">
              © {currentYear} HopAlong • Built for the travel community
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Navigation</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Home</Link></li>
                <li><Link to="/create" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Create Trip</Link></li>
                <li><Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Dashboard</Link></li>
                <li><Link to="/profile/me" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">My Profile</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">FAQs</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Made with</span>
              <HeartIcon className="w-4 h-4 text-red-500 animate-pulse" />
              <span>for travelers everywhere</span>
            </div>
            <div className="flex space-x-4 items-center">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                aria-label="Twitter"
              >
                <img 
                  src={twitterIcon} 
                  alt="Twitter" 
                  className="h-8 w-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="GitHub"
              >
                <img 
                  src={githubIcon} 
                  alt="GitHub" 
                  className="h-9 w-9 object-contain opacity-70 group-hover:opacity-100 transition-opacity bg-black rounded-full border-none"
                />
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-2 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                aria-label="Discord"
              >
                <img 
                  src={discordIcon} 
                  alt="Discord" 
                  className="h-8 w-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
