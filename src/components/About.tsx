
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-[#181624] min-h-screen transition-colors">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold mb-2 text-gradient-primary">About Me</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            My name is João and I'm passionate about growing my own food on my little garden house. 
            My roots are in Portugal where my family were small farmers in the nineties, growing vegetables and fruit in the warm southern sun. 
            I now live in the UK, where the chilly weather and new soils give unique challenges—each season is a blend of tradition and fresh learning.
          </p>
        </div>
        <div className="bg-white dark:bg-[#23203a] rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-200">
            Why I built 2day garden
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            I built this app on my journey to maximize my chances for a better harvest. I wanted to keep track of what, when, and how I grow anything, 
            to avoid missing planting windows and to learn from every season's unique conditions. Along the way, I realized that other passionate growers face the same struggles: 
            forgetting garden plans, not knowing what works best, or simply losing track of small daily garden tasks.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">2day garden</span> is a smart companion for gardeners of any skill, combining powerful planning, tracking, and reminders with simple tools. 
            Whether you're a beginner or an experienced grower, this app helps you:
          </p>
          <ul className="list-disc pl-6 mt-4 text-gray-600 dark:text-gray-200">
            <li>Plan and track all your gardening activities (planting, watering, harvesting, and more)</li>
            <li>View seasonal guides, plant-specific tips, and reminders—from sowing seeds to harvest time</li>
            <li>Organize your garden layout, inventory, and personal notes in one place</li>
            <li>Analyze your gardening history to make smarter decisions every year</li>
            <li>Connect and share with a gardening community, if you wish to.</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-[#23203a] rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold mb-4 text-purple-800 dark:text-purple-300">My Journey from Portugal to the UK</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Growing up watching my family tend the land with dedication, I learned the value of seasons, patience, and hard work. 
            In Portugal, every meal had some homegrown ingredient, from tomatoes and greens to herbs right by the kitchen window.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            My move to the UK brought new gardening challenges—different weather, shorter growing seasons, and crops that needed a fresh approach. 
            The love for gardening stayed the same, and I now blend old country wisdom with new discoveries in my little garden.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            I hope that my effort in building this app helps anyone who wants to enjoy the satisfaction of seeing something grow, no matter your background or experience. 
            Let's learn, grow, and share together. Happy gardening!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
