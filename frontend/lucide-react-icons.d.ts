type LucideProps = import("react").SVGProps<SVGSVGElement> & {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
};

declare module "lucide-react/dist/esm/icons/*" {
  const Icon: import("react").ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & import("react").RefAttributes<SVGSVGElement>
  >;
  export default Icon;
}
