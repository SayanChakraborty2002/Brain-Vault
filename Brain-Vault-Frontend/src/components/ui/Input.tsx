interface InputBoxTypes {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeHolder: string;
  type?: "text" | "password";
  dataListId?: string;
  dataListOptions?: string[];
   className?: string; 
}

export const InputBox = (props: InputBoxTypes) => {
  return (
   <div className="flex mt-3 items-center w-full">
    
      <input
        list={props.dataListId}
        type={props.type || "text"}
        placeholder={props.placeHolder}
        onChange={props.onChange}
       className={`px-3 caret-slate-500 focus:ring-2 focus:outline-none
           focus:ring-blue-400 h-10 border border-gray-500 hover:ring-blue-400 hover:ring-2
           w-full rounded-md ${props.className || ''}`}
      />
      {props.dataListOptions && props.dataListId && 
      <datalist id={props.dataListId}>
        {props.dataListOptions.map((option) => (
            <option  key={option} value={option} />
          ))}
      </datalist>
      }
    </div>  
  );
};
