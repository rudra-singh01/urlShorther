import { createRootRoute } from "@tanstack/react-router";
import RootLayout from "../App";
import { HomePageRoute } from "./homePage";
import { authRoute } from "./auth.route";
import { dashBoardRoute } from "./dashboard";



export const rootRoute = createRootRoute({
    component: RootLayout
})

export const routeTree =  rootRoute.addChildren([
    HomePageRoute,
    authRoute,
    dashBoardRoute,
])
