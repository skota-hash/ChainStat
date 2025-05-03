import Papa from "papaparse";
import csvContent from "../data/IPL_stats_final.csv?raw";
export const parseStaticCSV = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err: any) => reject(err),
    });
  });
};
