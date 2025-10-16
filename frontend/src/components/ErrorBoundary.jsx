import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
      hasError: true
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <svg 
              className="w-6 h-6 text-red-500 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h3 className="text-lg font-medium text-red-800">
              Something went wrong
            </h3>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2 text-sm text-red-700">
              <summary className="cursor-pointer font-medium">Error details</summary>
              <div className="mt-1 p-2 bg-white rounded overflow-auto max-h-40">
                <p className="font-semibold">{this.state.error?.toString()}</p>
                <pre className="mt-2 text-xs text-gray-600">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            </details>
          )}
          
          <div className="mt-4">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm font-medium transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
