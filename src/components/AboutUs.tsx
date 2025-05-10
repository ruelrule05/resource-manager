import React from 'react';
import {Header} from "./Header.tsx";

const AboutUsPage: React.FC = () => {
  return (
    <>
      <Header />

      <div className="container mx-auto py-10">
        <div className="card max-w-2xl mx-auto shadow-md rounded-md">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              About Our Resource Management Dashboard
            </h2>

            <p className="mb-4">
              Welcome to our Resource Management Dashboard! This application is designed to help you efficiently manage your valuable resources, whether they are projects, tasks, inventory items, or more. Our goal is to provide a user-friendly and secure platform that streamlines your workflow and improves productivity.
            </p>

            <hr className="my-6 border-t border-gray-200" />

            <h3 className="text-xl font-semibold mb-2">
              Key Features
            </h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Secure Authentication and Authorization with role-based access control.</li>
              <li>Comprehensive CRUD operations for managing resources.</li>
              <li>Advanced filtering and search capabilities for easy data retrieval.</li>
              <li>Simplified reporting and analytics to gain insights into your resources.</li>
              <li>A contact form for general inquiries.</li>
              <li>A dedicated "About Us" page to learn more about our application.</li>
            </ul>

            <hr className="my-6 border-t border-gray-200" />

            <h3 className="text-xl font-semibold mb-2">
              Our Team
            </h3>
            <p className="mb-4">
              This application was developed by a team of dedicated full-stack developers passionate about creating efficient and secure web solutions. We strive for clean code, robust architecture, and a positive user experience.
            </p>

            <hr className="my-6 border-t border-gray-200" />

            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Resource Management Dashboard. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;