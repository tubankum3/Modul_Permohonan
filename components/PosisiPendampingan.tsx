
import React, { useState } from 'react';
import { 
    Paragraph, 
    TextRun, 
    ImageRun, 
    AlignmentType, 
    Document, 
    Packer, 
    Table, 
    TableRow, 
    TableCell, 
    WidthType, 
    BorderStyle 
} from 'docx';
import { saveAs } from 'file-saver';
import { PendampinganRecord, PosisiUpdate, View } from '../types';
import { ArrowLeftIcon, PlusIcon, DocumentTextIcon, PencilIcon, TrashIcon, DownloadIcon, CloudIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';
import UpdatePosisiModal from './UpdatePosisiPendampinganModal';

interface PosisiPendampinganProps {
    record: PendampinganRecord;
    onBack: () => void;
    onAddPosisi: (posisi: Omit<PosisiUpdate, 'id' | 'timestamp'>) => void;
    onUpdatePosisi: (posisiId: number, posisi: Omit<PosisiUpdate, 'id' | 'timestamp'>) => void;
    onDeletePosisi: (posisiId: number) => void;
    onNavigate: (view: View, data?: any) => void;
}

const PosisiPendampingan: React.FC<PosisiPendampinganProps> = ({ record, onBack, onAddPosisi, onUpdatePosisi, onDeletePosisi, onNavigate }) => {
    const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; data: PosisiUpdate | null }>({ isOpen: false, mode: 'add', data: null });
    const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; posisiId: number | null }>({ isOpen: false, posisiId: null });

    const handleOpenModal = (mode: 'add' | 'edit', data: PosisiUpdate | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, mode: 'add', data: null });
    };

    const handleSavePosisi = (posisiData: Omit<PosisiUpdate, 'id' | 'timestamp'>) => {
        if (modalState.mode === 'add') {
            onAddPosisi(posisiData);
        } else if (modalState.mode === 'edit' && modalState.data) {
            onUpdatePosisi(modalState.data.id, posisiData);
        }
        handleCloseModal();
    };

    const requestDelete = (posisiId: number) => {
        setDeleteModalState({ isOpen: true, posisiId });
    };

    const handleConfirmDelete = () => {
        if (deleteModalState.posisiId !== null) {
            onDeletePosisi(deleteModalState.posisiId);
        }
        setDeleteModalState({ isOpen: false, posisiId: null });
    };

    const handleGenerateST = (posisi: PosisiUpdate) => {
        const logoBase64 = "iVBORw0KGgoAAAANSUhEUgAAAJgAAACWCAMAAABw2QHfAAAAQlBMVEX////zgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDMI5PAVAAAAFXRSTlMAESIzRFVmd4iZqrvM3e7/73d3d3dJ22SEAAACcUlEQVR42uzZ25KbMAwAUAn33vv+r3hQoGgQCfYYexv3T14iAAnY4rIsy7Isy/IfCwAhsB/C6C5s2EVcKCw/k9GeaSEt9O8D3rM5Cc03mI7n/QG6O+t58M8vw768H8J6s/nMZqbZz2bbD6Y3v4/sB/O6y/S5u+n9D+b12/Q/mNdfof+7S/P5v/f5v+8HeP5f/xP+b/8b/j/+D/yL/5b/43/o//5/7f/P/+r/43/z//t/8//2P+V/7X/5f+T/2H/6/+I/2f/8/+Q/4H/m/+p/4n/4/+k/+3/wP/W/7X/n/9t/9v/rf9v/9v/df/Vf3X/lX/Vf9V/5V/5V/9X/Nf81/zX/Vf9V/5V/Nf81/1X/lfzX/Nf9V/zX/df81/zX/Nf81/7X/Nf+1/zX/Ff/1/xX/9f8V//X/df8N/w3/Df8V/w3/Df8V/w3/Tf8N/w3/Tf8V/w3/Df8N/03/Df8N/03/Ff8N/w3/Df9N/w3/Df9N/xX/df91/xX/df91/zX/df91/zX/Ff91/3X/df8V/3X/df91/zX/Ff91/3X/Nf8V/7X/tf81/7X/lf+1/7X/Nf+1/7X/lf+1/7X/tf+V/zX/tf+V/zX/Ff+1/7X/tf+1/5X/tf+V/zX/tf9t/2v/lf+1/w3/a/8b/tf+V/2H/2/8j/tf+t/2v/k//2v/q/+F/3P/m//O/9D/zP/A/9L/5H/5f9r/zP/i/8D/6v/F//r/1//m/7L/u/9P+x3+f5+n+d58H+T793+m+d18z+bfd3+h/k+d1/L8zPZ9n2+L55+y39A/oA4n+d+j/f/8734v3v/P8/n930H4/zGfz+6wZ/X35m+z6/5X18z+p/P1/N9h+v6M9n1/SPr++i/m/Z/8//Ufr+nPX9E+f6E9/4Q4n+f9kGZdlWZZlWYb9ATuH5Wzht5w7AAAAAElFTkSuQmCC";

        const picMember = record.team?.find(m => m.id === record.picId);
        const teamNames = record.team?.map(m => m.nama).join(', ') || picMember?.nama || '';

        const stDoc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        children: [new ImageRun({
                            data: Uint8Array.from(atob(logoBase64), c => c.charCodeAt(0)),
                            transformation: { width: 70, height: 70 },
                            //@ts-ignore
                            type: "png",
                        })],
                        alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: 'KEMENTERIAN KEUANGAN REPUBLIK INDONESIA' })],
                        alignment: AlignmentType.CENTER,
                        style: 'header'
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: 'SEKRETARIAT JENDERAL' })],
                        alignment: AlignmentType.CENTER,
                        style: 'header'
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: 'BIRO ADVOKASI' })],
                        alignment: AlignmentType.CENTER,
                        style: 'header'
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: 'Gedung Djuanda I Jl. Dr. Wahidin Raya Nomor 1 Jakarta' })],
                        alignment: AlignmentType.CENTER,
                        style: 'subheader'
                    }),
                    new Paragraph({ text: ' ', border: { bottom: { color: "auto", space: 1, style: "single", size: 6 } }, spacing: { after: 300 } }),
                    
                    new Paragraph({
                        children: [new TextRun({ text: 'SURAT TUGAS' })],
                        alignment: AlignmentType.CENTER,
                        style: 'title'
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: `NOMOR ST-${posisi.suratTugas || '....'}` })],
                        alignment: AlignmentType.CENTER,
                        style: 'title',
                        spacing: { after: 400 }
                    }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Menimbang :', bold: true }),
                            new TextRun({ text: ' Bahwa dalam rangka pelaksanaan tugas di bidang bantuan hukum dan pemberian pendampingan hukum, dipandang perlu menugaskan pegawai di lingkungan Biro Advokasi.' }),
                        ],
                        spacing: { after: 200 }
                    }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Dasar :', bold: true }),
                            new TextRun({ text: ` Surat dari ${record.abstraksi?.unitPemohon || 'Unit Terkait'} Nomor ${record.Nomor || '....'} Perihal ${record.perihal || '....'}.` }),
                        ],
                        spacing: { after: 400 }
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: 'MENUGASKAN:' })],
                        alignment: AlignmentType.CENTER,
                        style: 'title',
                        spacing: { after: 200 }
                    }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Kepada :', bold: true }),
                            new TextRun({ text: ` ${teamNames}` }),
                        ],
                        spacing: { after: 200 }
                    }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Untuk :', bold: true }),
                            new TextRun({ text: ` Melaksanakan pendampingan hukum terhadap ${record.perihal} yang akan dilaksanakan di ${record.abstraksi?.wilayah || '....'} pada:` }),
                        ],
                        spacing: { after: 200 }
                    }),

                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Hari/Tanggal', bold: true })] })], width: { size: 30, type: WidthType.PERCENTAGE } }),
                                    new TableCell({ children: [new Paragraph(': ' + formatDateForDoc(posisi.tanggalAgenda))] }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Agenda', bold: true })] })] }),
                                    new TableCell({ children: [new Paragraph(': ' + (posisi.agenda || '....'))] }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Posisi Kasus', bold: true })] })] }),
                                    new TableCell({ children: [new Paragraph(': ' + (posisi.posisiKasus || '....'))] }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: 'Surat Tugas ini agar dilaksanakan dengan penuh rasa tanggung jawab.' })],
                        spacing: { before: 400, after: 800 }
                    }),
                    
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph('')], width: { size: 60, type: WidthType.PERCENTAGE } }), 
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                children: [new TextRun({ text: `Jakarta, ${formatDateForDoc(new Date().toISOString())}` })]
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: 'Kepala Biro Advokasi', bold: true })]
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: ' ' })],
                                                spacing: { before: 1200 }
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: 'Ditandatangani secara elektronik', italics: true })]
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: 'Ttd.', bold: true })]
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            },],
            styles: {
                paragraphStyles: [
                    { id: "header", name: "Header", run: { bold: true, size: 24, font: "Arial" } },
                    { id: "subheader", name: "Subheader", run: { size: 18, font: "Arial" } },
                    { id: "title", name: "Title", run: { bold: true, size: 24, font: "Arial" } },
                ]
            }
        });

        Packer.toBlob(stDoc).then(blob => {
            saveAs(blob, `Surat_Tugas_${posisi.suratTugas || record.id}.docx`);
        });
    };
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return date.toLocaleDateString('id-ID', {day: 'numeric', month:'long', year:'numeric'});
    }

    const formatDateForDoc = (dateStr: string | undefined): string => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
         // Adjust for timezone offset
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
        return adjustedDate.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleDownload = async (posisi: PosisiUpdate) => {
        const docx = (window as any).docx;
        const saveAs = (window as any).saveAs;
        
        if (!docx || !saveAs) {
            console.error('Docx or FileSaver library is not available.');
            alert('Gagal membuat dokumen. Pustaka yang diperlukan tidak dimuat.');
            return;
        }

        const {
            Paragraph,
            TextRun,
            ImageRun,
            AlignmentType,
            Document,
            Packer,
            Table,
            TableRow,
            TableCell,
            WidthType,
            BorderStyle,
        } = docx;

        const logoBase64 = "iVBORw0KGgoAAAANSUhEUgAAAJgAAACWCAMAAABw2QHfAAAAQlBMVEX////zgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDPzgDMI5PAVAAAAFXRSTlMAESIzRFVmd4iZqrvM3e7/73d3d3dJ22SEAAACcUlEQVR42uzZ25KbMAwAUAn33vv+r3hQoGgQCfYYexv3T14iAAnY4rIsy7Isy/IfCwAhsB/C6C5s2EVcKCw/k9GeaSEt9O8D3rM5Cc03mI7n/QG6O+t58M8vw768H8J6s/nMZqbZz2bbD6Y3v4/sB/O6y/S5u+n9D+b12/Q/mNdfof+7S/P5v/f5v+8HeP5f/xP+b/8b/j/+D/yL/5b/43/o//5/7f/P/+r/43/z//t/8//2P+V/7X/5f+T/2H/6/+I/2f/8/+Q/4H/m/+p/4n/4/+k/+3/wP/W/7X/n/9t/9v/rf9v/9v/df/Vf3X/lX/Vf9V/5V/9X/Nf81/zX/Vf9V/5V/Nf81/1X/lfzX/Nf9V/zX/df81/zX/Nf81/7X/Nf+1/zX/Ff/1/xX/9f8V//X/df8N/w3/Df8V/w3/Df8V/w3/Tf8N/w3/Tf8V/w3/Df8N/03/Df8N/03/Ff8N/w3/Df9N/w3/Df9N/xX/df91/xX/df91/zX/df91/zX/Ff91/3X/df8V/3X/df91/zX/Ff91/3X/Nf8V/7X/tf81/7X/lf+1/7X/Nf+1/7X/lf+1/7X/tf+V/zX/tf+V/zX/Ff+1/7X/tf+1/5X/tf+V/zX/tf9t/2v/lf+1/w3/a/8b/tf+V/2H/2/8j/tf+t/2v/k//2v/q/+F/3P/m//O/9D/zP/A/9L/5H/5f9r/zP/i/8D/6v/F//r/1//m/7L/u/9P+x3+f5+n+d58H+T793+m+d18z+bfd3+h/k+d1/L8zPZ9n2+L55+y39A/oA4n+d+j/f/8734v3v/P8/n930H4/zGfz+6wZ/X35m+z6/5X18z+p/P1/N9h+v6M9n1/SPr++i/m/Z/8//Ufr+nPX9E+f6E9/4Q4n+f9kGZdlWZZlWYb9ATuH5Wzht5w7AAAAAElFTkSuQmCC";
        
        const picMember = record.team?.find(m => m.id === record.picId);

        const data = {
            UnitPemohon: record.abstraksi?.unitPemohon || '',
            UnitPemanggil: record.abstraksi?.unitPemanggil || '',
            NomorSuratTugas: posisi.suratTugas || '',
            Wilayah: record.abstraksi?.wilayah || '',
            NomorND: record.Nomor || '',
            TanggalSuratTugas: formatDateForDoc(posisi.tanggalSuratTugas),
            SuratPemanggilan: posisi.suratPemanggilan || '',
            PihakPemanggil: Array.isArray(posisi.pemanggil) ? posisi.pemanggil.filter(Boolean).join(', ') : posisi.pemanggil || '',
            PihakTerpanggil: Array.isArray(posisi.terpanggil) ? posisi.terpanggil.filter(Boolean).join(', ') : posisi.terpanggil || '',
            PosisiKasus: posisi.posisiKasus || '',
            PokokPermasalahan: record.abstraksi?.pokokPermasalahan || '',
            AgendaPendampingan: posisi.agenda || '',
            TanggalPendampingan: formatDateForDoc(posisi.tanggalAgenda),
            RincianPelaksanaan: posisi.rincian || '',
            TanggalND: formatDateForDoc(record.tanggal.split('/').reverse().join('-')),
            PIC: picMember?.nama || record.team?.[0]?.nama || '',
        };

        const details = [
            { label: 'Surat Pemanggilan', value: data.SuratPemanggilan },
            { label: 'Pihak Pemanggil', value: data.PihakPemanggil },
            { label: 'Pihak Terpanggil', value: data.PihakTerpanggil },
            { label: 'Posisi Kasus', value: data.PosisiKasus },
            { label: 'Agenda Pendampingan', value: data.AgendaPendampingan },
            { label: 'Tanggal Pendampingan', value: data.TanggalPendampingan },
            { label: 'Rincian Pelaksanaan', value: data.RincianPelaksanaan },
        ];

        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        children: [new ImageRun({
                            data: Uint8Array.from(atob(logoBase64), c => c.charCodeAt(0)),
                            transformation: { width: 80, height: 80 },
                        })],
                        alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({ text: 'KEMENTERIAN KEUANGAN REPUBLIK INDONESIA', alignment: AlignmentType.CENTER, style: 'header' }),
                    new Paragraph({ text: 'SEKRETARIAT JENDERAL', alignment: AlignmentType.CENTER, style: 'header' }),
                    new Paragraph({ text: 'BIRO ADVOKASI', alignment: AlignmentType.CENTER, style: 'header' }),
                    new Paragraph({ text: 'Gedung Djuanda I Jl. Dr. Wahidin Raya Nomor 1 Jakarta', alignment: AlignmentType.CENTER, style: 'subheader' }),
                    new Paragraph({ text: ' ', border: { bottom: { color: "auto", space: 1, style: "single", size: 6 } }, spacing: { after: 400 } }),
                    
                    new Paragraph({ text: 'LAPORAN', alignment: AlignmentType.CENTER, style: 'title' }),
                    new Paragraph({ text: 'TENTANG', alignment: AlignmentType.CENTER, style: 'title' }),
                    new Paragraph({ text: `LAPORAN PELAKSANAAN PENDAMPINGAN [${data.UnitPemohon}] OLEH`, alignment: AlignmentType.CENTER, style: 'title' }),
                    new Paragraph({ text: `[${data.UnitPemanggil}] BERDASARKAN [${data.NomorSuratTugas}] DI [${data.Wilayah}]`, alignment: AlignmentType.CENTER, style: 'title' }),
                    new Paragraph({ text: `NOMOR [${data.NomorND}]`, alignment: AlignmentType.CENTER, style: 'title', spacing: { after: 400 } }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Sehubungan dengan pelaksanaan Surat Tugas Nomor [${data.NomorSuratTugas}] tanggal [${data.TanggalSuratTugas}], dengan ini kami sampaikan laporan pendampingan di [${data.Wilayah}] sebagai berikut:`, }),
                        ],
                        spacing: { after: 200 }
                    }),
                     
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
                        rows: details.map(item => new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph(item.label)], width: { size: 30, type: WidthType.PERCENTAGE } }),
                                new TableCell({ children: [new Paragraph(': ' + item.value)] }),
                            ],
                        })),
                    }),

                    new Paragraph({ text: 'Demikian kami sampaikan atas perhatian Bapak, kami ucapkan terima kasih.', spacing: { before: 200, after: 800 } }),
                    
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph('')] }), // Empty cell for spacing
                                    new TableCell({
                                        children: [
                                            new Paragraph(`Dibuat di Jakarta pada`),
                                            new Paragraph(`tanggal [${data.TanggalND}]`),
                                            new Paragraph({ text: ' ', spacing: { before: 1200 } }),
                                            new Paragraph('Ditandatangani secara elektronik'),
                                            new Paragraph(data.PIC),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                    
                    new Paragraph({ text: 'Tembusan:', spacing: { before: 800 } }),
                    new Paragraph({ text: 'Pejabat Pembuat Komitmen Biro Advokasi' }),
                ],
            },],
            styles: {
                paragraphStyles: [
                    { id: "header", name: "Header", run: { bold: true, size: 24 } },
                    { id: "subheader", name: "Subheader", run: { size: 18 } },
                    { id: "title", name: "Title", run: { bold: true, size: 24 } },
                ]
            }
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `Laporan_Pendampingan_${record.Nomor || record.id}.docx`);
        });
    };

    return (
        <>
            {modalState.isOpen && (
                <UpdatePosisiModal
                    isOpen={modalState.isOpen}
                    onClose={handleCloseModal}
                    onSave={handleSavePosisi}
                    initialData={modalState.data}
                    record={record}
                />
            )}
            <ConfirmationModal
                isOpen={deleteModalState.isOpen}
                onClose={() => setDeleteModalState({ isOpen: false, posisiId: null })}
                onConfirm={handleConfirmDelete}
                title="Konfirmasi Hapus"
                message="Apakah Anda yakin ingin menghapus data posisi pendampingan ini?"
                confirmText="Hapus"
            />
            <div className="h-full flex flex-col bg-gray-50">
                <header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <div className="ml-3">
                            <h2 className="text-lg font-bold text-gray-800">Posisi Pendampingan</h2>
                            <p className="text-base font-semibold text-gray-700 mt-1">{record.Nomor || record.id}</p>
                            <p className="text-sm text-gray-600 mt-1">{record.perihal}</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => handleOpenModal('add')} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                            <PlusIcon className="h-5 w-5" />
                            <span>Tambah Posisi</span>
                        </button>
                    </div>
                </header>
                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Surat Tugas</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agenda & Waktu</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pihak & Surat Pemanggilan</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posisi Kasus</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rincian Pelaksanaan</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {record.posisi && record.posisi.length > 0 ? record.posisi.map((p, index) => (
                                        <tr key={p.id}>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-4 py-4 text-sm text-gray-800">
                                                {p.suratTugas}
                                                <div className="text-xs text-gray-500">{formatDate(p.tanggalSuratTugas)}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-800 font-medium">
                                                {p.agenda}
                                                <div className="text-xs text-gray-500 mt-1">{formatDate(p.tanggalAgenda)}</div>
                                                <div className="text-[10px] text-blue-600 bg-blue-50 inline-block px-1.5 py-0.5 rounded mt-1">{p.durasi} Menit</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-800">
                                                <div className="mb-1">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Pemanggil</span> 
                                                    {Array.isArray(p.pemanggil) ? p.pemanggil.filter(Boolean).join(', ') : p.pemanggil}
                                                </div>
                                                <div className="mb-1">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Terpanggil</span> 
                                                    {Array.isArray(p.terpanggil) ? p.terpanggil.filter(Boolean).join(', ') : p.terpanggil}
                                                </div>
                                                <div><span className="text-[10px] uppercase font-bold text-gray-400 block">Surat Pemanggilan</span> {p.suratPemanggilan}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-800 font-semibold">{p.posisiKasus}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 max-w-xs transition-all">
                                                <div className="line-clamp-3 text-xs leading-relaxed">{p.rincian}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-center space-x-1">
                                                <button onClick={() => handleDownload(p)} className="p-2 rounded-full hover:bg-gray-100 text-blue-600" title="Download Laporan"><DownloadIcon className="h-5 w-5"/></button>
                                                <button onClick={() => handleGenerateST(p)} className="p-2 rounded-full hover:bg-gray-100 text-green-600" title="Generate ST"><DocumentTextIcon className="h-5 w-5"/></button>
                                                <button onClick={() => onNavigate('eAdvokasiPendampinganDokumen', record)} className="p-2 rounded-full hover:bg-gray-100 text-orange-500" title="Dokumen"><CloudIcon className="h-5 w-5"/></button>
                                                <button onClick={() => handleOpenModal('edit', p)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500" title="Edit"><PencilIcon className="h-5 w-5"/></button>
                                                <button onClick={() => requestDelete(p.id)} className="p-2 rounded-full hover:bg-gray-100 text-red-500" title="Delete"><TrashIcon className="h-5 w-5"/></button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className="text-center py-10 text-gray-500">Tidak ada data posisi pendampingan.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PosisiPendampingan;