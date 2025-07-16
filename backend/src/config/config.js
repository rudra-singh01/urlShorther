export const cookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 6 * 60 * 60 * 1000,
    sameSite: "lax",
}