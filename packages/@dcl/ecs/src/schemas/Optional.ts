import { ByteBuffer } from '../serialization/ByteBuffer'
import { ISchema } from './ISchema'

/**
 * @public
 */
export function IOptional<T>(spec: ISchema<T>): ISchema<T | undefined> {
  return {
    serialize(value: T | undefined, builder: ByteBuffer): void {
      if (value) {
        builder.writeInt8(1)
        spec.serialize(value, builder)
      } else {
        builder.writeInt8(0)
      }
    },
    deserialize(reader: ByteBuffer): T | undefined {
      const exists = reader.readInt8()
      if (exists) {
        return spec.deserialize(reader)
      }
    },
    create() {
      return undefined
    }
  }
}