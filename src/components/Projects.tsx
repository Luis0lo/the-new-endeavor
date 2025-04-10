
import React from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProjectCard = ({ project }: { project: Project }) => (
  <Card className="overflow-hidden border-none shadow-lg group">
    <div className="relative overflow-hidden">
      <img 
        src={project.image} 
        alt={project.title} 
        className="w-full h-64 object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
        <div className="flex space-x-4">
          <Button size="sm" variant="outline" className="text-white border-white hover:bg-white/20">
            <Github className="mr-2 h-4 w-4" />
            Code
          </Button>
          <Button size="sm" variant="outline" className="text-white border-white hover:bg-white/20">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Live Demo
          </Button>
        </div>
      </div>
    </div>
    <CardContent className="p-6">
      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech, i) => (
          <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
            {tech}
          </span>
        ))}
      </div>
    </CardContent>
  </Card>
);

type Project = {
  title: string;
  description: string;
  image: string;
  technologies: string[];
};

const Projects = () => {
  const projects: Project[] = [
    {
      title: "E-commerce Dashboard",
      description: "A comprehensive dashboard for managing online stores with analytics and inventory tracking.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
      technologies: ["React", "Redux", "Chart.js", "Tailwind CSS"]
    },
    {
      title: "Travel Booking Platform",
      description: "A web application for booking travel experiences with real-time availability and secure payment processing.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
      technologies: ["Next.js", "Prisma", "Stripe", "TypeScript"]
    },
    {
      title: "Health & Fitness Tracker",
      description: "A mobile-responsive app that helps users track workouts, nutrition, and health metrics.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80",
      technologies: ["React", "Firebase", "D3.js", "Styled Components"]
    },
    {
      title: "Creative Portfolio Template",
      description: "A customizable portfolio template for creative professionals with animation effects.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80",
      technologies: ["HTML/CSS", "JavaScript", "GSAP", "Responsive Design"]
    },
  ];

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            My <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Here are some of my recent projects. Each one was carefully crafted to solve specific problems and enhance user experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button className="gradient-bg hover:opacity-90">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
