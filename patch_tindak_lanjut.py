import re

with open('components/eadvo_UpdateTindakLanjut.tsx', 'r') as f:
    content = f.read()

# Add EyeIcon, DownloadIcon to imports
content = re.sub(
    r"import \{ ArrowLeftIcon, PlusIcon, TrashIcon, XIcon \} from '\./icons';",
    "import { ArrowLeftIcon, PlusIcon, TrashIcon, XIcon, EyeIcon, DownloadIcon } from './icons';",
    content
)

old_td = """<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleRemove(item.id)} className="text-red-600 hover:text-red-900">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </td>"""

new_td = """<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <button type="button" className="text-blue-600 hover:text-blue-900 transition-colors" title="Lihat Detail">
                                    <EyeIcon className="h-5 w-5 inline-block" />
                                </button>
                                {item.file && (
                                    <a href={item.file.url} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-900 transition-colors inline-block" title="Unduh File">
                                        <DownloadIcon className="h-5 w-5 inline-block" />
                                    </a>
                                )}
                                <button type="button" onClick={() => handleRemove(item.id)} className="text-red-600 hover:text-red-900 transition-colors" title="Hapus">
                                    <TrashIcon className="h-5 w-5 inline-block" />
                                </button>
                            </td>"""

if old_td in content:
    content = content.replace(old_td, new_td)
    with open('components/eadvo_UpdateTindakLanjut.tsx', 'w') as f:
        f.write(content)
    print("Replaced TD successfully")
else:
    print("Could not find the exact TD string")

