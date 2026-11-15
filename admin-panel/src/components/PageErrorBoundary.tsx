import React from 'react';
import { Button } from '@/components/ui/button';

// Keeps one broken admin page from blanking the whole panel: the sidebar stays usable
// and the error is shown with a retry.
interface State { error: Error | null }

class PageErrorBoundary extends React.Component<{ children: React.ReactNode; resetKey?: string }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Admin page crashed:', error, info.componentStack);
  }

  componentDidUpdate(prev: { resetKey?: string }) {
    // Navigating to another page clears the error
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-900">This page hit an error</h2>
        <p className="text-sm text-red-800 mt-1 mb-4">{this.state.error.message}</p>
        <Button variant="outline" onClick={() => this.setState({ error: null })}>Try again</Button>
      </div>
    );
  }
}

export default PageErrorBoundary;
