"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="glass flex flex-col items-center gap-4 rounded-2xl p-8 text-center"
          role="alert"
        >
          <AlertTriangle className="h-10 w-10 text-amber-400" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">
            {this.props.fallbackTitle ?? "Something went wrong"}
          </h2>
          <p className="text-sm text-muted">
            This section encountered an error. Try refreshing the page.
          </p>
          <GlassButton onClick={() => this.setState({ hasError: false })}>
            Try Again
          </GlassButton>
        </div>
      );
    }

    return this.props.children;
  }
}
