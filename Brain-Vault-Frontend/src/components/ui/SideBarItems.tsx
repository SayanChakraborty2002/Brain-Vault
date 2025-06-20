import { ReactElement } from "react";

interface SidebarType {
  icon: ReactElement;
  text: string;
  onClick?: () => void;
}

export function SideBarItems(props: SidebarType) {
  return (
    <div
      onClick={props.onClick}
      className="flex pl-4 ml-8 pt-2 cursor-pointer hover:scale-105 transition-all
      active:scale-95 w-3/4 hover:shadow-md hover:border rounded"
    >
      <div className="h-7 w-7">{props.icon}</div>
      <div className="pl-4 capitalize font-medium text-gray-700">{props.text}</div>
    </div>
  );
}
