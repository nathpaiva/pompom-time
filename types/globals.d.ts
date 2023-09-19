declare global {
  type Stringified<T> = string & {
    [P in keyof T]: T[P]
  }
  interface JSON {
    stringify<T>(
      value: T,
      replacer?: (key: string, value: any) => any,
      space?: string | number,
    ): string & Stringified<T>
    parse<T>(text: Stringified<T>, reviver?: (key: any, value: any) => any): T
  }
  interface ObjectConstructor {
    keys<T>(value: T): (keyof T)[]
  }
}

export {}
