import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-[560px] rounded-xl border bg-card p-8 text-center space-y-5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <TriangleAlert className="h-6 w-6 text-foreground" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Error 404</p>
          <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
          <p className="text-sm text-muted-foreground">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Go to Dashboard
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              window.history.back();
            }}
          >
            Go Back
          </Button>
        </div>

        <div className="pt-1">
          <img src="/logo.png" alt="Firespot" className="mx-auto h-6 w-auto opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
