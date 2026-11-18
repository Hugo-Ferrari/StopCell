import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  temErro: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { temErro: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { temErro: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.temErro) return this.props.children;

    return (
      <div
        role="alert"
        className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center"
      >
        <TriangleAlert className="size-10 text-warning" />
        <div>
          <h2 className="text-lg font-bold text-foreground">Algo deu errado nesta tela</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Recarregue a página para tentar de novo. Se continuar acontecendo, avise o administrador.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} className="h-10 rounded-xl px-5">
          <RotateCw /> Recarregar a página
        </Button>
      </div>
    );
  }
}

export default ErrorBoundary;
