export const parseNumber = (value: string | null | undefined): number | null => {
    if (!value || value.trim() === '') return null;
    const cleaned = value.replace(/[^\d.,]/g, '').trim();
    if (!cleaned) return null;
    const num = parseFloat(cleaned.replace(',', '.'));
    return isNaN(num) ? null : num;
  };
  
  export const parseString = (value: string | null | undefined): string | null => {
    if (!value || value.trim() === '') return null;
    return value.trim();
  };