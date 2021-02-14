export const currentPath = process.env.CURRENT_URL
export const basePath = process.env.KRATOS_URL
export const endpoints = {
  login: `${basePath}/self-service/login/browser?refresh=true&return_to=${currentPath}/signin`,
  register: `${basePath}/self-service/registration/browser?return_to=${currentPath}/signup`,
  recover: `${basePath}/self-service/recovery/browser?return_to=${currentPath}/recover-account`,
  profile: `${basePath}/self-service/settings/browser?return_to=${currentPath}/settings/account`,
  logout: `${basePath}/self-service/browser/flows/logout`,
}