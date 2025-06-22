export type Page<T> = {
  // TODO: make this _embedded optional
  _embedded: {
    [key: string]: T[];
  };
  _links: any;
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
};

export type SpringPage<T> = {
  content: T[];
};
