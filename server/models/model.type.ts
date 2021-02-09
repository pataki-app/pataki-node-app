enum ModelType {
  user = 'user',
  product = 'product',
  category = 'category',
  evaluation = 'evaluation',
  order = 'order',
}

interface ResponseError extends Error {
  status?: number;
  statusCode?: number;
}

interface ResponseApi {
  isOk: boolean;
  statusCode?: number;
  message?: string;
  data: any;
}

export { ModelType, ResponseApi, ResponseError };
