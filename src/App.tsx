import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import Home from '@/pages/Home';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Calendar from '@/pages/Calendar';
import Inventory from '@/pages/Inventory';
import Settings from '@/pages/Settings';
import Companions from '@/pages/Companions';
import CookiePolicy from '@/pages/CookiePolicy';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import Sitemap from '@/pages/Sitemap';
import BlogPostsAdmin from '@/pages/admin/BlogPostsAdmin';
import NewBlogPost from '@/pages/admin/NewBlogPost';
import EditBlogPost from '@/pages/admin/EditBlogPost';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/blog" element={<MainLayout><Blog /></MainLayout>} />
        <Route path="/blog/:slug" element={<MainLayout><BlogPost /></MainLayout>} />
        <Route path="/auth" element={<MainLayout><Auth /></MainLayout>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/calendar" element={<Calendar />} />
        <Route path="/dashboard/inventory" element={<Inventory />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/companions" element={<Companions />} />
        <Route path="/cookie-policy" element={<MainLayout><CookiePolicy /></MainLayout>} />
        <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
        <Route path="/terms-of-service" element={<MainLayout><TermsOfService /></MainLayout>} />
        <Route path="/sitemap" element={<Sitemap />} />
        
        {/* Admin Routes */}
        <Route path="/admin/posts" element={<BlogPostsAdmin />} />
        <Route path="/admin/posts/new" element={<NewBlogPost />} />
        <Route path="/admin/posts/:id/edit" element={<EditBlogPost />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
