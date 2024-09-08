'use client'
import Image from 'next/image'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {motion, useScroll, useTransform} from 'framer-motion'
import {
  ChevronDoubleDownIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils';
import { useRef } from 'react';
import { AppNavBar } from './app-ui/AppNavBar';
import { HomeSectionTitle } from './home/HomeSectionTitle';
import { HomeFeatures } from './home/HomeFeatures';
import HomePricing from './home/HomePricing';
import Ripple from './magicui/ripple';
export default function HomeUI({
  user
}: {
  user: User
}) {
  return (
    <>
      <Banner />
      <Hero isSignedin={!!user} />
      <HomeFeatures />
      <ProductShowcase className="pt-16"/>
      <HomePricing />
      <Footer />
    </>
  )
}

function Banner() {
  return (
    <div className="h-[50px] flex items-center justify-center gradient-background-2">
      <div className="container">
        <p className="font-medium text-center">
          Online personal banking platform powered by
          <a className="ml-2 underline underline-offset-4 cursor-pointer">Plaid</a>
        </p>
      </div>
    </div>
  )
}

function Hero({isSignedin}) {
  const containerRef = useRef(null)
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['center start', 'end start']
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  return (
    <div ref={containerRef} className="bg-black text-white hero-gradient py-4 pt-0 h-[calc(100vh-50px)] relative overflow-hidden">
      {/* <AppNavBar isSignedin={isSignedin} className="py-4 bg-transparent bg-[linear-gradient(to_bottom,black,#270a11)]" /> */}
      <div className="absolute aspect-square rounded-[100%] bg-black 
        bg-[radial-gradient(closest-side,#000_82%,#711000)] hero-ball top-[70%]
        2xl:bg-[radial-gradient(closest-side,#000_90%,#711000)]
        min-[1400px]:bg-[radial-gradient(closest-side,#000_95%,#711000)]
        min-[1400px]:top-[60%]
        min-[2000px]:bg-[radial-gradient(closest-side,#000_95%,#711000)]
        min-[2000px]:top-[55%]
      "
      />
      <div className="relative">
        <AppNavBar isSignedin={isSignedin} className="py-4 bg-transparent z-10 relative" />
        <div className="mt-[100px] md:mt-6 lg:mt-0 flex flex-col justify-center align-items z-10 relative">
          <motion.h1
            className="grow text-6xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-center mt-8"
            initial={{opacity: 0, y: -100}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
          >
            Bank{' '}
            <motion.span
              animate={{
                backgroundPositionX: "200%"
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              }}
              className="bg-[linear-gradient(to_right,#FFBE0F,#FFA45B,#FFDA77,#FFBE0F,#FFA45B,#FFDA77)] [background-size:200%] text-transparent bg-clip-text [-webkit-background-clip:text]">
              smarter
            </motion.span>,<br/> 
            Live <span className="bg-gradient-to-r from-fuchsia-300 to-red-900 text-transparent bg-clip-text [-webkit-background-clip:text]">Better</span>
          </motion.h1>
          <div className="px-8 flex flex-col md:flex-row gap-8 justify-center items-end">
            <motion.div
              className="flex-none hidden md:block"
              initial={{opacity: 0, x: -50}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.5, delay: 0.3}}
            >
              <Image
                src="/pie-chart.png"
                width={128}
                height={128}
                alt="pie chart icon"
              />
            </motion.div>
            <motion.p
              className="text-center md:text-left text-medium lg:text-xl mt-8 lg:max-w-[600px]"
              initial={{opacity: 0, x: 150}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.5, delay: 0.5}}
            >
              We&apos;re redefining how you manage your money
              with intuitive tools and cutting-edge technology.
              Experience a new standard in personal finance with Fincent,
              where your financial well-being is our top priority.
            </motion.p>
          </div>
          <div className="flex justify-center mt-8">
            <motion.div
              initial={{opacity: 0, y: 150}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 1}}
            >
              <Button className="mt-8 bg-[#5C2FC2] hover:bg-[#27174d] text-white hover:drop-shadow-xl">
                <Link href="/sign-up">Get Started For Free</Link>
              </Button>
            </motion.div>
          </div>
        </div>
        <Ripple />
      </div>
        <motion.div
          className="absolute bottom-[100px] left-[50%] -translate-x-1/2"
            initial={{opacity: 0, y:-50, x:"-50%"}}
            animate={{opacity: 1, y:0}}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: "easeInOut",
            }}
          >
          <motion.div
            style={{
              opacity: opacity,
              y: y
            }}
          >
          <ChevronDoubleDownIcon width={64} height={64} alt="chevron-down icon" className="text-white/30"/>
        </motion.div>
      </motion.div>
    </div>
  )
}

const INITIAL_ROTATE_X = 20
const INITIAL_OPACITY = 0.5
function ProductShowcase({className}) {
  const imageRef = useRef<HTMLImageElement>(null)
  const {scrollYProgress} = useScroll({
    target: imageRef,
    offset: ['center end', 'end end']
  })
  const rotateX = useTransform(scrollYProgress, [0, 1], [INITIAL_ROTATE_X, 0])
  const opacity = useTransform(scrollYProgress, [0, 1], [INITIAL_OPACITY, 1])
  return (
    <div className={cn("bg-black text-white bg-gradient-to-b from-black to-[#ff204d93] py-12", className)}>
      <div className="container">
        <div className="flex flex-col justify-center items-center gap-4">
          <HomeSectionTitle title="Intuitive UI" />
          <div className="flex flex-col items-center lg:items-start lg:flex-row lg:flex-row-reverse gap-8 mt-8">
            <p className="lg:max-w-[400px] text-white/70 text-center lg:text-left">
              Discover unparalleled financial control with our cutting-edge personal banking app.
              Seamlessly track your spending with detailed expense breakdowns, effortlessly review your transaction history,
              and manage your finances with ease through secure fund transfers. Empower yourself with intuitive tools designed to simplify and enhance your banking experience
            </p>
            <motion.div
              style={{
                opacity: opacity,
                rotateX: rotateX,
                transformPerspective: '800px'
              }}
              className="bg-gradient-to-r from-fuchsia-800 to-red-500 rounded-lg overflow-hidden p-4"
            >
              <Image ref={imageRef} src="/Desktop.png" width={500} height={500} className="box-shadow" alt="product screenshot" />
           </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
function Footer() {
  return (
    <footer className="py-5 bg-black text-white/60">
      <div className="container">
        <div className="flex flex-col">
          <div className="text-center">
          © 2024 Fincent, Inc. All rights reserved
          </div>
        </div>
      </div>
    </footer>
  )
}
