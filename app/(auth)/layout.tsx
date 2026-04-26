export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-1/4 -left-32 h-64 w-64 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-[150px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {children}
      </div>
    </div>
  );
}
