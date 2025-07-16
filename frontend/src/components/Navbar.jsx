
import { useState, useEffect } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { logout as logoutApi, getCurrentUser } from "../api/user.api"
import { logout as logoutAction, login } from "../store/slices/authSlice"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  // Get authentication state from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  // Fetch current user data only when we need to check authentication status
  const { isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: false, // Disable automatic fetching - we'll control this manually
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Check authentication status only on initial mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Only check if we don't have authentication state in Redux and there's a token
      const token = localStorage.getItem('token')
      if (!isAuthenticated && !user && token) {
        try {
          const userData = await queryClient.fetchQuery({
            queryKey: ["currentUser"],
            queryFn: getCurrentUser,
            retry: false,
          })
          if (userData?.user) {
            dispatch(login(userData.user))
          }
        } catch {
          // User is not authenticated, remove invalid token
          localStorage.removeItem('token')
          console.log("User not authenticated")
        }
      }
    }

    checkAuthStatus()
  }, [isAuthenticated, user, queryClient, dispatch]) // Include dependencies but only run when needed

  // Handle authentication errors
  useEffect(() => {
    if (isError && isAuthenticated) {
      // If getCurrentUser fails and we think we're authenticated, clear Redux state
      dispatch(logoutAction())
      localStorage.removeItem("token")
    }
  }, [isError, isAuthenticated, dispatch])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      // Close mobile menu immediately
      setIsMobileMenuOpen(false)

      // Clear Redux state immediately for instant UI update
      dispatch(logoutAction())

      // Clear all authentication-related data
      localStorage.removeItem("token")

      // Clear all React Query cache
      queryClient.clear()

      // Call logout API (don't await to make logout instant)
      logoutApi().catch(console.error)

      // Navigate to home page immediately
      navigate({ to: "/" })
    } catch (error) {
      console.error("Logout failed:", error)
      // Even if API call fails, ensure local state is cleared
      setIsMobileMenuOpen(false)
      dispatch(logoutAction())
      localStorage.removeItem("token")
      queryClient.clear()
      navigate({ to: "/" })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100/50"
          : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                ShortLink
              </span>
            </Link>
          </motion.div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user && (
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg border">
                    {user.avatar ? (
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name || "User"}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.target.style.display = "none"
                          e.target.nextSibling.style.display = "flex"
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center ${user.avatar ? "hidden" : ""}`}
                    >
                      <span className="text-white text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name || "User"}</span>
                  </div>
                )}
                <motion.button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <motion.button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/auth">
                  <motion.button
                    className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => localStorage.setItem("authTab", "register")}
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white/95 backdrop-blur-xl shadow-xl border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              {isAuthenticated ? (
                <>
                  {user && (
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg mb-4 border">
                      {user.avatar ? (
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name || "User"}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            e.target.style.display = "none"
                            e.target.nextSibling.style.display = "flex"
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center ${user.avatar ? "hidden" : ""}`}
                      >
                        <span className="text-white font-medium">{user.name?.charAt(0).toUpperCase() || "U"}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name || "User"}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    className="block px-4 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center"
                    onClick={() => {
                      localStorage.setItem("authTab", "register")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
