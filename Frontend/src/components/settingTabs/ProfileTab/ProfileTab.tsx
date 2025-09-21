import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImagePlus, Lock, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "sonner";



export const ProfileTab: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [fullName, setFullName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  if (!user) return null;

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleUpdateName = async () => {
    if (!fullName.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }
    setLoading(true);
    try {
      await updateUser({ name: fullName });
      toast.success("Name updated successfully!");
    } catch (err) {
      toast.error("Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    if (!file) return;

    setLoading(true);
    try {
      await updateUser({ avatar: file, name: fullName });
      toast.success("Avatar updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    const { newPassword, confirmNewPassword } = passwords;
    if (!newPassword || newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match or are empty!");
      return;
    }

    setLoading(true);
    try {
      await updateUser({ password: newPassword });
      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      toast.success("Password updated successfully!");
    } catch (err) {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="p-6 space-y-6 max-w-lg mx-auto">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        Profile & Account <Badge variant="secondary">{user.plan}</Badge>
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-200">
            {initials}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          id="avatarInput"
          className="hidden"
          onChange={(e) =>
            e.target.files && handleUpdateAvatar(e.target.files[0])
          }
        />
        <label htmlFor="avatarInput">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <span>
              <ImagePlus size={16} /> Change Avatar
            </span>
          </Button>
        </label>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label>Full Name</Label>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleUpdateName} disabled={loading}>
                Update
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save your updated full name</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Change Password */}
      <div className="space-y-2">
        <Label>Change Password</Label>

        <div className="relative">
          <Input
            type={showPasswords.old ? "text" : "password"}
            placeholder="Old Password"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, oldPassword: e.target.value })
            }
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            onClick={() =>
              setShowPasswords({ ...showPasswords, old: !showPasswords.old })
            }
          >
            {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>

        <div className="relative">
          <Input
            type={showPasswords.new ? "text" : "password"}
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            onClick={() =>
              setShowPasswords({ ...showPasswords, new: !showPasswords.new })
            }
          >
            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>

        <div className="relative">
          <Input
            type={showPasswords.confirm ? "text" : "password"}
            placeholder="Confirm New Password"
            value={passwords.confirmNewPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmNewPassword: e.target.value })
            }
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            onClick={() =>
              setShowPasswords({
                ...showPasswords,
                confirm: !showPasswords.confirm,
              })
            }
          >
            {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="mt-2 flex items-center gap-2"
          onClick={handleUpdatePassword}
          disabled={loading}
        >
          <Lock size={14} /> Update Password
        </Button>
      </div>

      {/* Delete Account */}
      <div className="pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 size={16} /> Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and all associated data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 justify-end">
              <Button variant="outline">Cancel</Button>
              <Button variant="destructive">Yes, Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};
