export type Theme = {
  borderColor: string;
  backgroundColor: string;
  textColor: string;
};

export const defaultTheme: Theme = {
  borderColor: '#333',
  backgroundColor: '#eee',
  textColor: '#333'
};

export const darkTheme: Theme = {
  borderColor: '#777',
  backgroundColor: '#333',
  textColor: '#eee'
};
