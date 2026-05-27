export type SaveAccessibilityReportActionState = {
  status: 'idle' | 'success' | 'error';
  formError:
    | 'unauthorized'
    | 'projectNotFound'
    | 'colorTokenSetNotFound'
    | 'unexpected'
    | null;
  savedReport: {
    id: string;
    score: number;
    status: 'pass' | 'warning' | 'fail';
    createdAt: string;
  } | null;
};

export const initialSaveAccessibilityReportActionState: SaveAccessibilityReportActionState =
  {
    status: 'idle',
    formError: null,
    savedReport: null,
  };
