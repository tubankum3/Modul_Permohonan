import re

with open('components/eadvo_Arsip.tsx', 'r') as f:
    content = f.read()

# Replace the actions section
actions_replacement = """                                             <div className="flex items-center justify-center gap-1 w-fit mx-auto">
                                                 <button 
                                                     onClick={() => setViewingArchive(p)}
                                                     className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                                     title="View Detail"
                                                 >
                                                     <EyeIcon className="h-4 w-4" />
                                                 </button>
                                                 
                                                 <button
                                                      onClick={() => {
                                                         setViewingArchive(p);
                                                         setTimeout(() => window.print(), 500);
                                                     }}
                                                     className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                                     title="Print/Download Resume"
                                                 >
                                                     <PrintIcon className="h-4 w-4" />
                                                 </button>
                                                 
                                                 {globalRole !== 'Pegawai' && (
                                                     <button 
                                                         onClick={() => setEditingArchive(p)}
                                                         className="p-1.5 bg-amber-50 text-amber-600 rounded hover:bg-amber-100 transition-colors"
                                                         title="Edit Data Arsip"
                                                     >
                                                         <PencilIcon className="h-4 w-4" />
                                                     </button>
                                                 )}

                                                 {p.status === 'Dipinjam' ? (
                                                     <button 
                                                         onClick={() => {
                                                             const active = p.peminjaman?.find(borrow => !borrow.tanggalKembali);
                                                             if (active) handleReturnArchive(p.id, active.id);
                                                         }}
                                                         className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                                                         title="Kembalikan Arsip (Return)"
                                                     >
                                                         <RefreshIcon className="h-4 w-4" />
                                                     </button>
                                                 ) : (
                                                     <button 
                                                         onClick={() => setBorrowingArchiveId(p.id)}
                                                         className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                                                         title="Rekam Peminjaman Arsip (Borrowing Mechanism)"
                                                     >
                                                         <BookOpenIcon className="h-4 w-4" />
                                                     </button>
                                                 )}
                                             </div>"""

content = re.sub(
    r'<div className="flex items-center justify-center gap-1 w-fit mx-auto">.*?</div>',
    actions_replacement,
    content,
    flags=re.DOTALL
)

with open('components/eadvo_Arsip.tsx', 'w') as f:
    f.write(content)
