global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
