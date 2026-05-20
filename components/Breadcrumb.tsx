
import React from 'react';
import { View } from '../types';
import { ChevronRightIcon, HomeIcon } from './icons';

interface BreadcrumbProps {
    currentView: View;
    onNavigate: (view: View) => void;
    extraLabel?: string;
}

const viewLabels: Record<string, { label: string; parent?: View }> = {
    'eAdvokasiBeranda': { label: 'Beranda' },
    'eAdvokasiInbox': { label: 'Inbox Permohonan' },
    'eAdvokasiPengelolaan': { label: 'Pengelolaan Permohonan' },
    'eAdvokasiPendampingan': { label: 'Pendampingan' },
    'eAdvokasiPenangananPerkara': { label: 'Penanganan Perkara' },
    'eAdvokasiPenangananPutusan': { label: 'Penanganan Putusan' },
    'eAdvokasiArsip': { label: 'Arsip' },
    'eAdvokasiRecycleBin': { label: 'Recycle Bin' },
    'eAdvokasiFaq': { label: 'FAQ' },
    'eAdvokasiInformasi': { label: 'Informasi' },
    'eAdvokasiPendampinganDetail': { label: 'Detail Pendampingan', parent: 'eAdvokasiPendampingan' },
    'eAdvokasiPendampinganTim': { label: 'Tim Advokasi', parent: 'eAdvokasiPendampingan' },
    'eAdvokasiPendampinganPosisi': { label: 'Posisi Pendampingan', parent: 'eAdvokasiPendampingan' },
    'eAdvokasiPendampinganDokumen': { label: 'Dokumen', parent: 'eAdvokasiPendampingan' },
    'eAdvokasiPerkaraDetail': { label: 'Detail Perkara', parent: 'eAdvokasiPenangananPerkara' },
    'eAdvokasiPerkaraEdit': { label: 'Edit Perkara', parent: 'eAdvokasiPenangananPerkara' },
    'eAdvokasiPerkaraTim': { label: 'Tim Advokasi', parent: 'eAdvokasiPenangananPerkara' },
    'eAdvokasiPerkaraDokumen': { label: 'Dokumen', parent: 'eAdvokasiPenangananPerkara' },
    'eAdvokasiPutusanDetail': { label: 'Detail Putusan', parent: 'eAdvokasiPenangananPutusan' },
    'eAdvokasiPutusanEdit': { label: 'Edit Putusan', parent: 'eAdvokasiPenangananPutusan' },
    'eAdvokasiPutusanTim': { label: 'Tim Advokasi', parent: 'eAdvokasiPenangananPutusan' },
    'eAdvokasiPutusanDokumen': { label: 'Dokumen', parent: 'eAdvokasiPenangananPutusan' },
    'eAdvokasiMonitoring': { label: 'Monitoring' },
    'eAdvokasiDashboard': { label: 'Dashboard', parent: 'eAdvokasiMonitoring' },
    'eAdvokasiPencarianPerkara': { label: 'Cari Perkara', parent: 'eAdvokasiMonitoring' },
    'eAdvokasiPencarianPendampingan': { label: 'Cari Pendampingan', parent: 'eAdvokasiMonitoring' },
    'eAdvokasiPencarianPutusan': { label: 'Cari Penanganan Putusan', parent: 'eAdvokasiMonitoring' },
    'eAdvokasiMonitoringPersidangan': { label: 'Persidangan', parent: 'eAdvokasiMonitoring' },
    'eAdvokasiMonitoringPutusan': { label: 'Putusan', parent: 'eAdvokasiMonitoring' },
    'eAdvokasiMonitoringPendampingan': { label: 'Pendampingan', parent: 'eAdvokasiMonitoring' },
    'eAdvokasiMonitoringPerkara': { label: 'Perkara', parent: 'eAdvokasiMonitoring' },
    'eAdvokasiMonitoringRisikoHukum': { label: 'Risiko Hukum', parent: 'eAdvokasiMonitoring' },
    'eAdvokasiAuditTrail': { label: 'Audit Trail', parent: 'eAdvokasiMonitoring' },
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentView, onNavigate, extraLabel }) => {
    const getPath = (view: View): { view: View; label: string }[] => {
        const path = [];
        let curr = view;
        while (curr && viewLabels[curr]) {
            path.unshift({ view: curr, label: viewLabels[curr].label });
            curr = viewLabels[curr].parent as View;
        }
        return path;
    };

    const path = getPath(currentView);

    return (
        <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                    <button
                        onClick={() => onNavigate('eAdvokasiBeranda')}
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                        <HomeIcon className="w-4 h-4 mr-2" />
                        Home
                    </button>
                </li>
                {path.map((item, index) => (
                    <li key={item.view}>
                        <div className="flex items-center">
                            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                            <button
                                onClick={() => onNavigate(item.view)}
                                className={`ml-1 text-sm font-medium md:ml-2 ${
                                    index === path.length - 1 && !extraLabel
                                        ? 'text-blue-600 cursor-default'
                                        : 'text-gray-700 hover:text-blue-600'
                                }`}
                                disabled={index === path.length - 1 && !extraLabel}
                            >
                                {item.label}
                            </button>
                        </div>
                    </li>
                ))}
                {extraLabel && (
                    <li>
                        <div className="flex items-center">
                            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                            <span className="ml-1 text-sm font-medium text-blue-600 md:ml-2">
                                {extraLabel}
                            </span>
                        </div>
                    </li>
                )}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
