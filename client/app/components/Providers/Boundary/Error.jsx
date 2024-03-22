'use client';

import { redirect } from 'next/navigation';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  componentDidCatch() {
    this.setState({ error: true });
  }

  render() {
    if (this.state.error === true && process.env.NODE_ENV !== 'development') return redirect('/error?code=0');
    return this.props.children; 
  }
}

export default ErrorBoundary;