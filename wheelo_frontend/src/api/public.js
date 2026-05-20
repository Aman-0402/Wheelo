import { publicApi } from './axios'

export const getVehicles = (params) => publicApi.get('/vehicles/', { params })
export const getVehicle = (slug) => publicApi.get(`/vehicles/${slug}/`)
export const getCategories = () => publicApi.get('/categories/')
export const submitInquiry = (data) => publicApi.post('/inquiries/', data)
export const getHomepage = () => publicApi.get('/homepage/')
export const getTestimonials = () => publicApi.get('/testimonials/')
export const getFaqs = () => publicApi.get('/faqs/')
export const getGallery = () => publicApi.get('/gallery/')
export const getSettings = () => publicApi.get('/settings/')
export const getBanners = () => publicApi.get('/banners/')
