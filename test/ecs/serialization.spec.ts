import { Engine } from '../../packages/@dcl/ecs/src/engine'
import { Schemas } from '../../packages/@dcl/ecs/src/schemas'
import { ISchema } from '../../packages/@dcl/ecs/src/schemas/ISchema'

const Vector3 = Schemas.Map({
  x: Schemas.Float,
  y: Schemas.Float,
  z: Schemas.Float
})

describe('Serialization Types', () => {
  it('should serialize Ints', () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const entityCopied = engine.addEntity()
    const toTest = [Schemas.Short, Schemas.Int, Schemas.Byte]
    let COMPONENT_ID = 888

    for (const t of toTest) {
      const IntegerComponent = engine.defineComponent(
        { value: t },
        COMPONENT_ID++
      )
      const myInteger = IntegerComponent.create(entity, { value: 33 })
      expect(myInteger.value).toBe(33)

      const buffer = IntegerComponent.toBinary(entity)
      const copiedInteger = IntegerComponent.create(entityCopied, { value: 21 })
      expect(copiedInteger.value).toBe(21)
      const updatedInteger = IntegerComponent.updateFromBinary(
        entityCopied,
        buffer
      )
      expect(updatedInteger!.value).toBe(33)

      expect(t.create()).toEqual(0)
    }
  })

  it('should serialize Floats', () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const entityCopied = engine.addEntity()
    const toTest = [Schemas.Float, Schemas.Double]
    let COMPONENT_ID = 888
    const testValue = 2.0

    for (const t of toTest) {
      const FloatComponent = engine.defineComponent(
        { value: t },
        COMPONENT_ID++
      )
      const myFloat = FloatComponent.create(entity, { value: testValue })
      expect(myFloat.value).toBe(testValue)

      const buffer = FloatComponent.toBinary(entity)
      const copiedFloat = FloatComponent.create(entityCopied, { value: 21.22 })
      expect(copiedFloat.value).toBe(21.22)
      const updatedFloat = FloatComponent.updateFromBinary(entityCopied, buffer)
      expect(updatedFloat!.value).toBe(testValue)
    }

    expect(Vector3.create()).toEqual({ x: 0, y: 0, z: 0 })
    expect(Schemas.Double.create()).toEqual(0.0)
  })

  it('should serialize Strings', () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const entityCopied = engine.addEntity()

    let COMPONENT_ID = 888
    const testValue = 'testing an string'

    const FloatComponent = engine.defineComponent(
      { value: Schemas.String },
      COMPONENT_ID++
    )
    const myFloat = FloatComponent.create(entity, { value: testValue })
    expect(myFloat.value).toBe(testValue)

    const buffer = FloatComponent.toBinary(entity)
    const copiedFloat = FloatComponent.create(entityCopied, { value: 'n' })
    expect(copiedFloat.value).toBe('n')
    const updatedFloat = FloatComponent.updateFromBinary(entityCopied, buffer)
    expect(updatedFloat!.value).toBe(testValue)
  })

  it('should serialize Schemas.Maps', () => {
    const engine = Engine()
    const myEntity = engine.addEntity()
    const COMPONENT_ID = 888

    const ItemType = Schemas.Map({
      itemId: Schemas.Int,
      name: Schemas.String,
      enchantingIds: Schemas.Array(
        Schemas.Map({
          itemId: Schemas.Int,
          itemAmount: Schemas.Int,
          description: Schemas.String
        })
      )
    })

    const defaultValue = ItemType.create()

    expect(defaultValue).toEqual({ itemId: 0, name: '', enchantingIds: [] })

    const PlayerComponent = engine.defineComponent(
      {
        name: Schemas.String,
        description: Schemas.String,
        level: Schemas.Int,
        hp: Schemas.Float,
        position: Vector3,
        targets: Schemas.Array(Vector3),
        items: Schemas.Array(ItemType)
      },
      COMPONENT_ID
    )

    const defaultPlayer = {
      name: '',
      description: '',
      level: 1,
      hp: 0.0,
      position: { x: 1.0, y: 50.0, z: 50.0 },
      targets: [],
      items: []
    }

    const myPlayer = PlayerComponent.create(myEntity, defaultPlayer)

    expect(PlayerComponent.get(myEntity)).toStrictEqual(defaultPlayer)

    myPlayer.hp = 8349.2
    myPlayer.position.x += 1.0
    myPlayer.targets.push({
      x: 1232.3232,
      y: Math.random() * 33,
      z: 8754.32723
    })
    myPlayer.items.push({
      itemId: 1,
      name: 'Manzana roja',
      enchantingIds: []
    })
    myPlayer.items[0]?.enchantingIds.push({
      itemId: 2,
      itemAmount: 10,
      description: 'this is a description to an enchanting item.'
    })

    const buffer = PlayerComponent.toBinary(myEntity)

    const otherEntity = engine.addEntity()

    PlayerComponent.create(otherEntity, defaultPlayer)
    PlayerComponent.updateFromBinary(otherEntity, buffer)

    const originalPlayer = PlayerComponent.get(myEntity)
    const modifiedFromBinaryPlayer = PlayerComponent.get(otherEntity)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(modifiedFromBinaryPlayer).toBeDeepCloseTo(originalPlayer)
  })

  it('should serialize Schemas.Optional & Boolean without value (undefined)', () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const COMPONENT_ID = 888

    const definition = Schemas.Map({
      optionalColor: Schemas.Optional(
        Schemas.Map({
          r: Schemas.Float,
          g: Schemas.Float,
          b: Schemas.Float
        })
      ),
      hasAlpha: Schemas.Boolean
    })

    const TestComponent = engine.defineComponentFromSchema(
      definition,
      COMPONENT_ID
    )

    expect(definition.create()).toEqual({
      optionalColor: undefined,
      hasAlpha: false
    })

    TestComponent.create(entity, {
      hasAlpha: true
    })

    const entity2 = engine.addEntity()
    TestComponent.create(entity2, {
      hasAlpha: false,
      optionalColor: { r: 1, g: 2, b: 3 }
    })

    const value2 = TestComponent.updateFromBinary(
      entity2,
      TestComponent.toBinary(entity)
    )!

    expect(value2.hasAlpha).toBe(true)
    expect(value2.optionalColor).toBeUndefined()
  })

  it('should serialize Schemas.Optional & Boolean with value', () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const COMPONENT_ID = 888

    const TestComponent = engine.defineComponent(
      {
        optionalColor: Schemas.Optional(Schemas.Boolean),
        visible: Schemas.Optional(Schemas.Boolean),
        notVisible: Schemas.Boolean
      },
      COMPONENT_ID
    )

    TestComponent.create(entity, { optionalColor: true, notVisible: false })

    expect(TestComponent.toBinary(entity).toBinary()).toStrictEqual(
      new Uint8Array([1, 1, 0, 0])
    )
    expect(TestComponent.get(entity).optionalColor).toBe(true)

    // Deserialize and update new optional
    const newEntity = engine.addEntity()
    TestComponent.create(newEntity, {
      optionalColor: true,
      visible: true,
      notVisible: false
    })
    TestComponent.upsertFromBinary(entity, TestComponent.toBinary(newEntity))

    expect(TestComponent.toBinary(entity).toBinary()).toStrictEqual(
      new Uint8Array([1, 1, 1, 1, 0])
    )
  })

  it('should serialize Int Schemas.Enums', () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const COMPONENT_ID = 888

    enum ColorToNumber {
      Default = 0,
      Red = 2,
      Green = 0x33,
      Pink = 0xff290323
    }

    const TestComponent = engine.defineComponent(
      { testEnum: Schemas.Enum<ColorToNumber>(Schemas.Int64) },
      COMPONENT_ID
    )

    expect(TestComponent.create(entity)).toStrictEqual({ testEnum: 0 })
    TestComponent.createOrReplace(entity, { testEnum: ColorToNumber.Pink })

    const entity2 = engine.addEntity()
    const initialValue = TestComponent.create(entity2, {
      testEnum: ColorToNumber.Green
    })
    expect(initialValue).toStrictEqual({ testEnum: ColorToNumber.Green })

    const value2 = TestComponent.updateFromBinary(
      entity2,
      TestComponent.toBinary(entity)
    )!

    expect(value2).toStrictEqual({ testEnum: ColorToNumber.Pink })
  })

  it('should serialize String Schemas.Enum', () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const COMPONENT_ID = 888

    enum ColorToString {
      Red = '2',
      Green = '0x33',
      Pink = '0xff290323'
    }

    const TestComponent = engine.defineComponent(
      { testEnum: Schemas.Enum<ColorToString>(Schemas.String) },
      COMPONENT_ID
    )

    // const value1 = TestComponent.create(entity, {})
    expect(TestComponent.create(entity)).toStrictEqual({ testEnum: '' })
    TestComponent.createOrReplace(entity, { testEnum: ColorToString.Pink })

    const entity2 = engine.addEntity()
    const initialValue = TestComponent.create(entity2, {
      testEnum: ColorToString.Green
    })
    expect(initialValue).toStrictEqual({ testEnum: ColorToString.Green })

    const value2 = TestComponent.updateFromBinary(
      entity2,
      TestComponent.toBinary(entity)
    )!

    expect(value2).toStrictEqual({ testEnum: ColorToString.Pink })
  })

  it('should deserialize and serialize component from binary', () => {
    const engine = Engine()
    const entityFilled = engine.addEntity() // 0
    const entityEmpty = engine.addEntity() // 1
    const COMPONENT_ID = 888

    const TestComponentType = engine.defineComponent(
      {
        a: Schemas.Int,
        b: Schemas.Int,
        c: Schemas.Array(Schemas.Int),
        d: Schemas.Int64
      },

      COMPONENT_ID
    )
    const myComponent = TestComponentType.create(entityFilled, {
      a: 2331,
      b: 10,
      c: [2, 3, 4, 5],
      d: -1
    })

    TestComponentType.create(entityEmpty, {
      a: 0,
      b: 0,
      c: [],
      d: 10
    })

    const buffer = TestComponentType.toBinary(entityFilled)
    TestComponentType.updateFromBinary(entityEmpty, buffer)

    const modifiedComponent = TestComponentType.get(entityEmpty)
    expect(modifiedComponent.a).toBe(myComponent.a)
    expect(modifiedComponent.b).toBe(myComponent.b)
    expect(modifiedComponent.c).toEqual(myComponent.c)
    expect(modifiedComponent.d).toEqual(myComponent.d)
  })

  it('should copy component from binary', () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const entityCopied = engine.addEntity()

    let i = 0
    const A = 'abcdefghijkl'
    const vectorType: Record<string, ISchema<number>> = {}
    const objectValues: Record<string, number> = {}
    const zeroObjectValues: Record<string, number> = {}

    for (i = 0; i < A.length; i++) {
      const COMPONENT_ID = 888 + i + 1
      const key = A[i]
      vectorType[key] = Schemas.Int
      objectValues[key] = 50 + i
      zeroObjectValues[key] = 0
      const TestComponentType = engine.defineComponent(vectorType, COMPONENT_ID)

      TestComponentType.create(entity, objectValues)
      TestComponentType.create(entityCopied, zeroObjectValues)
      const buffer = TestComponentType.toBinary(entity)
      TestComponentType.updateFromBinary(entityCopied, buffer)
      expect(TestComponentType.get(entity)).toStrictEqual(
        TestComponentType.get(entityCopied)
      )
    }
  })

  it('should prefill with default value', () => {
    const engine = Engine()
    const entityWithDefault = engine.addEntity() // 0
    const entityEmpty = engine.addEntity() // 1
    const COMPONENT_ID = 888

    const TestComponentType = engine.defineComponent(
      {
        a: Schemas.Int,
        b: Schemas.Int,
        c: Schemas.Array(Schemas.Int),
        d: Schemas.Int64
      },
      COMPONENT_ID,
      {
        a: 123,
        b: 123,
        c: [11, 22, 33],
        d: 12
      }
    )

    TestComponentType.create(entityEmpty, {
      a: 0,
      b: 0
    })

    TestComponentType.create(entityWithDefault)

    expect(TestComponentType.get(entityEmpty)).toStrictEqual({
      a: 0,
      b: 0,
      c: [11, 22, 33],
      d: 12
    })

    expect(TestComponentType.get(entityWithDefault)).toStrictEqual({
      a: 123,
      b: 123,
      c: [11, 22, 33],
      d: 12
    })
  })

  it('should serialize and deserialize math schemas', () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const MixComponent = engine.defineComponent(
      {
        v3: Schemas.Vector3,
        q: Schemas.Quaternion,
        c3: Schemas.Color3,
        c4: Schemas.Color4
      },
      1222
    )

    const originalValue = MixComponent.create(entity, {
      c3: { r: 0.1, g: 0.2, b: 0.3 },
      c4: { r: 0.4, g: 0.5, b: 0.6, a: 0.7 },
      q: { x: 0.8, y: 0.9, z: 1.0, w: 1.1 },
      v3: { x: 1.2, y: 1.3, z: 1.4 }
    })

    const entityB = engine.addEntity()
    const buf = MixComponent.toBinary(entity)
    const value = MixComponent.upsertFromBinary(entityB, buf)

    expect(value).toBeDeepCloseTo(originalValue)
  })
})