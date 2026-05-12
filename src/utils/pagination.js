export const getPagination = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const createPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  pages: Math.max(Math.ceil(total / limit), 1)
});
