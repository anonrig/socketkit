export const currentPath = process.env.NEXT_PUBLIC_CURRENT_URL
export const basePath = process.env.NEXT_PUBLIC_KRATOS_URL
export const endpoints = {
  login: `${basePath}/self-service/login/browser`,
  register: `${basePath}/self-service/registration/browser`,
  recover: `${basePath}/self-service/recovery/browser`,
  profile: `${basePath}/self-service/settings/browser`,
  logout: `${basePath}/self-service/browser/flows/logout`,
  verification: `${basePath}/self-service/verification/browser`,
}
