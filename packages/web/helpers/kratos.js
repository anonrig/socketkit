export const currentPath = process.env.NEXT_PUBLIC_CURRENT_URL
export const basePath = process.env.NEXT_PUBLIC_KRATOS_URL
export const endpoints = {
  login: `${basePath}/self-service/login/browser?return_to=/`,
  register: `${basePath}/self-service/registration/browser?return_to=/`,
  recover: `${basePath}/self-service/recovery/browser?return_to=/`,
  profile: `${basePath}/self-service/settings/browser?return_to=/settings`,
  logout: `${basePath}/self-service/browser/flows/logout?return_to=/`,
}
