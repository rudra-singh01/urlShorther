import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./routeTree"
import AuthPage from "../pages/AuthPage"
import Home from "../pages/Home"


export const HomePageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
    // beforeLoad: async () => {
    //     // Check if the user is authenticated
    //     const authed = await isAuthenticated()
    //     if (authed) {
    //       // Redirect the user to the home page
    //       return '/'
    //     }
    //   },
  })
  
//   const aboutRoute = createRoute({
//     getParentRoute: () => rootRoute,
//     path: '/about',
//     component: function About() {
//       return <div className="p-2">Hello from About!</div>
//     },
//   })