"use client";

import React from 'react';
import { Newspaper, Flame, ChevronRight } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  timestamp: string;
  is_featured: boolean;
}

export default function NewsWidget({ articles }: { articles: NewsArticle[] }) {
  const featuredArticle = articles.find(a => a.is_featured) || articles[0];
  const regularArticles = articles.filter(a => !a.is_featured);

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Newspaper className="text-white w-8 h-8" />
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Noticias y Análisis</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ARTÍCULO DESTACADO (Análisis Táctico) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-blue-500/50 transition-colors cursor-pointer group flex flex-col justify-between">
          <div className="h-64 bg-slate-800 relative overflow-hidden">
            {/* Placeholder de imagen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 to-slate-800" />
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {featuredArticle.category}
              </span>
            </div>
          </div>
          <div className="p-6 sm:p-8 bg-slate-900">
            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mb-3">
              <span>Por {featuredArticle.author}</span>
              <span>•</span>
              <span>{featuredArticle.timestamp}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
              {featuredArticle.title}
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              {featuredArticle.summary}
            </p>
            <div className="flex items-center text-blue-500 font-bold text-sm">
              Leer análisis completo <ChevronRight size={16} />
            </div>
          </div>
        </div>

        {/* FEED DE ÚLTIMO MOMENTO */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            <h3 className="text-lg font-bold text-white">Último Momento</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {regularArticles.map((article, index) => (
              <div 
                key={article.id} 
                className={`p-6 hover:bg-slate-800/50 transition-colors cursor-pointer ${
                  index !== regularArticles.length - 1 ? 'border-b border-slate-800/50' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-500">{article.timestamp}</span>
                </div>
                <h4 className="text-white font-bold mb-2 leading-tight hover:text-blue-400 transition-colors">
                  {article.title}
                </h4>
                <p className="text-sm text-slate-400 line-clamp-2">
                  {article.summary}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full py-4 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border-t border-slate-800">
            Ver todas las noticias
          </button>
        </div>

      </div>
    </div>
  );
}