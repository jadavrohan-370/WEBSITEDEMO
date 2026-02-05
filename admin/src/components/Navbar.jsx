import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Navbar = ({ title }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-8 py-4 flex items-center justify-between">
       <h2 className="text-2xl font-serif font-bold text-slate-800">{title}</h2>

       <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
             />
          </div>

          <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
             <Bell size={20} />
             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">Admin User</p>
                <p className="text-xs text-slate-400">Super Admin</p>
             </div>
             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm">
                <User size={20} />
             </div>
          </div>
       </div>
    </header>
  );
};

export default Navbar;
