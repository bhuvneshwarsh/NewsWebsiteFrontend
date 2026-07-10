// ─────────────────────────────────────────────────────────────────────────────
// Add trackView to your existing articlesApi object in src/services/api.ts
//
// Find this block in your api.ts:
//
//   export const articlesApi = {
//     list: ...
//     getBySlug: ...
//     create: ...
//     update: ...
//     delete: ...
//   };
//
// Add this line inside that object (after the delete line, before the closing }):
//
//   trackView: (slug: string) =>
//     api.post(`/articles/${slug}/view`),
//
// ─────────────────────────────────────────────────────────────────────────────
//
// Final articlesApi should look like this:
//
// export const articlesApi = {
//   list: (params?) => api.get('/articles', { params }),
//   getBySlug: (slug) => api.get(`/articles/${slug}`),
//   create: (data) => api.post('/articles', data),
//   update: (id, data) => api.put(`/articles/${id}`, data),
//   delete: (id) => api.delete(`/articles/${id}`),
//   trackView: (slug: string) => api.post(`/articles/${slug}/view`),  ← ADD THIS
// };
//
// ─────────────────────────────────────────────────────────────────────────────
