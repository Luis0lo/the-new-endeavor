
import React from 'react';
import { Code, Layout, Figma, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const skills = [
    'React', 'TypeScript', 'JavaScript', 'HTML/CSS',
    'Tailwind CSS', 'Next.js', 'Redux', 'Node.js',
  ];

  const services = [
    {
      icon: <Layout className="h-8 w-8 text-portfolio-500" />,
      title: 'Frontend Development',
      description: 'Creating responsive and performant user interfaces with modern frameworks.'
    },
    {
      icon: <Code className="h-8 w-8 text-portfolio-500" />,
      title: 'Web Applications',
      description: 'Building interactive web applications with clean, maintainable code.'
    },
    {
      icon: <Figma className="h-8 w-8 text-portfolio-500" />,
      title: 'UI/UX Collaboration',
      description: 'Working closely with designers to implement pixel-perfect interfaces.'
    },
    {
      icon: <Zap className="h-8 w-8 text-portfolio-500" />,
      title: 'Performance Optimization',
      description: 'Optimizing web applications for speed and efficiency.'
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            I'm a passionate frontend developer with a keen eye for design and a commitment to creating performant, accessible web applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">My Background</h3>
            <p className="text-gray-600 mb-6">
              With over 5 years of experience in web development, I've worked on various projects from small business websites to complex web applications.
              I specialize in creating responsive, intuitive interfaces that provide exceptional user experiences.
            </p>
            <p className="text-gray-600 mb-6">
              My approach combines technical expertise with creativity, ensuring that the websites I build are not only functional but also visually appealing and user-friendly.
            </p>
            <p className="text-gray-600">
              I'm constantly learning and exploring new technologies to stay ahead in this ever-evolving field.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">My Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-white text-portfolio-700 px-4 py-2 rounded-full border border-portfolio-200 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-2xl font-semibold mb-8 text-center">What I Do</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-2">{service.icon}</div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
