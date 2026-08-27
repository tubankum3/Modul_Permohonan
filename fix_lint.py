with open('components/eadvo_Arsip.tsx', 'r') as f:
    content = f.read()

# Fix the redundant check at 791
content = content.replace('{(globalRole === "Pegawai" || (globalRole !== "Pegawai" && arsiparisTab === "Arsip")) && (', '{(globalRole === "Pegawai" || arsiparisTab === "Arsip") && (')

# Restore the icon in Table 2
content = content.replace('                    <FileTextIcon className="h-4 w-4 mr-2 text-gray-600" />\n                    <span>{globalRole === "Pegawai" ? "Peminjaman Arsip" : "Daftar Arsip Perkara"} {mainTab}</span>', '                    {globalRole === "Pegawai" ? <BookOpenIcon className="h-4 w-4 mr-2 text-indigo-600" /> : <FileTextIcon className="h-4 w-4 mr-2 text-gray-600" />}\n                    <span>{globalRole === "Pegawai" ? "Peminjaman Arsip" : "Daftar Arsip Perkara"} {mainTab}</span>')

with open('components/eadvo_Arsip.tsx', 'w') as f:
    f.write(content)
