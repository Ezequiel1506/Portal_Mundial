import React from 'react';
import { Newspaper, ArrowRight } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  timestamp: string;
  is_featured: boolean;
  url: string;
}

export default function NewsWidget({ articles }: { articles: NewsArticle[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Newspaper className="text-blue-400 w-6 h-6" />
        <h3 className="text-white font-bold text-xl">Últimas Noticias</h3>
      </div>

      {/* NUEVO CONTENEDOR CON SCROLL: Limitamos la altura y activamos el overflow */}
      <div className="max-h-[520px] overflow-y-auto pr-2 space-y-4 scrollmap-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between bg-slate-950 border border-slate-800 p-5 rounded-xl hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 cursor-pointer min-h-[160px]"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${article.is_featured ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-500">{article.timestamp}</span>
                </div>
                
                <h4 className="text-white font-bold text-sm mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-slate-400 text-xs mb-4 line-clamp-2">
                  {article.summary}
                </p>
              </div>
              
              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                <span>Por {article.author}</span>
                <ArrowRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}