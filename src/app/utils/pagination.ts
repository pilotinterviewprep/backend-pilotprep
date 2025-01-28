type TPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
const pagination = (paginationOptions: TPaginationOptions) => {
  const { page, limit, sortBy, sortOrder } = paginationOptions;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  const sortWith = sortBy || "created_at";
  const sortSequence = sortOrder || "desc";

  return {
    pageNumber,
    limitNumber,
    skip,
    sortWith,
    sortSequence,
  };
};

export default pagination;
