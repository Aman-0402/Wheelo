import { Helmet } from 'react-helmet-async'
import HeroSection from '@/components/public/home/HeroSection'
import FeaturedVehicles from '@/components/public/home/FeaturedVehicles'
import CategoriesSection from '@/components/public/home/CategoriesSection'
import WhyChooseUs from '@/components/public/home/WhyChooseUs'
import RentalProcess from '@/components/public/home/RentalProcess'
import TestimonialsSection from '@/components/public/home/TestimonialsSection'
import FaqPreview from '@/components/public/home/FaqPreview'
import CtaBanner from '@/components/public/home/CtaBanner'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Wheelo — Your Ride, Anytime | Premium Vehicle Rental in Vadodara</title>
        <meta name="description" content="Premium vehicle rental in Vadodara. Browse our luxury fleet of cars, SUVs, bikes and more. Submit an inquiry and get confirmed today." />
        <meta property="og:title" content="Wheelo — Your Ride, Anytime" />
        <meta property="og:description" content="Premium vehicle rental in Vadodara." />
      </Helmet>

      <HeroSection />
      <FeaturedVehicles />
      <CategoriesSection />
      <WhyChooseUs />
      <RentalProcess />
      <TestimonialsSection />
      <FaqPreview />
      <CtaBanner />
    </>
  )
}
