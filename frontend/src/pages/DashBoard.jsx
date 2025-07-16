
import { useEffect } from "react"
import { motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { getCurrentUser, getAllUserUrls } from "../api/user.api"
import { login } from "../store/slices/authSlice"
import Url_Form from "../components/Url_Form"
import User_urls from "../components/User_urls"

const DashBoard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/auth" })
    }
  }, [isAuthenticated, navigate])

  // Fetch current user data to ensure we have the latest user information
  const { data: currentUserData, isLoading: isUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: isAuthenticated, // Only fetch if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  // Fetch user URLs to calculate stats
  const { data: urlsData, isLoading: isUrlsLoading } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    enabled: isAuthenticated, // Only fetch if user is authenticated
    refetchInterval: isAuthenticated ? 30000 : false, // Only refetch if authenticated
    staleTime: 0, // Consider data stale immediately so it refetches when invalidated
  })

  // Update Redux store with fresh user data
  useEffect(() => {
    if (currentUserData?.user && isAuthenticated) {
      dispatch(login(currentUserData.user))
    }
  }, [currentUserData, isAuthenticated, dispatch])

  // Get the most current user data (from API or Redux)
  const currentUser = currentUserData?.user || user

  // Calculate stats from URLs data
  const totalLinks = urlsData?.urls?.length || 0
  const totalClicks = urlsData?.urls?.reduce((sum, url) => sum + (url.clicks || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%236366f1' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {isUserLoading ? (
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-md"></div>
                <div className="h-6 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-lg"></div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}! 👋
                </h1>
                <p className="text-xl text-gray-600">Manage your shortened URLs and track their performance</p>
                {currentUser?.email && <p className="text-lg text-gray-500 mt-2">{currentUser.email}</p>}
              </>
            )}
          </motion.div>

          {/* User Profile & Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            {/* User Profile Card */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  {isUserLoading ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 relative">
                        {currentUser?.avatar ? (
                          <img
                            src={currentUser.avatar || "/placeholder.svg"}
                            alt={currentUser.name || "User"}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-md"
                            onError={(e) => {
                              e.target.style.display = "none"
                              e.target.nextSibling.style.display = "flex"
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-gray-200 shadow-md ${currentUser?.avatar ? "hidden" : ""}`}
                        >
                          <span className="text-white text-xl font-bold">
                            {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-gray-900 font-semibold text-lg mb-1">{currentUser?.name || "User"}</h3>
                      <p className="text-gray-500 text-sm mb-3">{currentUser?.email || "user@example.com"}</p>
                      <div className="text-xs text-gray-400">
                        Member since{" "}
                        {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : "Recently"}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Total Links Card */}
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">🔗</div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                    <div className="w-6 h-6 bg-white/20 rounded-lg"></div>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Total Links</h3>
                {isUrlsLoading ? (
                  <div className="h-9 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{totalLinks.toLocaleString()}</p>
                )}
              </motion.div>

              {/* Total Clicks Card */}
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">📊</div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-md">
                    <div className="w-6 h-6 bg-white/20 rounded-lg"></div>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Total Clicks</h3>
                {isUrlsLoading ? (
                  <div className="h-9 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* URL Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200 h-fit">
                <Url_Form />
              </div>
            </motion.div>

            {/* URLs List Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Links</h2>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span className="text-sm">Auto-refresh</span>
                  </div>
                </div>
                <User_urls />
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 inline-block shadow-lg border border-gray-200">
              <h3 className="text-gray-900 font-semibold mb-4">Need help getting started?</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 border border-blue-200">
                  📚 View Guide
                </button>
                <button className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-all duration-200 border border-green-200">
                  💬 Get Support
                </button>
                <button className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-all duration-200 border border-purple-200">
                  🚀 Upgrade Plan
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard
