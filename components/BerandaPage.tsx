
import React from 'react';
import {
    DesktopComputerIcon,
    CursorClickIcon,
    DocumentAddIcon,
    SendIcon,
    ShieldCheckIcon
} from './icons';
import { BerandaContent } from '../types';

interface BerandaPageProps {
  content: BerandaContent;
}

const flowIcons = [
    <DesktopComputerIcon className="h-10 w-10 text-blue-600" />,
    <CursorClickIcon className="h-10 w-10 text-blue-600" />,
    <DocumentAddIcon className="h-10 w-10 text-blue-600" />,
    <SendIcon className="h-10 w-10 text-blue-600" />,
    <ShieldCheckIcon className="h-10 w-10 text-blue-600" />,
];

const BerandaPage: React.FC<BerandaPageProps> = ({ content }) => {
    return (
        <div className="p-8 bg-gray-100 h-full overflow-y-auto">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8">
                <h1 className="text-2xl font-bold text-blue-800">{content.pageTitle}</h1>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md relative">
                <div className="flex items-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{content.flowTitle}</h2>
                </div>

                <div className="relative">
                    <div className="flex flex-col md:flex-row items-start justify-center md:space-x-4 space-y-8 md:space-y-0">
                         {content.flowSteps.map((item, index) => (
                             <div key={item.step} className="relative w-full md:w-1/5 flex flex-col items-center text-center px-2">
                                <div className="relative mb-4">
                                    <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full shadow-inner">
                                        {flowIcons[index % flowIcons.length]}
                                    </div>
                                    <div className="absolute -top-1 -right-1 flex items-center justify-center w-8 h-8 bg-[#0055A5] text-white font-bold text-lg rounded-full border-2 border-white">
                                        {item.step}
                                    </div>

                                </div>
                                <h3 className="text-md font-semibold text-gray-800">{item.title}</h3>
                                <p className="mt-1 text-xs text-gray-600 h-16">{item.description}</p>
                                {index < content.flowSteps.length - 1 && (
                                     <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{content.eAdvokasiTitle}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        {content.eAdvokasiParagraph1}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        {content.eAdvokasiParagraph2}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BerandaPage;