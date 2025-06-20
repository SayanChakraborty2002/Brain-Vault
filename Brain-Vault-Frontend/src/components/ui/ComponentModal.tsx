import { useEffect, useState } from "react";
import { CrossIcon } from "../../icons/Cross";
import { InputBox } from "./Input";
import { Button } from "./Button";
import { validateContent } from "../../utils";
import axios from "axios";
import { URL } from "../../config";

interface ComponentTypes {
  open: Boolean;
  onClose: () => void;
  onContentAdd: ()=>void;
}

export const ComponentModal = (props: ComponentTypes) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState<"image" | "video" | "article" | "audio">(
    "image"
  );
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleChange() {
    const err = validateContent(title, link, type);
    if (err) {
      setError(err);
      return;
    }
    try {
      setError("");
      setSuccess("");
      setIsLoading(true);
      const response = await axios.post(
        `${URL}/content/postcontent`,
        {
          link,
          type,
          title,
          tag: tag.split(",").map(t => t.trim()),
          description,
        },
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      );
      if (response.status === 200) {
        setSuccess(response.data.message);
        setDescription("");
        setLink("");
        setTag("");
        setTitle("");
        setTag("");

        props.onContentAdd();
        props.onClose();
      }
    } catch (e: any) {
      if (e.response?.data?.message) {
        setError(e.response?.data?.message);
      } else {
        setError("Internal server Error");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (props.open) {
      document.body.classList.add("overflow-hidden");
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [open]);

  const contentTypes = [
    "image",
    "video",
    "article",
    "audio",
    "youtube",
    "twitter",
    "linkedin",
  ];
  return (
    <div>
      {props.open && (
        <div className="w-screen h-screen left-0 top-0 fixed z-50 flex justify-center items-center p-4">
          {/* Overlay background */}
          <div className="absolute inset-0 bg-gray-500 opacity-60"></div>

          {/* Modal content */}
          <div className="relative bg-white w-full max-w-md max-h-[80vh] rounded-md shadow-md overflow-y-auto">
            <div className=" flex felx-col justify-between items-center font-semibold text-white text-center p-3 rounded-t-md bg-blue-600 ">
              New Content
              <div onClick={props.onClose} className="flex justify-end">
                <CrossIcon size="lg" />
              </div>
            </div>
            <div className="p-4 space-y-4">
              <InputBox
                placeHolder="Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <InputBox
                placeHolder="Link"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
              />
              <InputBox
                placeHolder="Select Type"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                dataListId="content-types"
                dataListOptions={contentTypes}
              />

              <InputBox
                value={description}
                placeHolder="Description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
              <InputBox
                placeHolder="Tags"
                value={tag}
                onChange={(e) => {
                  setTag(e.target.value);
                }}
              />
            </div>
            <div className="mt-2 flex items-center justify-center ml-3">
              <Button
                variant="primary"
                title={isLoading ? "Adding..." : "Submit"}
                onClick={handleChange}
                size="md"
                disabled={isLoading}
              />
            </div>
            <div className=" mt-2 w-full flex justify-center">
              {error && <div className=" text-red-500">{error}</div>}
              {success && <div className="text-green-500">{success}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
