/* export { default as login } from './acl/login' // {default: {}}
export { default as user } from './acl/user'
export { default as role } from './acl/role'
export { default as permission } from './acl/permission'
export { default as category } from './category'
export { default as clientUser } from './clientUser'
//将默认暴露的内容重命名为order,并且将order分别暴露出去
export { default as order } from './order'
export { default as trademark } from './product/trademark'
export { default as attrs } from './product/attrs'
export { default as spu } from './product/spu'
export { default as sku } from './product/sku' */

/* require.context自动加载模块 */
const context = require.context(".", true, /\.js$/)
const api = context.keys().map(modulePath => {
  //获取路径名
  const names = modulePath.split("/")
  let moduleName = names[2] && names[2].slice(0, -3)
  //如果是index的文件名,则获取它的文件夹名,若不是则就是文件名
  if (moduleName) {
    moduleName = moduleName === "index" ? names[1] : moduleName
  }
  return {
    modulePath, moduleName
  }
}).filter(module => module.moduleName).reduce((modules, module) => {
  //加载默认路径
  modules[module.moduleName] = context(module.modulePath).default
  return modules
}, {})
export default api
