enum ModelType {
  user = 'user',
  product = 'product',
}

interface ResponseApi {
  isOk: boolean;
  statusCode?: number;
  message: string;
  data: any;
}

export { ModelType, ResponseApi };
