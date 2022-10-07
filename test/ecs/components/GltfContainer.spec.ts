﻿import { Engine } from '../../../packages/@dcl/ecs/src/engine'

describe('Generated GltfContainer ProtoBuf', () => {
  it('should serialize/deserialize GltfContainer', () => {
    const newEngine = Engine()
    const { GltfContainer } = newEngine.baseComponents
    const entity = newEngine.addEntity()
    const entityB = newEngine.addEntity()

    const _shape = GltfContainer.create(entity, {
      src: 'test/src'
    })

    GltfContainer.create(entityB, {
      src: 'test/sr23sc c'
    })
    const buffer = GltfContainer.toBinary(entity)
    GltfContainer.updateFromBinary(entityB, buffer)

    expect(_shape).toBeDeepCloseTo({ ...GltfContainer.getMutable(entityB) })

    expect(GltfContainer.createOrReplace(entityB)).not.toBeDeepCloseTo({
      ...GltfContainer.getMutable(entity)
    })
  })
})