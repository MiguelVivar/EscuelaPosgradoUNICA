import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AdminLoadingProps } from "@/types/Admin";


export default function AdminLoading({ message = "Cargando panel administrativo..." }: AdminLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      <div className="text-center">
        <LoadingSpinner size="lg" message={message} />
      </div>
    </div>
  );
}
