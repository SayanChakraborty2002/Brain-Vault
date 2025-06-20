import { DeleteIcon } from "../../icons/delete";
import { ShareIcon } from "../../icons/ShareIcon";

interface CardType {
  title: string;
  link: string;
  type?: contentType;
  description?: string;
  tags?: string[];
  deleteItem?: (id: string) => void;
}

type contentType = "youtube" | "twitter" | "linkedin" | "image" | "audio" | "article" | "note";

const LinkStyles = {
  youtube: "/logo/youtubeLogo.png",
  twitter: "/logo/twitterLogo.png",
  linkedin: "/logo/linkedinLogo.png",
  image: "/logo/imageLogo.png",
  audio: "/logo/audioLogo.png",
  article: "/logo/articleLogo.png",
  note: "/logo/noteLogo.png",
};

const isImageUrl = (url: string): boolean => {
  return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url) || 
         url.includes("unsplash.com") ||
         url.includes("i.imgur.com");
};

const isAudioUrl = (url: string): boolean => {
  return /\.(mp3|wav|ogg|flac|m4a)$/i.test(url);
};

const isNoteUrl = (url: string): boolean => {
  return /\.(txt|md|pdf)$/i.test(url);
};

export const Card = (props: CardType) => {
  // Determine content type based on URL if not provided
  const contentType = props.type || 
    (isImageUrl(props.link) ? "image" : 
     isAudioUrl(props.link) ? "audio" : 
     isNoteUrl(props.link) ? "note" : 
     "article");

  const imageSrc = LinkStyles[contentType] || LinkStyles.note;

  const renderEmbeddedContent = () => {
    switch (contentType) {
      case "youtube":
        let videoId = "";
        try {
          const urlObj = new URL(props.link);
          if (urlObj.hostname === "youtu.be") {
            videoId = urlObj.pathname.slice(1);
          } else {
            videoId = urlObj.searchParams.get("v") || "";
          }
        } catch {
          // Invalid URL, fallback to link display
        }
        
        if (videoId) {
          return (
            <iframe
              className="w-full h-full rounded-b-md p-3 overflow-y-auto max-h-80"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          );
        }
        break;

      case "twitter":
        return (
          <div className="overflow-y-auto rounded-md max-h-80">
            <blockquote className="twitter-tweet !border-none">
              <a href={props.link.replace("x.com", "twitter.com")}></a>
            </blockquote>
          </div>
        );

      case "linkedin":
        return (
          <iframe
            className="w-full h-full rounded-b-md p-3 overflow-y-auto max-h-80"
            src={`https://www.linkedin.com/embed/feed/update/${props.link}`}
            height="400"
            width="100%"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        );

      case "image":
        return (
          <div className="flex justify-center items-center p-3 bg-gray-100">
            <img
              src={props.link}
              alt={props.title}
              className="max-h-72 max-w-72 object-contain rounded-md shadow-sm"
              onError={(e) => {
                e.currentTarget.src = "public/logo/fallbackImage.jpg";
                e.currentTarget.alt = "Image failed to load";
              }}
            />
          </div>
        );

      case "audio":
        return (
          <div className="p-3 bg-gray-50 rounded-b-md">
            <audio
              controls
              src={props.link}
              className="w-full"
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        );

      case "note":
        return (
          <iframe
            src={props.link}
            className="w-full h-80 rounded-b-md border-t border-gray-200"
            title="Note Viewer"
          />
        );

      default:
        return (
          <div className="p-4 bg-gray-50 rounded-b-md">
            <a 
              href={props.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium break-all"
            >
              {props.link}
            </a>
          </div>
        );
    }
  };

  return (
   <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md w-full h-full flex flex-col">
      <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
        <img 
          src={imageSrc} 
          alt={contentType} 
          className="w-5 h-5 object-contain" 
        />
        <span className="text-gray-700 font-medium flex-1 ml-2 truncate">
          {props.title}
        </span>
        
        <div className="flex items-center gap-2">
          <a
            href={props.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-500 transition-colors"
            title="Open original"
          >
            <ShareIcon />
          </a>
          
          {props.deleteItem && (
            <button
              onClick={() => props.deleteItem!(props.title)}
              className="text-gray-500 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <DeleteIcon  />
            </button>
          )}
        </div>
      </div>

      {/* Embedded content */}
       <div className="w-full aspect-video min-h-[150px] max-h-80 overflow-hidden">
        {renderEmbeddedContent()}
      </div>

      {/* Tags */}
      {props.tags && props.tags?.filter(tag => tag.trim() !== "").length > 0 && (
        <div className="flex flex-wrap gap-1 p-3 border-t border-gray-100">
          {props.tags
            .filter(tag => tag.trim() !== "")
            .map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
        </div>
      )}

      {/* Description */}
      {props.description && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-700 line-clamp-3">
            {props.description}
          </p>
        </div>
      )}
    </div>
  );
};