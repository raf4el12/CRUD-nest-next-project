interface DataPagination<T> {
  rows: T[];
  count: number;
}

const getPagination = (currentPage: number, size: number) => {
  const limit = size ? +size : 10;
  const offset = currentPage ? (currentPage - 1) * limit : 0;
  return { limit, offset };
};

const getDataPagination = <T>(data: DataPagination<T>, page: number, limit: number) => {
  const { count: totalItems, rows } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    data: rows,
    totalPages,
    currentPage,
  };
};

const pagination = {
  getPagination,
  getDataPagination,
};

export default pagination;
