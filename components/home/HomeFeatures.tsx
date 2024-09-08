'use client'
import { animate, motion, stagger, useAnimationFrame, useInView, useMotionTemplate, useMotionValue, useTransform } from "framer-motion"
import { HomeSectionTitle } from "./HomeSectionTitle"
import {
  PaperAirplaneIcon,
  CurrencyDollarIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import Meteors from "../magicui/meteors"

const features = [
  {
    title: 'Transaction History',
    description: 'Easily review and track all your financial activity across all your accounts',
    icon: BookOpenIcon,
    borderColor1: 'border-[#06D001]',
    borderColor2: 'border-[#F3FF90]'
  },
  {
    title: 'Transfer Funds',
    description: 'Send money between accounts or to others with just a few taps. With real-time updates and customizable options, managing and tracking your transfers has never been easier.',
    icon: PaperAirplaneIcon,
    borderColor1: 'border-[#C738BD]',
    borderColor2: 'border-[#E49BFF]'
  },
  {
    title: 'Expenses Breakdown',
    description: 'Obtain clear insights into your spending patterns across various categories. This feature helps you easily identify areas where you can save and budget more effectively.',
    icon: CurrencyDollarIcon,
    borderColor1: 'border-[#C40C0C]',
    borderColor2: 'border-[#FF6500]'
  }
]

export function HomeFeatures() {
  const staggerItems = stagger(0.5, { startDelay: 0.15 });
  return (
    <div className="bg-black py-8 relative overflow-hidden">
      <Meteors number={30} />
      <div className="container">
        <HomeSectionTitle title="What's Included" />
        <p className="text-center mt-5 text-xl text-white/70">Enjoy a quick overview of your expenses and income all in one place </p>
        <div
          className="mt-16 flex flex-col gap-8 sm:flex-row sm:gap-4 rounded-lg"
        >
          {
            features.map( ({title, description, icon, borderColor1, borderColor2}, idx) => {
              return (
                <Feature
                  key={title}
                  staggerItems={staggerItems}
                  idx={idx}
                  title={title}
                  description={description}
                  Icon={icon}
                  position={idx * 100}
                  borderColor1={borderColor1}
                  borderColor2={borderColor2}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

function Feature({
  title,
  description,
  Icon,
  idx,
  staggerItems,
  duration = 5000,
  position = 0,
  borderColor1 = 'border-fuchsia-500',
  borderColor2 = 'border-fuchsia-900'
}) {
  const pathRef = useRef(null)
  const enterContainerRef = useRef(null)
  const isInView = useInView(enterContainerRef)
  const progress = useMotionValue<number>(position)  
  const progress2 = useMotionValue<number>(position)
  const border = useRef<HTMLDivElement>(null)
  useAnimationFrame((time) => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength()
    if (length) {
      const pxPerMillisecond = length / duration
      progress.set((time * pxPerMillisecond) % length)
      progress2.set( ((time * pxPerMillisecond) + length/2) % length )
    }
  })
  useEffect(() => {
    if (isInView) {
      animate(enterContainerRef.current, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        y: "0%"
      }, {
        duration : 0.5,
        type: 'spring',
        bounce: 0.4,
        delay: idx * 0.1
      })
    }
  }, [isInView, idx])
  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x)
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y)
  const maskImage = useMotionTemplate`radial-gradient(100px 120px at ${x}px ${y}px, black, transparent)`;

  const x2 = useTransform(progress2, (val) => (pathRef.current?.getPointAtLength(val).x))
  const y2 = useTransform(progress2, (val) => (pathRef.current?.getPointAtLength(val).y))
  const maskImage2 = useMotionTemplate`radial-gradient(100px 120px at ${x2}px ${y2}px, white, transparent)`;
  return (
    <motion.div
      ref={enterContainerRef}
      initial={{ rotate: 20, scale: 0.5, y: "50%", opacity: 0.3}}
      className="grow-1 flex flex-col items-center rounded-xl border border-white/30 px-5 py-10 text-center sm:flex-1 relative">
      <div className="absolute inset-0 rounded-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute h-full w-full"
          width="100%"
          height="100%"
        >
          <rect
            fill="none"
            width="100%"
            height="100%"
            rx="30%"
            ry="30%"
            ref={pathRef}
          />
        </svg>
      </div>
      <motion.div ref={border} className={cn("absolute inset-0 border-4 rounded-xl", borderColor1)} style={{
        WebkitMaskImage: maskImage,
        maskImage: maskImage
      }} />
      <motion.div ref={border} className={cn("absolute inset-0 border-4 rounded-xl", borderColor2)} style={{
        WebkitMaskImage: maskImage2,
        maskImage: maskImage2
      }} />
      <Icon
        className="w-12 h-12 p-2 bg-white text-black justify-center items-center rounded-lg hover:bg-gradient-to-r hover:from-fuchsia-300"
      />
      <h3 className="mt-6 font-bold">{title}</h3>
      <p className="mt-2 text-white/70">{description}</p>
    </motion.div>
  )
}
