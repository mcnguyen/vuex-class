import * as Vue from 'vue'
import { createDecorator } from 'vue-class-component'
import {
  mapState
} from 'vuex'

export type StateTransformer = (state: any, getters: any) => any

export interface BindingOptions {
  namespace?: string
}

export interface BindingHelper {
  (type: string, options?: BindingOptions): PropertyDecorator
}

export interface StateBindingHelper extends BindingHelper {
  (type: StateTransformer, options?: BindingOptions): PropertyDecorator
}

export const State: StateBindingHelper = (
  value: any,
  options?: BindingOptions
): PropertyDecorator => {
  const namespace = options && options.namespace

  return createDecorator((componentOptions, key) => {
    if (!componentOptions.computed) {
      componentOptions.computed = {}
    }

    const mapObject = { [key]: value }

    componentOptions.computed[key] = namespace !== undefined
      ? mapState(namespace, mapObject)[key]
      : mapState(mapObject)[key]
  })
}

export function namespace <T extends BindingHelper> (
  namespace: string,
  helper: T
): (type: string) => PropertyDecorator {
  return (typeOrFn: any) => {
    return helper(typeOrFn, { namespace })
  }
}