'use client'
import { cn } from "@/lib/utils";
import { HomeSectionTitle } from "./HomeSectionTitle";
import { Button } from "../ui/button";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import {
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Separator } from "../ui/separator";
import { useEffect, useRef } from "react";
import { GradientText } from "../app-ui/GradientText";
import Link from "next/link";

const data = [
  {
    title: 'Basic',
    description: 'For personal use and exploration',
    price: 0,
    features: [
      'Account Details',
      'Transaction History',
      'Transfer Funds'
    ]
  }
]
export default function HomePricing({className}) {
  return (
    <div className={cn("bg-black text-white bg-[linear-gradient(to_bottom,#ff204d93_0%,#300b16_42%,black_100%)] py-12", className)}>
      <div className="container">
        <div className="flex flex-col justify-center items-center gap-4">
          <HomeSectionTitle title="Pricing"/>
          <div className="mt-8 pb-8">
            {
              data.map(({title, description, price, features}) => (
                <PricingCard title={title} description={description} price={price} features={features}/>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function PricingCard({
  title,
  description,
  features
}) {
  const priceVal = useMotionValue(99)
  const priceTextRef = useRef()
  const numberRef = useRef(null)
  const isInView = useInView(numberRef)
  useEffect(() => {
    const runSequence = async () => {
      // 1. animate the price down to 0
      await animate(priceVal, 0, {
        duration: 3
      })
      // 2. then animate the 'free' text to show up
      await animate(priceTextRef.current, {
        opacity: 1,
        x: 0
      }, {
        duration: 0.5,
        type: 'spring',
        bounce: 0.4,
      })
    }
    if (isInView) {
      runSequence();
    }
  }, [isInView])
  const price = useTransform(priceVal, (val) => {
    return Math.round(val)
  })
  return (
    <div className="rounded-xl p-8 pb-12 box-shadow bg-[linear-gradient(to_bottom,black)]">
      <h2 className="text-2xl font-medium">{title}</h2>
      <p className="text-medium text-white/70">{description}</p>
      <div className="flex flex-row gap-4 items-center">
        <div ref={numberRef} className="flex flex-row items-start mt-4">
          <span className="text-md">
            $
          </span>
          <motion.span
            className="text-6xl font-bold"
          >
            {price}
          </motion.span>
        </div>
        <motion.span ref={priceTextRef} className="text-lg opacity-0" initial={{x: -50}}>
          <GradientText text="FREE" className="font-bold bg-[linear-gradient(to_right,#C3FF93,#FFDB5C,#FFAF61,#FF70AB,#A0DEFF,#5AB2FF,#C3FF93,#FFDB5C,#FFAF61,#FF70AB,#A0DEFF,#5AB2FF)]"/>
        </motion.span>
      </div>
      <ul>
        {
         features.map( (feature, idx) => (
          <li key={idx} className="flex flex-col">
            <div className="flex flex-row gap-2 py-4">
              <CheckCircleIcon className="w-6" />
              {feature}
            </div>
            <Separator className="bg-white/70"/>
          </li>
         )) 
        }
      </ul>
      <div className="w-full flex flex-row justify-center">
        <Button className="mt-8 bg-[#5C2FC2] hover:bg-[#27174d] text-white hover:drop-shadow-xl">
          <Link href="/sign-up">Get Started</Link>
        </Button>
      </div>
    </div>
  )
}