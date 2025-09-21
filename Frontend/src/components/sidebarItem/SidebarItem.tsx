import { useState, useEffect, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  showPreview?: boolean;
  previewUrl?: string;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
}

export default function SidebarItem({
  icon,
  label,
  isOpen,
  showPreview,
  previewUrl,
  isActive,
  onClick,
  onDelete,
  onRename,
}: SidebarItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newLabel, setNewLabel] = useState(label);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isMountedRef = useRef(true);

  // Sync newLabel with label prop changes
  useEffect(() => {
    setNewLabel(label);
  }, [label]);

  // Reset image error when previewUrl changes
  useEffect(() => {
    setImageError(false);
  }, [previewUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleRename = () => {
    const trimmedLabel = newLabel.trim();
    
    if (!trimmedLabel) {
      setNewLabel(label);
      setIsEditing(false);
      return;
    }

    if (trimmedLabel !== label && onRename) {
      onRename(trimmedLabel);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;
    
    try {
      setIsDeleting(true);
      await onDelete();
    } catch (error) {
      console.error("Delete operation failed:", error);
    } finally {
      if (isMountedRef.current) {
        setIsDeleting(false);
      }
    }
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDeleting) {
      setIsEditing(true);
    }
  };

  // Show thumbnail if available and no error, otherwise show icon
  const shouldShowThumbnail = showPreview && previewUrl && !imageError;

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition group
        ${isOpen ? "justify-start" : "justify-center"}
        ${isActive ? "bg-zinc-800" : "hover:bg-zinc-800"}
        ${isDeleting ? "opacity-50" : ""}`}
    >
      {/* Main button */}
      {!isEditing ? (
        <button
          onClick={onClick}
          disabled={isDeleting}
          className="flex items-center gap-3 flex-1 truncate text-left disabled:cursor-not-allowed"
        >
          {shouldShowThumbnail ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-8 w-8 rounded object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            icon
          )}
          {isOpen && <span className="truncate">{label}</span>}
        </button>
      ) : (
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleRename();
            }
            if (e.key === "Escape") {
              setNewLabel(label);
              setIsEditing(false);
            }
          }}
          autoFocus
          className="flex-1 bg-zinc-700 text-white px-2 py-1 rounded text-sm outline-none"
        />
      )}

      {/* Edit/Delete buttons only visible when sidebar is open */}
      {isOpen && (onRename || onDelete) && !isEditing && (
        <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition">
          {onRename && (
            <button
              onClick={handleStartEdit}
              disabled={isDeleting}
              className="text-zinc-400 hover:text-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-zinc-400 hover:text-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}