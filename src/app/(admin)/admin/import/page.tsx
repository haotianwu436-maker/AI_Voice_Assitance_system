import { ImportUpload } from "@/components/admin/import-upload";
import { Card } from "@/components/ui/card";

export default function AdminImportPage() {
  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-base font-semibold">客户导入（Excel）</h3>
        <p className="mt-1 text-sm text-slate-500">
          模板字段：phone（必填）、name（可选）、note（可选）。系统按手机号去重。
        </p>
      </Card>
      <ImportUpload />
    </div>
  );
}
