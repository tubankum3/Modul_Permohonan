import re

with open('components/eadvo_Arsip.tsx', 'r') as f:
    content = f.read()

# 1. Add globalRole condition to the header
header_replacement = """        <div className="flex-1 overflow-y-auto bg-gray-50 p-10 space-y-8 pb-24 flex flex-col">
            <Breadcrumb currentView="eAdvokasiArsip" onNavigate={onNavigate} />
            
            {globalRole === 'Pegawai' ? (
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Peminjaman Arsip</h1>
                    <p className="text-gray-600 mt-1">Pengelolaan dan pemantauan status peminjaman arsip perkara.</p>
                    <div className="border-b-4 border-blue-600 w-16 mt-4 mb-6"></div>
                    
                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
                            <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Arsip</div>
                            <div className="text-4xl font-black text-blue-600">{filteredArsip.length}</div>
                        </div>
                        <div className="bg-white rounded shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
                            <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Sedang Dipinjam</div>
                            <div className="text-4xl font-black text-amber-500">{filteredArsip.filter(a => a.status === 'Dipinjam').length}</div>
                        </div>
                        <div className="bg-white rounded shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
                            <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Tersedia</div>
                            <div className="text-4xl font-black text-green-500">{filteredArsip.filter(a => a.status !== 'Dipinjam').length}</div>
                        </div>
                    </div>

                    <div className="flex space-x-1 border-b border-gray-200">
                        <button
                            onClick={() => setMainTab('Aktif')}
                            className={`py-2 px-6 font-medium text-sm border-b-2 outline-none ${mainTab === 'Aktif' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Perkara Aktif
                        </button>
                        <button
                            onClick={() => setMainTab('Selesai')}
                            className={`py-2 px-6 font-medium text-sm border-b-2 outline-none ${mainTab === 'Selesai' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Perkara Selesai
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Manajemen Arsiparis</h1>
                    <p className="text-gray-600 mt-1">Perekaman dan pengelolaan data arsip perkara.</p>
                    <div className="border-b-4 border-blue-600 w-16 mt-4 mb-6"></div>
                    
                    <div className="flex space-x-1 border-b border-gray-200">
                        <button
                            onClick={() => setMainTab('Aktif')}
                            className={`py-2 px-6 font-medium text-sm border-b-2 outline-none ${mainTab === 'Aktif' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Perkara Aktif
                        </button>
                        <button
                            onClick={() => setMainTab('Selesai')}
                            className={`py-2 px-6 font-medium text-sm border-b-2 outline-none ${mainTab === 'Selesai' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Perkara Selesai
                        </button>
                    </div>

                    <div className="border-b border-gray-200 mt-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button 
                                onClick={() => setArsiparisTab('Perkara')}
                                className={`${arsiparisTab === 'Perkara' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                                Daftar Perkara
                            </button>
                            <button 
                                onClick={() => setArsiparisTab('Arsip')}
                                className={`${arsiparisTab === 'Arsip' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                                Daftar Arsip
                            </button>
                        </nav>
                    </div>
                </div>
            )}"""

content = re.sub(
    r'        <div className="flex-1 overflow-y-auto bg-gray-50 p-10 space-y-8 pb-24 flex flex-col">.*?</div>\s*</div>\s*(?={/\* Modal Record Arsip \*/})',
    header_replacement + "\n\n",
    content,
    flags=re.DOTALL
)

# 2. Add conditions for Table 1 and Table 2 rendering
content = content.replace('{/* Table 1: Daftar Perkara */}', '{globalRole !== "Pegawai" && arsiparisTab === "Perkara" && (\n            <>\n            {/* Table 1: Daftar Perkara */}')
content = content.replace('{/* Table 2: Daftar Arsip Perkara Selesai */}', '            </>\n            )}\n            {/* Table 2: Daftar Arsip Perkara Selesai */}')
content = content.replace('            {/* Table 2: Daftar Arsip Perkara Selesai */}', '            {(globalRole === "Pegawai" || (globalRole !== "Pegawai" && arsiparisTab === "Arsip")) && (\n            <>\n            {/* Table 2: Daftar Arsip Perkara Selesai */}')
content = content.replace('                    <Pagination \n                        totalItems={filteredArsip.length}\n                        currentPage={currentPageArsip}\n                        itemsPerPage={itemsPerPageArsip}\n                        onPageChange={setCurrentPageArsip}\n                        onItemsPerPageChange={(val) => { setItemsPerPageArsip(val); setCurrentPageArsip(1); }}\n                    />\n                </div>\n            </div>', '                    <Pagination \n                        totalItems={filteredArsip.length}\n                        currentPage={currentPageArsip}\n                        itemsPerPage={itemsPerPageArsip}\n                        onPageChange={setCurrentPageArsip}\n                        onItemsPerPageChange={(val) => { setItemsPerPageArsip(val); setCurrentPageArsip(1); }}\n                    />\n                </div>\n            </div>\n            </>\n            )}')

# 3. Change Aksi column logic for Table 2 based on role
# We need to replace the buttons with conditional rendering
actions_replacement = """                                             <div className="flex items-center justify-center gap-1 w-fit mx-auto">
                                                 <button 
                                                     onClick={() => setViewingArchive(p)}
                                                     className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                                     title="View Detail"
                                                 >
                                                     <EyeIcon className="h-4 w-4" />
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

                                                 {globalRole === 'Pegawai' && p.status === 'Dipinjam' && (
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
                                                 )}
                                                 
                                                 {globalRole === 'Pegawai' && p.status !== 'Dipinjam' && (
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
    r'<div className="grid grid-cols-4 gap-1 w-fit mx-auto">.*?</div>',
    actions_replacement,
    content,
    flags=re.DOTALL
)


with open('components/eadvo_Arsip.tsx', 'w') as f:
    f.write(content)
