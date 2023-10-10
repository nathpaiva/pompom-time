import { isValidElement } from 'react'
import type { RouteObject } from 'react-router-dom'

import { RouteEnum, routeDataSource } from './router'

const validateRoute = (_route: RouteObject) => {
  _route.children?.forEach((child) => {
    if (isValidElement(child.element)) {
      expect(typeof child.element.type).toEqual('function')
    }

    // check if the route exist in the RouteEnum config
    expect(RouteEnum[child.path as keyof typeof RouteEnum]).toBeTruthy()

    // check if the rout has internals
    if (child.children?.length) {
      validateRoute(child)
    }
  })
}

describe('router', () => {
  it('should create all route from data sources', () => {
    expect(routeDataSource.path).toEqual('/')
    expect(typeof routeDataSource.element.type).toEqual('function')

    validateRoute(routeDataSource)
  })
})
