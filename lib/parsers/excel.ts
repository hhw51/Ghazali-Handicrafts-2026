import ExcelJS from 'exceljs';
import { sheetProductRowSchema, SheetProductRow } from '@/lib/validations/product';

export interface ParsedRowResult {
  rowIndex: number;
  row: Partial<SheetProductRow>;
  isValid: boolean;
  errors: string[];
  data?: SheetProductRow;
}

export async function parseExcelBuffer(
  buffer: Buffer,
  isCsv: boolean = false
): Promise<{
  results: ParsedRowResult[];
  validRows: SheetProductRow[];
  invalidCount: number;
}> {
  const workbook = new ExcelJS.Workbook();

  if (isCsv) {
    const Readable = require('stream').Readable;
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    await workbook.csv.read(stream);
  } else {
    await workbook.xlsx.load(buffer as any);
  }

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('No worksheet found in uploaded file');
  }

  const headers: string[] = [];
  const results: ParsedRowResult[] = [];
  const validRows: SheetProductRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    // Row 1 is header
    if (rowNumber === 1) {
      row.eachCell((cell) => {
        const val = cell.value ? String(cell.value).trim().toLowerCase() : '';
        headers.push(val);
      });
      return;
    }

    const rowObj: Record<string, any> = {};

    row.eachCell((cell, colNumber) => {
      const headerName = headers[colNumber - 1];
      if (!headerName) return;

      let cellValue = cell.value;
      // Handle hyperlink or formula objects from ExcelJS
      if (cellValue && typeof cellValue === 'object') {
        if ('result' in cellValue) cellValue = cellValue.result;
        else if ('text' in cellValue) cellValue = cellValue.text;
      }

      // Standardize header mapping
      if (headerName === 'name' || headerName === 'title' || headerName === 'product name') {
        rowObj['name'] = cellValue;
      } else if (headerName.includes('long description') || headerName === 'description') {
        rowObj['long description'] = cellValue;
      } else if (headerName.includes('short description') || headerName.includes('underneath')) {
        rowObj['short description (underneath product picture)'] = cellValue;
      } else if (headerName === 'price') {
        rowObj['price'] = cellValue;
      } else if (headerName === 'size') {
        rowObj['size'] = cellValue;
      } else if (headerName === 'stock' || headerName === 'in stock' || headerName === 'availability') {
        rowObj['stock'] = cellValue;
      } else if (headerName === 'images' || headerName === 'image' || headerName === 'photo' || headerName === 'photos') {
        rowObj['images'] = cellValue;
      } else if (headerName === 'colors' || headerName === 'color') {
        rowObj['colors'] = cellValue;
      } else if (headerName === 'design' || headerName === 'designs' || headerName === 'pattern' || headerName === 'style') {
        rowObj['design'] = cellValue;
      } else if (headerName === 'category' || headerName === 'craft category' || headerName === 'material') {
        rowObj['category'] = cellValue;
      } else if (headerName === 'weight') {
        rowObj['weight'] = cellValue;
      } else if (headerName === 'tags' || headerName === 'tag') {
        rowObj['tags'] = cellValue;
      } else {
        rowObj[headerName] = cellValue;
      }
    });

    // Skip completely empty rows
    if (!rowObj['name'] && !rowObj['price'] && !rowObj['category']) {
      return;
    }

    const parseResult = sheetProductRowSchema.safeParse(rowObj);

    if (parseResult.success) {
      results.push({
        rowIndex: rowNumber,
        row: parseResult.data,
        isValid: true,
        errors: [],
        data: parseResult.data,
      });
      validRows.push(parseResult.data);
    } else {
      const errMsgs = parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      results.push({
        rowIndex: rowNumber,
        row: rowObj,
        isValid: false,
        errors: errMsgs,
      });
    }
  });

  return {
    results,
    validRows,
    invalidCount: results.filter((r) => !r.isValid).length,
  };
}

export function parseGoogleSheetUrl(url: string): { csvExportUrl: string; sheetId: string; gid: string } | null {
  if (!url || !url.includes('docs.google.com/spreadsheets')) return null;

  const sheetIdMatch = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!sheetIdMatch || !sheetIdMatch[1]) return null;

  const sheetId = sheetIdMatch[1];
  const gidMatch = url.match(/gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : '0';

  return {
    sheetId,
    gid,
    csvExportUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`,
  };
}

