export type Page<T> = {
  //this _embedded could be optional**
  _embedded: {
    [key: string]: T[];
  };
  _links: object;
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
