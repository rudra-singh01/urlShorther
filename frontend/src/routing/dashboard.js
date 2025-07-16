import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./routeTree"
import DashBoard from "../pages/DashBoard"
import { checkAuth } from "../utils/helper.js"

export const dashBoardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: DashBoard,
    beforeLoad: checkAuth,
})