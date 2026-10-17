import React, { useEffect, useState, createContext, useContext } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Moon, Sun } from "lucide-react"

// --- Theme Context ---
type Theme = "light" | "dark"
const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
} | null>(null)

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.toggle("dark", saved === "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}

// --- Theme Toggle Button ---
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

// --- Avatar with Hover Tooltip ---
interface AvatarProps {
  src: string
  name: string
}

const Avatar = ({ src, name }: AvatarProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white dark:text-black bg-black/80 dark:bg-white/10 dark:text-white border dark:border-white/10  border-white/10 rounded shadow-md pointer-events-none"
      >
        {name}
      </motion.div>

      {/* Avatar Image */}
      <img
        src={src}
        alt={name}
        className="w-8 h-8 rounded-full border-2 border-white dark:border-black"
      />
    </div>
  )
}

// --- Hero Section Component ---
export const HeroSection = () => {
  return (
    <ThemeProvider>
      <section className="bg-white dark:bg-black text-black dark:text-white min-h-screen w-full flex flex-col justify-center items-center px-4 relative">
        {/* Theme toggle button */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.6,
              },
            }}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{ scale: 0.98 }}
            className="mb-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="flex items-center px-4 py-1.5 rounded-full bg-black/10 dark:bg-white/10 text-sm font-medium border border-black/10 dark:border-white/20 backdrop-blur-md"
            >
              ✨ Introducing Sparkles
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.div>
          </motion.div>


        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl sm:text-6xl font-bold text-center leading-tight tracking-tight"
        >
          Build sites <br />
          <span className="text-[#f7cbb7] dark:text-[#f7cbb7]">that sell well.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-600 dark:text-gray-400 mt-6 max-w-xl text-center text-lg"
        >
          Future UI is a collection of interactive Tailwind CSS components built
          for <strong>React</strong> and <strong>Vue.js</strong>.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8"
        >
          <button className="bg-black dark:bg-white text-white dark:text-black text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition hover:cursor-pointer
          ">
            Get lifetime access — $59
          </button>
          <button className="text-black dark:text-white text-sm font-medium px-6 py-3 rounded-full border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition hover:cursor-pointer">
            Explore components
          </button>
        </motion.div>

        {/* Trusted by */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-600 dark:text-white/80"
        >
          <div className="flex items-center -space-x-2">
            <Avatar src="https://cdn.21st.dev/assets/mirror/6b/6b478bb8bf188f22e81ac9ef2a24a10830f9cebcbd48b9cb3f4ef4f40b479b95.png" name="Michael" />
            <Avatar src="https://cdn.21st.dev/assets/mirror/d8/d8c86e8ce3d913754a1fbda39e3bd3e6bdff8ff4665e687d2e3c0b0cfd646397.jpg" name="Tamara" />
            <Avatar src="https://cdn.21st.dev/assets/mirror/78/785466ab50cc61fd1d3a81e96f6b1471a96a00e3392c6d687a86b0b1d87aade7.jpg" name="Diego" />
            <Avatar src="https://cdn.21st.dev/assets/mirror/6b/6b478bb8bf188f22e81ac9ef2a24a10830f9cebcbd48b9cb3f4ef4f40b479b95.png" name="Mark" />
            <Avatar src="https://cdn.21st.dev/assets/mirror/d8/d8c86e8ce3d913754a1fbda39e3bd3e6bdff8ff4665e687d2e3c0b0cfd646397.jpg" name="Tamang" />
          </div>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>⭐️⭐️⭐️⭐️⭐️</span>
            <span>Trusted by 400+ users</span>
          </div>
        </motion.div>
      </section>
    </ThemeProvider>
  )
}
