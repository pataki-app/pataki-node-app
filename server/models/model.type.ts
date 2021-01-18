enum ModelType {
  user = 'user',
  product = 'product',
}

interface ResponseError extends Error {
  status?: number;
}

interface ResponseApi {
  isOk: boolean;
  statusCode?: number;
  message: string;
  data: any;
}

export { ModelType, ResponseApi, ResponseError };
