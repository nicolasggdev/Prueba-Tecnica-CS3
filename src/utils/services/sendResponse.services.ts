interface ResponseData {
  status: string;
  error: boolean;
  codHttp: number;
  message: string;
  data: any;
}

export const sendResponses = (res: any, codHttp: number, data: any, message: string) => {
  const codStatus = codHttp.toString();

  const status = codStatus.startsWith("2")
    ? "success"
    : codStatus.startsWith("4")
    ? "error"
    : "fail";

  const response: ResponseData = {
    status,
    error: status === "success" ? false : true,
    codHttp,
    message,
    data
  };

  res.status(codHttp).json(response);
};
