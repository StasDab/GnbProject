export interface CalculatorData {
  serviceType: string;
  serviceLabel: string;
  length: string;
  diameter: string;
  soilType: string;
  soilTypeLabel: string;
  complexity: string;
  complexityLabel: string;
  calculatedPrice: number;
  timestamp: number;
}

const CACHE_KEY = 'gnb_calculator_data';

export const saveCalculatorData = (data: CalculatorData): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save calculator data:', error);
  }
};

export const getCalculatorData = (): CalculatorData | null => {
  try {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to retrieve calculator data:', error);
    return null;
  }
};

export const clearCalculatorData = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear calculator data:', error);
  }
};
