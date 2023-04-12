import { engine, Composite } from '@dcl/ecs'
import { createContentFetchCompositeProvider } from './composite-provider'
import { onStart as basicOnStart, onUpdate as basicOnUpdate } from './index'

export const onUpdate = basicOnUpdate

/**
 * @internal
 * Function that is called before the first update and after the evaluation of the code.
 */
/* @__PURE__ */ export async function onStart() {
  const compositeProvider = await createContentFetchCompositeProvider()
  const mainComposite = compositeProvider.getCompositeOrNull('main.composite.json')
  if (mainComposite) {
    Composite.instance(engine, mainComposite, compositeProvider)
  }

  await basicOnStart()
}