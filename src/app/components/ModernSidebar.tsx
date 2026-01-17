'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileImage, 
  CreditCard, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export default function ModernSidebar({ onNavigate, currentPage = 'dashboard' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, available: true },
    { id: 'projects', label: 'Projects', icon: FolderKanban, available: false, badge: 'Soon' },
    { id: 'templates', label: 'Templates', icon: FileImage, available: false, badge: 'Soon' },
    { id: 'billing', label: 'Billing', icon: CreditCard, available: false, badge: 'Pro' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col bg-white border-r border-gray-200 
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                polishui
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => item.available && onNavigate?.(item.id)}
                disabled={!item.available}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl
                  transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                    : item.available
                      ? 'hover:bg-gray-50 text-gray-700'
                      : 'text-gray-400 cursor-not-allowed'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                
                {!isCollapsed && (
                  <>
                    <span className="font-medium flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full font-medium
                        ${isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="
                    absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm 
                    rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none
                    transition-opacity whitespace-nowrap z-50
                  ">
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 text-xs text-gray-400">({item.badge})</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings at Bottom */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-100">
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center">
          {menuItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => item.available && onNavigate?.(item.id)}
                disabled={!item.available}
                className={`
                  flex flex-col items-center gap-1 px-4 py-2 rounded-lg
                  transition-all relative
                  ${isActive 
                    ? 'text-blue-600' 
                    : item.available
                      ? 'text-gray-600'
                      : 'text-gray-300'
                  }
                `}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}