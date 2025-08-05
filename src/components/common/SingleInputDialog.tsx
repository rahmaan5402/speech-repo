import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { withToastFeedback } from "@/utils/withToastFeedback"
import { useState, useEffect } from "react"

export default function SingleInputDialog({
  open,
  onOpenChange,
  title,
  placeholder = "请输入内容",
  defaultValue = "",
  onSubmit,
}: SingleInputDialogProps) {
  const [value, setValue] = useState(defaultValue)
  const [loading, setLoading] = useState(false)

  // 若 defaultValue 改变，重新同步 value
  useEffect(() => {
    if (open) {
      setValue(defaultValue)
    }
  }, [defaultValue, open])

  const handleSave = async () => {
    setLoading(true)
    withToastFeedback(() => onSubmit(value))
    onOpenChange(false)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-gray-700 text-right">
              名称
            </Label>
            <Input
              id="name"
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button className="bg-[#7161F6] hover:bg-[#7161F6]" type="button" onClick={handleSave} disabled={loading}>
            {loading ? "保存中..." : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
