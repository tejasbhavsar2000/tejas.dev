export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[72rem] px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
