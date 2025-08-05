interface Script {
    id?: number;
    content: string;
    tags: string[];
    category: string;
}

interface Tag {
  id?: number;
  name: string;
}

interface Category {
  id?: number;
  name: string;
  sorted: number;
}

interface Option {
  value: string;
  label: string;
}

interface ScriptState {
    scripts: Script[];         // 当前页的脚本
    total: number;             // 总条数
    loadScripts: (page: number, size: number, category: string) => Promise<void>;
    addScript: (script: Omit<Script, 'id'>) => Promise<boolean>;
    deleteScript: (id: number, page: number, size: number, category: string) => Promise<boolean>;
    updateScript: (script: Script) => Promise<boolean>;
    getScriptById: (id: number) => Promise<Script | undefined>;
    deleteCategory: (category: string) => Promise<boolean>;
}

interface TagState {
  tags: Tag[];
  loadTags: () => Promise<void>;
  addTag: (name: string) => Promise<boolean>;
  deleteTag: (id: number) => Promise<void>;
}

interface CategoryState {
  categories: Category[];
  loadCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<boolean>;
  deleteCategory: (name: string) => Promise<boolean>;
}

interface SingleInputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  placeholder?: string
  defaultValue?: string
  onSubmit: (value: string)  => Promise<boolean>
}

interface ConfirmDialogProps {
  trigger: ReactNode
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
}

interface MiniProps {
  miniChangeOpen: (open: boolean) => void
  setSide: (side: "left" | "right") => void;
  side: "left" | "right";
}

interface HeaderProps extends MiniProps {}