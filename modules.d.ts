declare module '*.css' {
  const value: any
  export = value
}

declare module '*.svg' {
  const content: any
  export default content
}

declare module 'dotenv-flow/config' {}
