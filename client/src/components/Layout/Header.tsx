import React, { useState } from 'react';
import { Layout } from 'antd';
import CreateTodoModal from '../TodoForm/CreateTodoModal';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AntHeader className="custom-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="logo-container">
              <svg 
                className="logo-icon" 
                viewBox="0 0 40 40" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M20 5 L35 15 L35 30 L20 40 L5 30 L5 15 Z" 
                  fill="url(#logoGradient)"
                  stroke="var(--accent-coral)"
                  strokeWidth="2"
                />
                <path 
                  d="M20 12 L20 28 M12 20 L28 20" 
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="logoGradient" x1="5" y1="5" x2="35" y2="40">
                    <stop offset="0%" stopColor="var(--accent-violet)" />
                    <stop offset="100%" stopColor="var(--accent-coral)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="logo-glow"></div>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">树状待办</h1>
              <span className="brand-subtitle">Tree Todo</span>
            </div>
          </div>

          <button 
            className="create-button"
            onClick={() => setIsModalOpen(true)}
          >
            <svg className="button-icon" viewBox="0 0 24 24" fill="none">
              <path 
                d="M12 5 L12 19 M5 12 L19 12" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
            </svg>
            <span>新建待办</span>
            <div className="button-glow"></div>
          </button>
        </div>
      </AntHeader>

      <CreateTodoModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Header;