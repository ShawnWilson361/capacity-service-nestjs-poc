export interface ErrorWithLabels extends Error {
  metadata: {
    labels: { [key: string]: unknown };
  };
}
