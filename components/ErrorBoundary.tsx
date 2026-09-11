import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    
    // If it's a chunk loading failure / dynamic import failure, try to auto-reload once per session
    const isChunkError = 
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('error loading dynamically imported module') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      const hasReloaded = sessionStorage.getItem('chunk_reload_attempted');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_reload_attempted', 'true');
        window.location.reload();
      }
    }
  }

  private handleReload = () => {
    sessionStorage.removeItem('chunk_reload_attempted');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white max-w-md w-full rounded-xl border border-slate-200 shadow-xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0055A5] mx-auto flex items-center justify-center text-xl font-bold">
              ⚖
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pembaruan Modul Sistem
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Terdapat pembaruan pada modul aplikasi atau koneksi sementara terputus. Silakan segarkan halaman untuk melanjutkan.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 bg-[#0055A5] hover:bg-[#004282] text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
              >
                Segarkan Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
