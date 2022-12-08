import { Engine, IEngine, Transport } from '../../packages/@dcl/ecs/src'
import { createByteBuffer } from '../../packages/@dcl/ecs/src/serialization/ByteBuffer'
import { ComponentOperation } from '../../packages/@dcl/ecs/src/serialization/crdt/componentOperation'
import { WireMessage } from '../../packages/@dcl/ecs/src/serialization/wireMessage'
import { int8Component } from './int8component'

function connectEngines(a: IEngine, b: IEngine) {
  const interceptedMessages: any[] = []

  function intercept(data: Uint8Array, direction: string) {
    const buffer = createByteBuffer({
      reading: { buffer: data, currentOffset: 0 }
    })

    while (WireMessage.validate(buffer)) {
      buffer.currentReadOffset()
      const message = ComponentOperation.read(buffer)!

      const { type, entity, componentId, data, timestamp } = message
      interceptedMessages.push({
        type,
        entity,
        componentId,
        data,
        timestamp,
        direction
      })
    }
  }

  const transportA: Transport = {
    async send(data) {
      intercept(data, 'a->b')
      transportB.onmessage!(data)
    },
    filter() {
      return true
    },
    onmessage: () => {
      throw new Error('transportA onmessage not implemented')
    }
  }
  const transportB: Transport = {
    async send(data) {
      intercept(data, 'b->a')
      transportA.onmessage!(data)
    },
    filter() {
      return true
    },
    onmessage: () => {
      throw new Error('transportB onmessage not implemented')
    }
  }

  a.addTransport(transportA)
  b.addTransport(transportB)

  return { interceptedMessages }
}

describe('test CRDT flow E2E', () => {
  const engineA = Engine()
  const engineB = Engine()
  const env = connectEngines(engineA, engineB)

  it('in empty engines there should be no messages', async () => {
    // in empty engines there should be no messages
    await engineA.update(0)
    await engineB.update(0)
    expect(env.interceptedMessages).toEqual([])
  })

  // then create an entity in engineA
  const entityA = engineA.addEntity()

  it('adding an entity should emit no message', async () => {
    await engineA.update(0)
    await engineB.update(0)
    expect(env.interceptedMessages).toEqual([])
  })

  // create the components for both engines
  const int8A = int8Component(engineA)
  const int8B = int8Component(engineB)

  it('should fail if you want to register the same component twice', () => {
    expect(() => int8Component(engineA)).toThrow()
  })

  it('and add the component value "3" to the entityA', async () => {
    // and add the component value "3" to the entityA
    int8A.create(entityA, 3)

    // naturally, both engines will have divergent states
    expect(int8A.has(entityA)).toBe(true)
    expect(int8B.has(entityA)).toBe(false)

    // and the dirtyIterator of the component should of course contain the dirty entity
    expect(Array.from(int8A.dirtyIterator())).toEqual([entityA])
  })

  it('then we run a tick in the dirty engine, and the component should be no longer dirty', async () => {
    await engineA.update(0)
    expect(Array.from(int8A.dirtyIterator())).toEqual([])

    // and the engineA should have sent ONLY ONE message to update this entity and component
    expect(env.interceptedMessages).toMatchObject([
      {
        direction: 'a->b',
        componentId: 123987,
        entity: entityA,
        data: Uint8Array.of(3),
        timestamp: 1
      }
    ])
    env.interceptedMessages.length = 0

    // if we update the engine again, then NO MESSAGE should be sent. because the
    // component is not dirty
    await engineA.update(0)
    expect(env.interceptedMessages).toEqual([])
  })

  it('then we will run the update on the engineB, to process the "queued" update', async () => {
    await engineB.update(0)

    // to verify that the queue got processed, we check the component
    expect(int8B.get(entityA)).toBe(3)

    // and the dirty iterator should be false
    expect(Array.from(int8B.dirtyIterator())).toEqual([])

    // and since there was no updates on this end. no messages should be sent
    // through the wire
    expect(env.interceptedMessages).toEqual([])
  })

  it(`now, if we update the component from engineB's end it should fly back to engineA`, async () => {
    int8B.createOrReplace(entityA, 4)
    expect(Array.from(int8B.dirtyIterator())).toEqual([entityA])
    await engineB.update(0)

    // to reach consistent states, the message flying to the engineA should have
    // an incremented timestamp and the new value
    expect(env.interceptedMessages).toMatchObject([
      {
        direction: 'b->a',
        componentId: 123987,
        entity: entityA,
        data: Uint8Array.of(4),
        timestamp: 2
      }
    ])
    env.interceptedMessages.length = 0
  })

  it('then we do the processing on engineA to apply the changes', async () => {
    await engineA.update(0)

    // and assert
    expect(int8A.get(entityA)).toBe(4)
  })

  describe('conflict resolution case 1', () => {
    it('test conflicting timestamps resolution', async () => {
      // now we are going to make things a little bit spicy, we will send a message
      // with conflicts between the two engines. at this moment both converged towards
      // the same state. the value will be changed to 16 in the engineA and 32 on
      // the engineB, increasing the timestamp of both internal states
      int8A.createOrReplace(entityA, 16)
      int8B.createOrReplace(entityA, 32)

      // to generate a "conflict", we will send the updates from A to B first
      await engineA.update(0)
      expect(env.interceptedMessages).toMatchObject([
        // this value will have the same timestamp in both engines
        {
          direction: 'a->b',
          componentId: 123987,
          entity: entityA,
          data: Uint8Array.of(16),
          timestamp: 3
        }
      ])
      env.interceptedMessages.length = 0
    })

    it('now we are receiving the updates from engineA', async () => {
      expect(int8B.get(entityA)).toBe(32)
      // and then process in B, which will also send its updates
      await engineB.update(0)
      // expect(int8B.get(entityA)).toBe(32)

      // in this case, the engineA sends its updates to the engineB.
      // but the engineB responds with an outdatedMessage, to converge the state of
      // engineA towards the same value
      expect(env.interceptedMessages).toMatchObject([
        {
          direction: 'b->a',
          componentId: 123987,
          entity: entityA,
          data: Uint8Array.of(32),
          timestamp: 4
        }
      ])
      env.interceptedMessages.length = 0
      await engineB.update(0)

      // process the incoming "correction" message
      await engineA.update(0)
      // no messages should be emitted from engineA because it is receiving a "correction"
      expect(env.interceptedMessages).toMatchObject([])

      // now both values converged towards the same value
      expect(int8A.get(entityA)).toBe(32)
      expect(int8B.get(entityA)).toBe(32)
    })
  })

  describe('conflict resolution case 2', () => {
    it('now that engines have the same conflict-free state, we are repeating the same but with inverted values', async () => {
      int8A.createOrReplace(entityA, 48)
      int8B.createOrReplace(entityA, 45)

      // to generate a "conflict", we will send the updates from A to B first
      await engineA.update(0)
      expect(env.interceptedMessages).toMatchObject([
        // this value will have has the same timestamp in both engines
        {
          direction: 'a->b',
          componentId: 123987,
          entity: entityA,
          data: Uint8Array.of(48),
          timestamp: 5
        }
      ])
      env.interceptedMessages.length = 0
    })

    it('now we are receiving the updates from engineA', async () => {
      // and then process in B, which will also send its updates
      expect(int8B.get(entityA)).toBe(45)
      await engineB.update(0)

      // now both values converged towards the same value
      expect(int8A.get(entityA)).toBe(48)
      expect(int8B.get(entityA)).toBe(48)
      // in this case, since the conflict resolution can be made locally, no "fix"
      // message is emitted from engineB
      // expect(env.interceptedMessages).toMatchObject([])
      env.interceptedMessages.length = 0

      await engineA.update(0)
      expect(env.interceptedMessages).toMatchObject([])
      await engineB.update(0)
      expect(env.interceptedMessages).toMatchObject([])
      expect(int8A.get(entityA)).toBe(48)
      expect(int8B.get(entityA)).toBe(48)
    })
  })
})