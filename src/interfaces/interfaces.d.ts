interface Script {
  id?: number;
  content: string;
  tags: string[];
  category: string;
}

interface Tag {
  id?: number;
  category: string;
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

// 定义接口
interface MessageHandler {
  (data: any): Promise<Result<any>>;
}

interface ScriptState {
  scripts: Script[];         // 当前页的脚本
  total: number;             // 总条数
  exportScripts: Script[];   // 导出的脚本
  currentFilter: string; // 添加filter状态
  setCurrentFilter: (filter: string) => void; // 添加设置filter的方法
  loadScripts: (page: number, size: number, category: string) => Promise<void>;
  addScript: (script: Omit<Script, 'id'>) => Promise<void>;
  deleteScript: (id: number) => Promise<void>;
  updateScript: (script: Script) => Promise<void>;
  getScriptById: (id: number) => Promise<Script | undefined>;
  deleteCategory: (category: string) => Promise<void>;
  getExportScripts: (category: string, tags: string[]) => void;
  loadScriptsByCategoryAndTags: (page: number, size: number, category: string, tags: string[]) => Promise<void>; // 添加这个方法定义
}

interface TagState {
  tags: Tag[];
  selectedTags: string[]; // 选中类型的全部标签
  allTagsByCategory: Tag[];
  setSelectedTags: (tags: string[]) => void;
  loadTags: () => Promise<void>;
  addTag: (category: string, tagName: string) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;
  deleteTagByName: (name: string) => Promise<boolean>;
  getTagsByCategory: (category: string) => Promise<Tag[]>;
}

interface CategoryState {
  categories: Category[];
  loadCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (name: string) => Promise<void>;
}

interface SingleInputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  placeholder?: string
  defaultValue?: string
  onSubmit: (value: string) => Promise<void>
  validate?: (value: string) => string | null
}

interface ConfirmDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
}

interface MiniProps {
  miniChangeOpen: (open: boolean) => void
  setSide: (side: "left" | "right") => void;
  side: "left" | "right";
}
interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  onUploadComplete?: (files: File[]) => void;
  onClose?: () => void;
  accept?: string;
}

// 定义组件的 Props 类型
interface TagsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // 可选的默认标签类型
  defaultTagType?: string;
}

interface SpeechExtensionReadyEvent extends CustomEvent {
  detail: {
    shadowRoot: ShadowRoot;
  };
}

declare global {
  interface Window {
    __speechExtensionShadowRoot?: ShadowRoot;
  }
}