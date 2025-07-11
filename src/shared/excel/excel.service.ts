import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
  async parseExcelBuffer(buffer: Buffer): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = Uint8Array.from(buffer).buffer;
    await workbook.xlsx.load(arrayBuffer);
    
    const worksheet = workbook.worksheets[0];
    const data: any[] = [];
    const headers: string[] = [];

    worksheet.eachRow((row, rowNumber) => {
      const rowValues = row.values as any[];
      if (rowNumber === 1) {
        rowValues.slice(1).forEach(header => {
          headers.push(header || '');
        });
      } else {
        const rowObject: any = {};
        rowValues.slice(1).forEach((cellValue, index) => {
          rowObject[headers[index]] = cellValue ?? '';
        });
        data.push(rowObject);
      }
    });

    return data;
  }
}
