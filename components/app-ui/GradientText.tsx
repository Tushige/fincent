'use client'
import React from 'react'
import {motion} from 'framer-motion'
import { cn } from '@/lib/utils'

export const GradientText = ({text, className = ''}) => {
  return (
    <>
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
        className={cn("bg-[linear-gradient(to_right,#8C0000,#BD2000,#FA1E0E,#FFBE0F,#FFA45B,#FFDA77,#8C0000,#BD2000,#FA1E0E,#FFBE0F,#FFA45B,#FFDA77)] [background-size:200%] text-transparent bg-clip-text [-webkit-background-clip:text]", className)}>
        {text}
      </motion.span>
    </>
  )
}
