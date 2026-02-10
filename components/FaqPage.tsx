
import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from './icons';
import { FaqCategory } from '../types';

interface FaqPageProps {
  faqData: FaqCategory[];
}

const AccordionItem: React.FC<{
    item: { id: string; question: string; answer: string };
    isOpen: boolean;
    onClick: () => void;
}> = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={onClick}
                className="flex justify-between items-center w-full py-5 px-6 text-left"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
            >
                <span className="text-lg font-medium text-gray-800">{item.question}</span>
                <ChevronDownIcon className={`h-6 w-6 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                id={`faq-answer-${item.id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
            >
                <div className="px-6 pb-5 text-gray-600 whitespace-pre-wrap">
                    {item.answer}
                </div>
            </div>
        </div>
    );
};

const FaqPage: React.FC<FaqPageProps> = ({ faqData }) => {
  const [activeCategory, setActiveCategory] = useState(faqData.length > 0 ? faqData[0].category : '');
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(faqData.length > 0 && faqData[0].questions.length > 2 ? faqData[0].questions[2].id : null);

  useEffect(() => {
    if (faqData.length > 0 && !faqData.some(c => c.category === activeCategory)) {
      setActiveCategory(faqData[0].category);
    }
  }, [faqData, activeCategory]);

  const currentQuestions = faqData.find(c => c.category === activeCategory)?.questions || [];
  
  const handleAccordionClick = (id: string) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  return (
    <div className="p-8 bg-gray-50 h-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Faq</h1>
        <div className="border-b-4 border-blue-600 w-16 mb-8"></div>

        <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Kategori</h2>
                <ul className="space-y-1">
                    {faqData.map(item => (
                        <li key={item.category}>
                            <button
                                onClick={() => setActiveCategory(item.category)}
                                className={`w-full text-left px-4 py-2 rounded-md transition ${activeCategory === item.category ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {item.category}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <div className="w-full md:w-3/4">
                 <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">{activeCategory}</h2>
                    </div>
                    <div>
                        {currentQuestions.map(q => (
                            <AccordionItem 
                                key={q.id}
                                item={q}
                                isOpen={openAccordionId === q.id}
                                onClick={() => handleAccordionClick(q.id)}
                            />
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default FaqPage;