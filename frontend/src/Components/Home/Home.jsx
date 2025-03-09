import React from 'react'
import Navbar from '../Navbar'
import HeroSection from '../HeroSection'
import Footer from '../Footer'
import HowItWorks from '../HowItWorks'
import WhyChooseUs from '../WhyChooseUs'

function Home() {
  return (
    <div>
      <Navbar/>
      <br />
      <HeroSection/>
      <br />
      <HowItWorks/>
      <br />
      <WhyChooseUs/>
      <br />
      <Footer/>
    </div>
  )
}

export default Home
