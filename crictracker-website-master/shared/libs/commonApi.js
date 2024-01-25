import queryGraphql from '../components/queryGraphql'

export async function footerMenuApi() {
  const footer = (await import('../../graphql/common/common.query')).FOOTER_MENU
  const footerMenu = await queryGraphql(footer)
  return footerMenu?.data?.getFrontFooter || []
}
export async function headerMenuApi() {
  const header = (await import('../../graphql/home/home.query')).HEADER_MENU
  const headerMenu = await queryGraphql(header)
  return headerMenu?.data?.getMenuTree?.aResults || []
}
export async function headerSidebarMenuApi() {
  const header = (await import('../../graphql/home/home.query')).GET_SLIDER
  const headerMenu = await queryGraphql(header)
  return headerMenu?.data?.getFrontSlider || []
}
