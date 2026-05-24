import clsx from "clsx";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={clsx("logo", className)}>
      <div className="logo__mark" aria-hidden>
        S
      </div>
      {showText && <span className="logo__text">Syncle</span>}
    </div>
  );
}
