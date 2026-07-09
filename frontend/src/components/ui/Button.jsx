import { Loader2 } from "lucide-react";

function Button({
  children,
  loading = false,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading}
      className="
      w-full
      bg-blue-600
      hover:bg-blue-700
      transition-all
      duration-300
      text-white
      py-3
      rounded-xl
      font-semibold
      flex
      items-center
      justify-center
      gap-2
      disabled:bg-slate-400
      "
    >
      {loading && (
        <Loader2
          className="animate-spin"
          size={18}
        />
      )}

      {children}
    </button>
  );
}

export default Button;