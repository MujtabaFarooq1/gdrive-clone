import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function DriveItemDialog({
  open,
  setOpen,
  title,
  description,
  confirmText,
  action,
  item,
  onConfirm,
  onCancel,
}) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (action === "rename" && item?.name) {
      setInputValue(item.name);
    }
  }, [item, action]);

  const handleConfirm = () => {
    if (action === "rename") {
      onConfirm(inputValue.trim());
    } else {
      onConfirm();
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {action === "rename" && (
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter new name"
          />
        )}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={action === "rename" && !inputValue.trim()}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
