import { iconProps, iconSizes } from "./iconProps";

export const CrossIcon = (props: iconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className={`${iconSizes[props.size || "md"]} 
      cursor-pointer opacity-70 text-white 
      hover:opacity-100 
      transition-transform duration-200 
      hover:scale-125 hover:rotate-90 
      active:scale-90 
      hover:drop-shadow-lg`}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
};
