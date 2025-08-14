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
import { useToastFeedback } from "@/hooks/useToastFeedback"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function SingleInputDialog({
  open,
  onOpenChange,
  title,
  placeholder,
  defaultValue = "",
  onSubmit,
}: SingleInputDialogProps) {
  const { t } = useTranslation();
  const withToastFeedback = useToastFeedback();
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
    await withToastFeedback(() => onSubmit(value))
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
              {t('dialog.common.name')}
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
            {loading ? t('dialog.common.action.saving') : t('dialog.common.action.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
