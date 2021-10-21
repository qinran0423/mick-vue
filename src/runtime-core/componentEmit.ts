import { camelize, toHandlerKey } from "../shared/index";


export function emit(instance, event, ...args) {
  console.log(event);

  const { props } = instance



  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName];
  handler && handler(...args)


}