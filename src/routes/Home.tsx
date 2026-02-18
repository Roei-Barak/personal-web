import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Phone, MapPin, Download, Terminal, Shield, Cpu, Server, ExternalLink, ChevronRight, Car, MessageCircle, Globe, Sun, Moon, Home as HomeIcon  } from 'lucide-react';
function Home() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 dark:text-white transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-gray-700" />}
      </button>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 animate-gradient"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-20 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white animate-fade-in">
              Roei Barak
            </h1>
            <h2 className="text-2xl md:text-3xl mb-8 text-blue-200 animate-fade-in-delay-1">
              Software Engineer | Embedded Systems | IT & Security Expert
            </h2>
            <div className="flex flex-wrap justify-center gap-6 text-lg animate-fade-in-delay-2">
              <a href="mailto:Roeibarak123@gmail.com" 
                className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all duration-300 text-white glass-effect">
                <Mail size={20} /> Roeibarak123@gmail.com
              </a>
              <a href="tel:050-5854505" 
                className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all duration-300 text-white glass-effect">
                <Phone size={20} /> 050-5854505
              </a>
              <span className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-10 rounded-full text-white glass-effect">
                <MapPin size={20} /> Israel
              </span>
            </div>
            <div className="mt-8 flex justify-center gap-6 animate-fade-in-delay-3">
              <a href="https://github.com" 
                className="p-4 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all duration-300 text-white glass-effect">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com" 
                className="p-4 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all duration-300 text-white glass-effect">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <ChevronRight size={40} className="text-white opacity-50 rotate-90 animate-bounce" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-20">
          {/* Professional Summary */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl card-hover transition-colors duration-300">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
              Professional Summary
              <Terminal size={24} className="text-blue-600 dark:text-blue-400" />
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              Curious and highly motivated engineer with a strong foundation in backend development, DevOps, and embedded systems. 
              Over 4 years of hands-on experience in IT and system administration, and recent experience in firmware debugging at Intel. 
              Adept in scripting, automation, and secure software practices. Passionate about backend technologies, infrastructure reliability, 
              and learning new tools and paradigms.
            </p>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-3xl font-bold mb-10 text-gray-800 dark:text-white text-center">Featured Projects</h2>
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl card-hover transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <Car className="text-blue-600 dark:text-blue-400 w-8 h-8" />
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Remote Control Car (ESP32)</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  A sophisticated remote-controlled car project built using ESP32, demonstrating embedded systems expertise and IoT capabilities.
                </p>
                <div className="flex items-center gap-4">
                  <a href="https://github.com/Roei-Barak/Makers/tree/main/Esp32_Final_Project" 
                     className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                    <Github size={20} />
                    View on GitHub
                  </a>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl card-hover transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="text-blue-600 dark:text-blue-400 w-8 h-8" />
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Debate Drive</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  An innovative online debate platform designed to prevent drowsy driving by engaging drivers in stimulating discussions.
                </p>
                <div className="flex items-center gap-4">
                  <a href="https://drivedebates.com" 
                     className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                    <Globe size={20} />
                    Visit Website
                  </a>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl card-hover transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-blue-600 dark:text-blue-400 w-8 h-8" />
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Dark Web Project</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  A secure and privacy-focused platform accessible through the Tor network, demonstrating advanced security implementation.
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                    roeibarakf7e2lf7hixlsdq2gumalg6m65twav5riydx76gr72rqgwyd.onion
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-3xl font-bold mb-10 text-gray-800 dark:text-white text-center">Technical Skills</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl card-hover border-t-4 border-blue-600 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <Terminal className="text-blue-600 dark:text-blue-400 w-8 h-8" />
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Backend & Programming</h3>
                </div>
                <ul className="space-y-4">
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Python, Java, C#, C, C++
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    REST APIs, Multithreaded Programming
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Python, PowerShell, Bash Scripting
                  </li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl card-hover border-t-4 border-blue-600 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <Server className="text-blue-600 dark:text-blue-400 w-8 h-8" />
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">DevOps & Infrastructure</h3>
                </div>
                <ul className="space-y-4">
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    GitHub Actions, Jenkins
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Virtual Machines, Docker
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Active Directory, Windows & Linux
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl card-hover border-t-4 border-blue-600 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-blue-600 dark:text-blue-400 w-8 h-8" />
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Networking & Security</h3>
                </div>
                <ul className="space-y-4">
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    HTTP, DNS, VPN Protocols
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    CIA Triad Implementation
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Kali Linux, Wireshark
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl card-hover border-t-4 border-blue-600 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <Cpu className="text-blue-600 dark:text-blue-400 w-8 h-8" />
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Embedded Systems</h3>
                </div>
                <ul className="space-y-4">
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    ESP32, Arduino
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Raspberry Pi
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Firmware Debugging
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-3xl font-bold mb-10 text-gray-800 dark:text-white text-center">Work Experience</h2>
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl card-hover relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Firmware Debug Engineer</h3>
                <div className="text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                  <Server size={18} />
                  Intel (CCE CSME FW Debug Team) | 2022 - Present
                </div>
                <ul className="space-y-3">
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Debugged and tested firmware-level issues across diverse system environments
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Collaborated with cross-functional teams to diagnose system-level failures
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Supported internal automation tools for testing and diagnostics
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl card-hover relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">IT Technical Support</h3>
                <div className="text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                  <Terminal size={18} />
                  Kramer Electronics | 2020 - 2022
                </div>
                <ul className="space-y-3">
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Deployed Windows systems and provided support for end-user issues
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Diagnosed and resolved technical incidents related to applications and hardware
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl card-hover relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">IT Help Desk</h3>
                <div className="text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                  <Terminal size={18} />
                  Ophir Optronics Solutions Ltd | 2019 - 2020
                </div>
                <ul className="space-y-3">
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Managed and maintained Active Directory users and computers
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Handled firewall and VPN configurations
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Supported global IT infrastructure and software deployments
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-3xl font-bold mb-10 text-gray-800 dark:text-white text-center">Education</h2>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl card-hover transition-colors duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">B.Sc. in Computer Science</h3>
              <div className="text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                <ExternalLink size={18} />
                Lev Academic Center - JCT
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">Specialization in Cybersecurity</p>
              <div className="mt-6">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Additional Certifications</h4>
                <ul className="space-y-3">
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    MCSA course in collaboration with 8200 Unit (Outstanding Commanders Program)
                  </li>
                  <li className="skill-item flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
                    Udemy Course: Learn Python & Ethical Hacking
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Military Service */}
          <section>
            <h2 className="text-3xl font-bold mb-10 text-gray-800 dark:text-white text-center">Military Service</h2>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl card-hover transition-colors duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Combat Squad Commander</h3>
              <div className="text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                <Shield size={18} />
                IDF – Paratroopers Brigade
              </div>
              <p className="text-gray-700 dark:text-gray-300">Responsible for tactical operations and team leadership</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center space-x-6 mb-8">
              <a href="mailto:Roeibarak123@gmail.com" 
                className="p-4 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all duration-300">
                <Mail size={24} />
              </a>
              <a href="https://github.com" 
                className="p-4 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all duration-300">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com" 
                className="p-4 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all duration-300">
                <Linkedin size={24} />
              </a>
            </div>
            <p className="text-sm text-blue-200">© 2024 Roei Barak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;