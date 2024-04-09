type Dict = Record<string, any>
type PredicateFn<T> = (key: T) => boolean

export interface SplitPropsFn {
  <T extends Dict, K extends keyof T>(
    props: T,
    keys: K[],
  ): [Pick<T, K>, Omit<T, K>]

  <T extends Dict, K extends PredicateFn<keyof T>>(
    props: T,
    keys: K,
  ): [Dict, Dict]
}

export const splitProps: SplitPropsFn = (props: any, keys: any) => {
  const picked = {} as any
  const omitted = { ...props }

  if (typeof keys === 'function') {
    for (const key in props) {
      if (keys(key)) {
        picked[key] = props[key]
        delete omitted[key]
      }
    }
  } else {
    for (const key of keys) {
      picked[key] = props[key]
      delete omitted[key]
    }
  }

  return [picked, omitted] as any
}