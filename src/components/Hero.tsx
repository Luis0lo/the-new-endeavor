
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Twitter } from 'lucide-react';

const Hero = () => {
  return (
    <section 
      id="home" 
      className="min-h-screen flex flex-col justify-center pt-20 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[70%] bg-gradient-radial from-portfolio-200/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[70%] bg-gradient-radial from-secondary-portfolio-200/30 to-transparent rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-2xl mx-auto md:mx-0">
          <p className="text-portfolio-600 font-semibold mb-2 animate-fade-up">Hello, I'm</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
            <span className="gradient-text">John Doe</span>
          </h1>
          <p className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
            Frontend Developer
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-xl animate-fade-up" style={{ animationDelay: '300ms' }}>
            I build exceptional and accessible digital experiences for the web.
            Focused on creating intuitive and performant interfaces.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
            <Button className="gradient-bg hover:opacity-90 text-white">View My Work</Button>
            <Button variant="outline" className="border-portfolio-300 hover:bg-portfolio-50">
              Download Resume
            </Button>
          </div>
          
          <div className="flex items-center mt-10 space-x-6 animate-fade-up" style={{ animationDelay: '500ms' }}>
            <a href="#" className="text-gray-600 hover:text-portfolio-600 transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-portfolio-600 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-portfolio-600 transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#about" aria-label="Scroll to About section">
          <ArrowDown className="text-portfolio-500" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
