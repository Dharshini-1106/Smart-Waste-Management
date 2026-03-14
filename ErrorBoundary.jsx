import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error: error, errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md">
            <div className="w-24 h-24 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border-4 border-red-500/30">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Something went wrong
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
              An unexpected error occurred. Your data is safe.
            </p>
            {this.state.error && (
              <details className="mb-8 p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-slate-400 max-w-md mx-auto">
                <summary className="cursor-pointer font-medium mb-2">Error details (click to expand)</summary>
                <pre className="mt-2 p-3 bg-slate-900/50 rounded-lg overflow-x-auto text-xs font-mono">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReload}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              🔄 Reload App
            </button>
            <p className="text-sm text-slate-500 mt-6">
              Tip: Check browser console (F12) for more details.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

