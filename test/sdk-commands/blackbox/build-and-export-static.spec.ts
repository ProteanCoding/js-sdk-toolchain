import { initComponents } from '../../../packages/@dcl/sdk-commands/src/components'
import { Entity } from '../../../packages/@dcl/sdk-commands/node_modules/@dcl/schemas'
import { runSdkCommand } from '../../../packages/@dcl/sdk-commands/src/run-command'
import rimraf from 'rimraf'
import path from 'path'

describe('blackbox: build', () => {
  test('build integration test with workspace', async () => {
    const components = await initComponents()
    await runSdkCommand(components, 'build', ['--dir=test/build-ecs/fixtures'])
  }, 15000)

  test('build integration test with single scene', async () => {
    const components = await initComponents()
    await runSdkCommand(components, 'build', ['--dir=test/build-ecs/fixtures/ecs7-scene', '--skip-install'])
  }, 15000)

  test('build integration test with --single file', async () => {
    const components = await initComponents()
    await runSdkCommand(components, 'build', [
      '--dir=test/snapshots',
      '--single=development-bundles/testing-fw.test.ts'
    ])
  }, 15000)

  test('build integration test with --single file --production', async () => {
    const components = await initComponents()
    await runSdkCommand(components, 'build', [
      '--dir=test/snapshots',
      '--production',
      '--single=development-bundles/testing-fw.test.ts'
    ])
  }, 15000)

  test('build integration test with --single wildcard', async () => {
    const components = await initComponents()
    await runSdkCommand(components, 'build', ['--dir=test/snapshots', '--single=development-bundles/*.test.ts'])
  }, 15000)

  test('export-static integration test', async () => {
    const components = await initComponents()

    await components.fs.writeFile(
      'test/build-ecs/fixtures/ecs7-scene/aCaseSensitiveReadme.md',
      'this autogenerated case sensitive filename will help debug issues with normalized filenames'
    )

    rimraf.sync('tmp/ipfs')

    await runSdkCommand(components, 'export-static', [
      '--dir=test/build-ecs/fixtures',
      '--timestamp=1233113123',
      '--destination=tmp/ipfs',
      '--json'
    ])
  })

  test('export-static integration test with realm', async () => {
    const components = await initComponents()
    await components.fs.writeFile(
      'test/build-ecs/fixtures/ecs7-scene/aCaseSensitiveReadme.md',
      'this autogenerated case sensitive filename will help debug issues with normalized filenames'
    )

    const json = await runSdkCommand(components, 'export-static', [
      '--dir=test/build-ecs/fixtures',
      '--destination=tmp/ipfs',
      '--realmName=hola',
      '--baseUrl=https://decentraland.org'
    ])

    expect(json).toMatchObject({
      scenesUrn: expect.arrayContaining([
        expect.stringMatching(/^urn:.+\?=&baseUrl=https:\/\/decentraland.org\//),
        //                             ?=& <- this is required to create compliant URNs https://datatracker.ietf.org/doc/html/rfc8141#page-10 (ADR-207)
        expect.stringMatching(/^urn:.+\?=&baseUrl=https:\/\/decentraland.org\//)
      ]),
      entities: expect.arrayContaining([expect.stringMatching(/^ba.+/), expect.stringMatching(/^ba.+/)]),
      destination: path.resolve('tmp/ipfs')
    })

    // validate entities are in a good shape
    for (const entityId of json.entities) {
      const entity = JSON.parse(await components.fs.readFile(path.resolve('tmp/ipfs', entityId), 'utf8')) as Entity
      entity.id = entityId

      expect(Entity.validate(entity)).toBeTruthy()
      expect(Entity.validate.errors || []).toEqual([])
      expect(entity.content.length).toBeGreaterThan(1)

      for (const { file, hash } of entity.content) {
        expect(path.isAbsolute(file)).toBeFalsy()
        // check lower cased filesystem
        expect(file).toEqual(file.toLowerCase())
        expect(await components.fs.fileExists(path.resolve('tmp/ipfs', hash))).toBe(true)
      }
    }
  })
})