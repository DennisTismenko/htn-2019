import React, {Component, ReactNode} from 'react';
import {Text} from './text/Text.react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    console.error(error);
    return {
      error,
    };
  }

  render() {
    const {children} = this.props;
    const {error} = this.state;

    if (error) {
      return (
        <Text type="body" level={1} color="red">
          Something bad just happened! Please refresh :)
        </Text>
      );
    }

    return children;
  }
}
