interface LongoLogoProps {
  className?: string;
}

export function LongoLogo({ className = '' }: LongoLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="../public/longo_logo.png"
        alt="Longo Logo"
        className="h-20 w-20 object-contain border-radius-23"
      />
      <span className="ml-3 text-2xl font-bold text-white tracking-wide"></span>
    </div>
  );
}
