import React, { useState, useEffect } from 'react';
import { FaqCategory, FaqItem } from '../types';
import { PlusIcon, TrashIcon, PencilIcon, XIcon, ChevronUpIcon, ChevronDownIcon } from './icons';

interface PengelolaanFaqProps {
  faqData: FaqCategory[];
  onSave: (newFaqData: FaqCategory[]) => void;
}

const PengelolaanFaq: React.FC<PengelolaanFaqProps> = ({ faqData, onSave }) => {
  const [localFaqData, setLocalFaqData] = useState<FaqCategory[]>([]);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    type: 'category' | 'question';
    data: any;
    categoryId?: string;
  } | null>(null);
  
  useEffect(() => {
    // Deep copy to prevent direct mutation of props
    setLocalFaqData(JSON.parse(JSON.stringify(faqData)));
  }, [faqData]);

  const handleSave = () => {
    onSave(localFaqData);
  };

  const handleOpenModal = (mode: 'add' | 'edit', type: 'category' | 'question', data: any, categoryId?: string) => {
    setModalState({ isOpen: true, mode, type, data, categoryId });
  };
  
  const handleCloseModal = () => {
    setModalState(null);
  };
  
  const handleModalSave = (newData: any) => {
    if (!modalState) return;

    if (modalState.type === 'category') {
      if (modalState.mode === 'add') {
        setLocalFaqData([...localFaqData, { id: `cat-${Date.now()}`, category: newData.category, questions: [] }]);
      } else {
        setLocalFaqData(localFaqData.map(cat => cat.id === newData.id ? { ...cat, category: newData.category } : cat));
      }
    } else if (modalState.type === 'question') {
      if (modalState.mode === 'add') {
        setLocalFaqData(localFaqData.map(cat => cat.id === modalState.categoryId ? { ...cat, questions: [...cat.questions, { id: `q-${Date.now()}`, ...newData }] } : cat));
      } else {
        setLocalFaqData(localFaqData.map(cat => cat.id === modalState.categoryId ? { ...cat, questions: cat.questions.map(q => q.id === newData.id ? newData : q) } : cat));
      }
    }
    handleCloseModal();
  };
  
  const handleDelete = (type: 'category' | 'question', id: string, categoryId?: string) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
        if (type === 'category') {
            setLocalFaqData(localFaqData.filter(cat => cat.id !== id));
        } else if (type === 'question' && categoryId) {
            setLocalFaqData(localFaqData.map(cat => cat.id === categoryId ? { ...cat, questions: cat.questions.filter(q => q.id !== id) } : cat));
        }
    }
  };

  const handleMove = (type: 'category' | 'question', direction: 'up' | 'down', index: number, categoryIndex?: number) => {
    if (type === 'category') {
        const newData = [...localFaqData];
        const to = direction === 'up' ? index - 1 : index + 1;
        if (to >= 0 && to < newData.length) {
            [newData[index], newData[to]] = [newData[to], newData[index]];
            setLocalFaqData(newData);
        }
    } else if (type === 'question' && categoryIndex !== undefined) {
        const newData = [...localFaqData];
        const questions = [...newData[categoryIndex].questions];
        const to = direction === 'up' ? index - 1 : index + 1;
        if (to >= 0 && to < questions.length) {
            [questions[index], questions[to]] = [questions[to], questions[index]];
            newData[categoryIndex].questions = questions;
            setLocalFaqData(newData);
        }
    }
  };


  return (
    <>
      <div className="p-8 bg-gray-50 h-full flex flex-col">
        <div className="flex-shrink-0 flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Pengelolaan FAQ</h1>
                <p className="text-gray-600 mt-1">Tambah, ubah, atau hapus kategori dan pertanyaan FAQ.</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleOpenModal('add', 'category', { category: ''})} 
                      className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 inline-flex items-center space-x-2">
                  <PlusIcon className="h-5 w-5"/>
                  <span>Tambah Kategori</span>
              </button>
              <button onClick={handleSave} 
                      className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700">
                  Simpan Perubahan
              </button>
          </div>
        </div>
         <div className="border-b-4 border-blue-600 w-16 mb-6"></div>
        <div className="flex-1 overflow-y-auto space-y-4">
          {localFaqData.map((category, catIndex) => (
            <div key={category.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">{category.category}</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleMove('category', 'up', catIndex)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"><ChevronUpIcon className="h-5 w-5" /></button>
                    <button onClick={() => handleMove('category', 'down', catIndex)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"><ChevronDownIcon className="h-5 w-5" /></button>
                    <button onClick={() => handleOpenModal('edit', 'category', category)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"><PencilIcon className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete('category', category.id)} className="p-1.5 hover:bg-gray-100 rounded-full text-red-500"><TrashIcon className="h-5 w-5" /></button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {category.questions.map((q, qIndex) => (
                  <div key={q.id} className="flex justify-between items-start p-3 border border-gray-100 rounded-md bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-700">{q.question}</p>
                      <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">{q.answer}</p>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0 ml-4">
                        <button onClick={() => handleMove('question', 'up', qIndex, catIndex)} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500"><ChevronUpIcon className="h-4 w-4" /></button>
                        <button onClick={() => handleMove('question', 'down', qIndex, catIndex)} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500"><ChevronDownIcon className="h-4 w-4" /></button>
                        <button onClick={() => handleOpenModal('edit', 'question', q, category.id)} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500"><PencilIcon className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete('question', q.id, category.id)} className="p-1.5 hover:bg-gray-200 rounded-full text-red-500"><TrashIcon className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
                 <button onClick={() => handleOpenModal('add', 'question', { question: '', answer: '' }, category.id)} className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                    <PlusIcon className="h-4 w-4" />
                    <span>Tambah Pertanyaan</span>
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {modalState && <FaqModal {...modalState} onClose={handleCloseModal} onSave={handleModalSave} />}
    </>
  );
};

interface FaqModalProps {
    isOpen: boolean;
    mode: 'add' | 'edit';
    type: 'category' | 'question';
    data: any;
    onClose: () => void;
    onSave: (newData: any) => void;
}

const FaqModal: React.FC<FaqModalProps> = ({ isOpen, mode, type, data, onClose, onSave }) => {
    const [formData, setFormData] = useState(data);

    useEffect(() => {
        setFormData(data);
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    const title = `${mode === 'add' ? 'Tambah' : 'Edit'} ${type === 'category' ? 'Kategori' : 'Pertanyaan'}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <header className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><XIcon className="h-6 w-6" /></button>
                    </header>
                    <main className="p-6 space-y-4">
                        {type === 'category' ? (
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                                <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                                    <input type="text" name="question" value={formData.question} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                                </div>
                                <div>
                                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
                                    <textarea name="answer" value={formData.answer} onChange={handleChange} rows={6} className="w-full p-2 border border-gray-300 rounded-md" required />
                                </div>
                            </>
                        )}
                    </main>
                    <footer className="flex justify-end items-center p-4 bg-gray-50 space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold">Batal</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold">Simpan</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};


export default PengelolaanFaq;
