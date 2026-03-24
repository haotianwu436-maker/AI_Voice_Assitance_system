import * as XLSX from "xlsx";

type ParsedCustomer = {
  phone: string;
  name: string | null;
  note: string | null;
};

function normalizePhone(input: string) {
  return input.replace(/\D/g, "");
}

export function parseCustomerExcel(buffer: ArrayBuffer) {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  const unique = new Map<string, ParsedCustomer>();
  const invalidRows: number[] = [];

  rows.forEach((row, index) => {
    const phone = normalizePhone(String(row.phone || "").trim());
    if (!phone) {
      invalidRows.push(index + 2);
      return;
    }
    if (!unique.has(phone)) {
      unique.set(phone, {
        phone,
        name: String(row.name || "").trim() || null,
        note: String(row.note || "").trim() || null
      });
    }
  });

  return { customers: [...unique.values()], invalidRows };
}
