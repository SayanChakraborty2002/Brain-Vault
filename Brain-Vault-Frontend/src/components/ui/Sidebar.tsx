import { useNavigate } from "react-router-dom";
import { LogoutIcon } from "../../icons/Logout";
import { Button } from "./Button";
import { SideBarItems } from "./SideBarItems";
import { useState } from "react";

interface Props {
  setFilter: (val: string) => void;
}

export function SideBar({ setFilter }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // New state for mobile toggle

  function logout() {
    setIsLoading(true);
    localStorage.removeItem("Authorization");
    setTimeout(() => {
      navigate("/");
      setIsLoading(false);
    }, 500);
  }

  return (
    <>
    <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
    <div className={`
        bg-white w-64 h-screen flex flex-col fixed shadow-md border-r
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        z-40
      `}>
      
      
      <div className="text-lg font-semibold mt-4 pl-9">Content types</div>
      <div className="mt-3 space-y-2">
        <SideBarItems
          icon={<img src="/logo/brainLogo.png" />}
          text="all"
          onClick={() => setFilter("all")}
        />
        <SideBarItems
          icon={<img src="/logo/youtubeLogo.png" />}
          text="youtube"
          onClick={() => setFilter("youtube")}
        />
        <SideBarItems
          icon={<img src="/logo/twitterLogo.png" />}
          text="twitter"
          onClick={() => setFilter("twitter")}
        />
        <SideBarItems
          icon={<img src="/logo/linkedinLogo.png" />}
          text="linkedin"
          onClick={() => setFilter("linkedin")}
        />
        <SideBarItems
          icon={<img src="/logo/noteLogo.png" />}
          text="note"
          onClick={() => setFilter("note")}
        />
        <SideBarItems
          icon={<img src="/logo/brainLogo.png" />}
          text="others"
          onClick={() => setFilter("others")}
        />
      </div>

      <div className="flex justify-end items-end mt-auto p-4">
        <Button
          variant="primary"
          startIcon={<LogoutIcon size="md" />}
          title={isLoading ? "Logging out..." : "Logout"}
          onClick={logout}
          size="sm"
          disabled={isLoading}
        />
      </div>
    </div>
    </>
  );
}
