import { RouteEnum, router } from './router'

// TODO: find a way to type route
const validateRoute = (_route: any) => {
  _route.children?.forEach((child: any) => {
    // check if the route exist in the RouteEnum config
    expect(RouteEnum[child.path as keyof typeof RouteEnum]).toBeTruthy()

    // check if the rout has internals
    if (child.children?.length) {
      validateRoute(child)
    }
  })
}

describe('router', () => {
  it('should create all routes', () => {
    router.routes.forEach((route) => {
      validateRoute(route)
    })
  })
})
