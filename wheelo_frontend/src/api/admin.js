import { adminApi } from './axios'

// Auth
export const adminLogin = (data) => adminApi.post('/auth/login/', data)
export const adminRefresh = (data) => adminApi.post('/auth/refresh/', data)
export const adminLogout = () => adminApi.post('/auth/logout/')

// Vehicles
export const getAdminVehicles = (params) => adminApi.get('/vehicles/', { params })
export const getAdminVehicle = (id) => adminApi.get(`/vehicles/${id}/`)
export const createVehicle = (data) => adminApi.post('/vehicles/', data)
export const updateVehicle = (id, data) => adminApi.put(`/vehicles/${id}/`, data)
export const deleteVehicle = (id) => adminApi.delete(`/vehicles/${id}/`)

// Categories
export const getAdminCategories = () => adminApi.get('/categories/')
export const createCategory = (data) => adminApi.post('/categories/', data)
export const updateCategory = (id, data) => adminApi.put(`/categories/${id}/`, data)
export const deleteCategory = (id) => adminApi.delete(`/categories/${id}/`)

// Vehicle Images
export const uploadVehicleImage = (data) => adminApi.post('/vehicle-images/', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const deleteVehicleImage = (id) => adminApi.delete(`/vehicle-images/${id}/`)

// Inquiries
export const getInquiries = (params) => adminApi.get('/inquiries/', { params })
export const updateInquiryStatus = (id, status) => adminApi.patch(`/inquiries/${id}/`, { status })

// Banners
export const getBanners = () => adminApi.get('/banners/')
export const createBanner = (data) => adminApi.post('/banners/', data)
export const updateBanner = (id, data) => adminApi.put(`/banners/${id}/`, data)
export const deleteBanner = (id) => adminApi.delete(`/banners/${id}/`)

// Gallery
export const getAdminGallery = () => adminApi.get('/gallery/')
export const uploadGalleryImage = (data) => adminApi.post('/gallery/', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const deleteGalleryImage = (id) => adminApi.delete(`/gallery/${id}/`)

// Testimonials
export const getTestimonials = () => adminApi.get('/testimonials/')
export const createTestimonial = (data) => adminApi.post('/testimonials/', data)
export const updateTestimonial = (id, data) => adminApi.put(`/testimonials/${id}/`, data)
export const deleteTestimonial = (id) => adminApi.delete(`/testimonials/${id}/`)

// FAQs
export const getFaqs = () => adminApi.get('/faqs/')
export const createFaq = (data) => adminApi.post('/faqs/', data)
export const updateFaq = (id, data) => adminApi.put(`/faqs/${id}/`, data)
export const deleteFaq = (id) => adminApi.delete(`/faqs/${id}/`)

// CMS Sections
export const getCmsSections = () => adminApi.get('/cms-sections/')
export const updateCmsSection = (id, data) => adminApi.put(`/cms-sections/${id}/`, data)

// Settings
export const getAdminSettings = () => adminApi.get('/settings/')
export const updateSettings = (data) => adminApi.put('/settings/', data)

// Analytics
export const getDashboardAnalytics = () => adminApi.get('/analytics/dashboard/')
