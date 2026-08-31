export function Container({
  children,
  narrow = false,
  className = "",
}: {
  children: React.ReactNode;
  /** Reading width, for text heavy pages like a post. */
  narrow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full px-6 sm:px-8 ${
        narrow ? "max-w-[44rem]" : "max-w-[64rem]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
