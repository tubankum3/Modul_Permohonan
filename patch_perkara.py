import re

with open('components/eadvo_EditPerkara.tsx', 'r') as f:
    content = f.read()

old_crud_modal = re.search(r'const CrudModal: React\.FC<\{.*?^};', content, re.MULTILINE | re.DOTALL)
if old_crud_modal:
    new_crud_modal = """const CrudModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void, title: string, initialData: any, fields: { name: string, label: string, type: string, options?: (string | number)[] }[] }> = ({ isOpen, onClose, onSave, title, initialData, fields }) => {
    const [formData, setFormData] = useState(initialData);
    useEffect(() => { setFormData(initialData) }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <header className="flex items-center justify-between p-5 border-b bg-white">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><XIcon className="h-5 w-5" /></button>
                </header>
                <main className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    <div className="flex flex-col gap-5">
                        {fields.map(field => (
                            <div key={field.name}>
                                {field.type === 'rich' ? (
                                    <SimpleRichText label={field.label} value={formData[field.name] || ''} onChange={(val) => handleChange(field.name, val)} rows={4} />
                                ) : (
                                    <>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                        {field.type === 'select' ? (
                                            <select name={field.name} value={formData[field.name] || ''} onChange={(e) => handleChange(field.name, e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700">
                                                <option value="">Pilih {field.label}</option>
                                                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={(e) => handleChange(field.name, e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700" />
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
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
    with open('components/eadvo_EditPerkara.tsx', 'w') as f:
        f.write(content)
    print("Replaced CrudModal in eadvo_EditPerkara.tsx")
else:
    print("Could not find CrudModal in eadvo_EditPerkara.tsx")
