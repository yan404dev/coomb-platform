interface AvatarProps {
  isUser: boolean;
}

export function Avatar({ isUser }: AvatarProps) {
  if (isUser) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#10b981] to-[#028A5A] text-xs font-semibold text-white shadow-sm">
        Você
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-xs font-semibold text-white shadow-sm">
      AI
    </div>
  );
}
