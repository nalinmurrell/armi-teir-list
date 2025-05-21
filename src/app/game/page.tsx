'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'

// Types for our bracket
type Contestant = {
  id: number
  imgSrc: string
}

export default function Game() {
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [currentPair, setCurrentPair] = useState<[Contestant, Contestant] | null>(null)
  const [winners, setWinners] = useState<Contestant[]>([])
  const [roundNumber, setRoundNumber] = useState(1)
  const [isGameOver, setIsGameOver] = useState(false)
  const [finalWinner, setFinalWinner] = useState<Contestant | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  
  // Initialize the game
  useEffect(() => {
    const initialContestants: Contestant[] = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      imgSrc: `/${i + 1}.jpeg`
    }))
    
    // Shuffle the array
    const shuffled = [...initialContestants].sort(() => Math.random() - 0.5)
    setContestants(shuffled)
  }, [])
  
  // Set the current pair whenever the contestants array changes
  useEffect(() => {
    if (contestants.length >= 2) {
      setCurrentPair([contestants[0], contestants[1]])
      setSelectedIndex(null) // Reset selection
    } else if (contestants.length === 0 && winners.length >= 2) {
      // Move to the next round
      setTimeout(() => {
        setContestants(winners)
        setWinners([])
        setRoundNumber(prev => prev + 1)
      }, 500) // Delay to allow for animations
    } else if (contestants.length === 0 && winners.length === 1) {
      // Game over, we have a winner
      setFinalWinner(winners[0])
      setIsGameOver(true)
      
      // Trigger confetti effect
      const duration = 5 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        // Since they're launched randomly, we can use partial confetti
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)
    }
  }, [contestants, winners])
  
  // Handle the selection
  const handleSelect = (selected: number) => {
    if (!currentPair || selectedIndex !== null) return
    
    setSelectedIndex(selected)
    
    // Add the selected contestant to winners
    const winner = currentPair[selected]
    
    // Delay to allow for exit animations
    setTimeout(() => {
      setWinners(prev => [...prev, winner])
      // Remove the current pair from contestants
      setContestants(prev => prev.slice(2))
    }, 600)
  }
  
  // If the game is over, show the winner
  if (isGameOver && finalWinner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 animate-gradient-x flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex flex-col items-center"
        >
          <h1 className="text-5xl font-bold text-white mb-8 text-center">Winner!</h1>
          
          <motion.div 
            className="relative w-[90vw] max-w-lg h-[70vh] mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            <Image 
              src={finalWinner.imgSrc} 
              alt="Winner" 
              fill
              className="object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
          
          <Link href="/">
            <motion.button
              className="bg-white text-purple-700 px-8 py-3 rounded-full font-bold text-xl hover:bg-opacity-90"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Again
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }
  
  // Return loading state if no current pair
  if (!currentPair) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 animate-gradient-x flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: [0, 360] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-3xl text-white font-bold"
        >
          Loading...
        </motion.div>
      </div>
    )
  }
  
  // Main game UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 animate-gradient-x flex flex-col items-center p-4 sm:p-8 overflow-hidden">
      <motion.h1 
        className="text-4xl font-bold text-white mb-2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        ARMI TIER LIST
      </motion.h1>
      
      <motion.div 
        className="text-xl text-white mb-4 sm:mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Choose your favorite
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full max-w-6xl justify-center items-center h-[70vh] mb-4">
        <AnimatePresence mode="wait">
          {/* Left contestant */}
          <motion.div 
            key={`contestant-${currentPair[0].id}`}
            className="w-full md:w-1/2 h-full cursor-pointer"
            initial={{ x: -300, opacity: 0 }}
            animate={selectedIndex === 0 ? "selected" : (selectedIndex === 1 ? "notSelected" : { x: 0, opacity: 1 })}
            exit={{ x: -300, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={() => handleSelect(0)}
            style={{ perspective: 1000 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            layout
            variants={{
              selected: { 
                x: 0,
                opacity: 1,
                scale: 1.05,
                boxShadow: "0px 0px 20px rgba(255,255,255,0.5)", 
                transition: { duration: 0.3 } 
              },
              notSelected: { 
                x: 0,
                opacity: 0.7,
                scale: 0.9, 
                filter: "grayscale(100%)",
                transition: { duration: 0.3 } 
              }
            }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden group">
              <Image 
                src={currentPair[0].imgSrc} 
                alt={`Contestant ${currentPair[0].id}`} 
                fill
                className="object-contain rounded-lg shadow-lg group-hover:scale-105 transition-all duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button className="w-full bg-white text-purple-700 py-3 rounded-lg font-bold text-lg">
                  Choose
                </button>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right contestant */}
          <motion.div 
            key={`contestant-${currentPair[1].id}`}
            className="w-full md:w-1/2 h-full cursor-pointer"
            initial={{ x: 300, opacity: 0 }}
            animate={selectedIndex === 1 ? "selected" : (selectedIndex === 0 ? "notSelected" : { x: 0, opacity: 1 })}
            exit={{ x: 300, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={() => handleSelect(1)}
            style={{ perspective: 1000 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            layout
            variants={{
              selected: { 
                x: 0,
                opacity: 1,
                scale: 1.05,
                boxShadow: "0px 0px 20px rgba(255,255,255,0.5)", 
                transition: { duration: 0.3 } 
              },
              notSelected: { 
                x: 0,
                opacity: 0.7,
                scale: 0.9, 
                filter: "grayscale(100%)",
                transition: { duration: 0.3 } 
              }
            }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden group">
              <Image 
                src={currentPair[1].imgSrc} 
                alt={`Contestant ${currentPair[1].id}`} 
                fill
                className="object-contain rounded-lg shadow-lg group-hover:scale-105 transition-all duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button className="w-full bg-white text-purple-700 py-3 rounded-lg font-bold text-lg">
                  Choose
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
} 