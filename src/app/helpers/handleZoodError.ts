/* eslint-disable @typescript-eslint/no-explicit-any */

import type { TErrorSourch, TGenericErrorResponse } from "../interfaces/error.types.js";

export const handleZoodError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSourch[] = [];

  err.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });

  return {
    statusCode: 400,
    message: "Zood Error",
    errorSources,
  };
};
