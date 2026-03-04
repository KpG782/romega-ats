export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--rs-primary-50)]">
      {children}
    </div>
  );
}
