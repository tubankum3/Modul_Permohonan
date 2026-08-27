import re

with open('components/eadvo_UpdatePosisiPerkara.tsx', 'r') as f:
    content = f.read()

old_crud_modal = re.search(r'const CrudModal: React\.FC<\{.*?^};', content, re.MULTILINE | re.DOTALL)
if old_crud_modal:
    new_crud_modal = """const CrudModal: React.FC<{ 
    isOpen: boolean, 
    onClose: () => void, 
    onSave: (data: any) => void, 
    title: string, 
    initialData: any, 
    fields: { name: string, label: string, type: string, options?: string[] }[],
    extraSection?: React.ReactNode
}> = ({ isOpen, onClose, onSave, title, initialData, fields, extraSection }) => {
    const [formData, setFormData] = useState(initialData);
    useEffect(() => { setFormData(initialData) }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isRadio = type === 'radio';
        setFormData((prev: any) => ({ ...prev, [name]: isRadio ? value : (e.target as any).value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const renderField = (field: { name: string, label: string, type: string, options?: string[] }) => {
        return (
            <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                    <textarea name={field.name} value={formData[field.name] || ''} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700" />
                ) : field.type === 'richtext' ? (
                    <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent shadow-sm">
                        <div className="bg-gray-50 border-b border-gray-300 px-3 py-1 flex gap-2">
                            <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs font-bold text-gray-700">B</button>
                            <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs italic text-gray-700">I</button>
                            <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs underline text-gray-700">U</button>
                        </div>
                        <textarea 
                            name={field.name} 
                            value={formData[field.name] || ''} 
                            onChange={handleChange} 
                            rows={5} 
                            className="w-full p-3 outline-none resize-none text-sm text-gray-700" 
                            placeholder={`Masukan ${field.label.toLowerCase()}...`}
                        />
                    </div>
                ) : field.type === 'select' ? (
                    <select name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700">
                        <option value="">Pilih {field.label}</option>
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                ) : field.type === 'file' ? (
                    <div className="flex items-center gap-2">
                        <input 
                            type="file" 
                            id={`file-${field.name}`}
                            className="hidden" 
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setFormData((prev: any) => ({ ...prev, [field.name]: file.name }));
                            }}
                        />
                        <label 
                            htmlFor={`file-${field.name}`}
                            className="flex-1 p-2 border border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 text-sm text-gray-600 shadow-sm"
                        >
                            {formData[field.name] || 'Pilih Berkas atau Tarik ke sini'}
                        </label>
                        {formData[field.name] && (
                            <button 
                                type="button" 
                                onClick={() => setFormData((prev: any) => ({ ...prev, [field.name]: '' }))}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <XIcon className="h-4 w-4"/>
                            </button>
                        )}
                    </div>
                ) : field.type === 'radio' ? (
                    <div className="flex space-x-4">
                        {field.options?.map(opt => (
                            <label key={opt} className="flex items-center text-gray-700">
                                <input type="radio" name={field.name} value={opt} checked={formData[field.name] === opt} onChange={handleChange} className="mr-2 text-blue-600 focus:ring-blue-500" />
                                {opt}
                            </label>
                        ))}
                    </div>
                ) : (
                    <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700" />
                )}
            </div>
        );
    };

    const isPutusan = title.toLowerCase().includes('putusan');
    const amarIndex = fields.findIndex(f => f.name === 'amar');
    const firstHalf = isPutusan && amarIndex !== -1 ? fields.slice(0, amarIndex + 1) : fields;
    const secondHalf = isPutusan && amarIndex !== -1 ? fields.slice(amarIndex + 1) : [];
    
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <header className="flex items-center justify-between p-5 border-b bg-white">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><XIcon className="h-5 w-5" /></button>
                </header>
                <main className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    <div className="flex flex-col gap-5">
                        {firstHalf.map(renderField)}
                    </div>
                    
                    {isPutusan && extraSection && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                           {React.cloneElement(extraSection as React.ReactElement<any>, { 
                               data: formData.susunanMajelis || [],
                               onChange: (newList: any[]) => setFormData((prev: any) => ({ ...prev, susunanMajelis: newList }))
                           })}
                        </div>
                    )}

                    {isPutusan && secondHalf.length > 0 && (
                        <div className="flex flex-col gap-5 mt-4 pt-4 border-t border-gray-100">
                            {secondHalf.map(renderField)}
                        </div>
                    )}

                    {!isPutusan && extraSection && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                           {React.cloneElement(extraSection as React.ReactElement<any>, { 
                               data: formData.susunanMajelis || [],
                               onChange: (newList: any[]) => setFormData((prev: any) => ({ ...prev, susunanMajelis: newList }))
                           })}
                        </div>
                    )}
                </main>
                <footer className="flex justify-end items-center p-5 bg-gray-50 border-t border-gray-100 space-x-3">
                    <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 shadow-sm transition-colors">Batal</button>
                    <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm transition-colors">Simpan</button>
                </footer>
            </form>
        </div>
    );
};"""
    content = content[:old_crud_modal.start()] + new_crud_modal + content[old_crud_modal.end():]
    with open('components/eadvo_UpdatePosisiPerkara.tsx', 'w') as f:
        f.write(content)
    print("Replaced CrudModal in eadvo_UpdatePosisiPerkara.tsx")
else:
    print("Could not find CrudModal in eadvo_UpdatePosisiPerkara.tsx")
