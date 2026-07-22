import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';

/**
 * Button — Reusable button komponen untuk project Benua Kertas.
 * Membungkus shadcn Button dengan styling brand yang konsisten.
 *
 * @param {'primary' | 'outline'} variant  - Tipe tampilan button (default: 'primary').
 * @param {React.ReactNode}       iconLeft  - Ikon di sisi kiri label (opsional).
 * @param {React.ReactNode}       iconRight - Ikon di sisi kanan label (opsional).
 * @param {string}                className - Class Tailwind tambahan (opsional).
 * @param {React.ReactNode}       children  - Label teks button.
 * @param {object}                props     - Prop HTML button lainnya (onClick, type, disabled, dll).
 *
 * @example
 * import { Button } from '@/components';
 * import { ArrowRight, Download } from 'lucide-react';
 *
 * // Primary dengan icon kanan
 * <Button iconRight={<ArrowRight size={16} />}>Mulai Custom</Button>
 *
 * // Outline dengan icon kanan
 * <Button variant="outline" iconRight={<ArrowRight size={16} />}>Lihat Katalog</Button>
 *
 * // Dengan icon kiri
 * <Button iconLeft={<Download size={16} />}>Unduh PDF</Button>
 *
 * // Tanpa icon
 * <Button type="submit">Simpan</Button>
 */
const Button = ({
  variant = 'primary',
  iconLeft = null,
  iconRight = null,
  className = '',
  children,
  ...props
}) => {
  const styles = {
    primary:
      'bg-color-dark hover:bg-gradient-to-br hover:from-color-grad_start hover:from-60% hover:to-color-grad_end text-color-white rounded-sm px-4 py-2.5 md:px-6 md:py-5 font-normal shadow-lg shadow-green-900/20 text-xs md:text-base group transition-all duration-300',
    outline:
      'border border-color-dark text-color-dark hover:border-transparent hover:bg-gradient-to-br hover:from-color-grad_start hover:from-60% hover:to-color-grad_end hover:text-color-white rounded-sm px-4 py-2.5 md:px-6 md:py-5 font-semibold group text-xs md:text-base transition-all duration-300',
  };

  return (
    <ShadcnButton
      variant={variant === 'outline' ? 'outline' : undefined}
      className={`flex items-center gap-2 ${styles[variant]} ${className}`}
      {...props}
    >
      {iconLeft && (
        <span className="group-hover:-translate-x-0.5 transition-transform">
          {iconLeft}
        </span>
      )}
      {children}
      {iconRight && (
        <span className="group-hover:translate-x-1 transition-transform">
          {iconRight}
        </span>
      )}
    </ShadcnButton>
  );
};

export default Button;
