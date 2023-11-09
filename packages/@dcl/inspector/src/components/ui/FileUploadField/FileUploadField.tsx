import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import cx from 'classnames'
import { v4 as uuidv4 } from 'uuid'
import { VscFolderOpened as FolderIcon } from 'react-icons/vsc'

import { selectAssetCatalog, selectUploadFile, updateUploadFile } from '../../../redux/app'
import { selectAssetsTab } from '../../../redux/ui'
import { AssetsTab } from '../../../redux/ui/types'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { DropTypesEnum, ProjectAssetDrop, getNode } from '../../../lib/sdk/drag-drop'
import { EXTENSIONS, withAssetDir } from '../../../lib/data-layer/host/fs-utils'

import { isAsset, isModel } from '../../EntityInspector/GltfInspector/utils'
import { isAudio, isAudioFile } from '../../EntityInspector/AudioSourceInspector/utils'
import { TreeNode } from '../../ProjectAssetExplorer/ProjectView'
import { AssetNodeItem } from '../../ProjectAssetExplorer/types'

import { TextField } from '../TextField'
import { ErrorMessage } from '../ErrorMessage'

import { type Props } from './types'

import './FileUploadField.css'

function parseAccept(accept: string[]) {
  return accept.join(',')
}

const FileUploadField: React.FC<Props> = ({
  className,
  disabled,
  value,
  isEnabledFileExplorer = true,
  error,
  onDrop,
  isValidFile,
  accept = EXTENSIONS
}) => {
  const [path, setPath] = useState<string | undefined>(value?.toString())
  const [dropError, setDropError] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const files = useAppSelector(selectAssetCatalog)
  const uploadFile = useAppSelector(selectUploadFile)
  const dispatch = useAppDispatch()
  const id = useRef(uuidv4())

  useEffect(() => {
    if (uploadFile[id.current] && typeof uploadFile[id.current] === 'string' && path !== uploadFile[id.current]) {
      const uploadFilePath = uploadFile[id.current] as string
      setPath(uploadFilePath)
      const cleanUpdateUploadFile = { ...uploadFile }
      delete cleanUpdateUploadFile[id.current]
      dispatch(updateUploadFile(cleanUpdateUploadFile))
      onDrop && onDrop(uploadFilePath)
    }
  }, [uploadFile, onDrop])

  const removeBase = useCallback(
    (path?: string) => {
      return path ? (files?.basePath ? path.replace(files.basePath + '/', '') : path) : ''
    },
    [files]
  )

  const addBase = useCallback(
    (path: string) => {
      return files?.basePath ? `${files.basePath}/${path}` : path
    },
    [files]
  )

  const handleDrop = useCallback(
    (src: string) => {
      setPath(src)
      onDrop && onDrop(src)
    },
    [onDrop]
  )

  const isValid = useCallback(
    (node: TreeNode): node is AssetNodeItem => {
      return isValidFile ? isValidFile(node) : isModel(node) || isAudio(node)
    },
    [isValidFile]
  )

  const [{ isHover, canDrop }, drop] = useDrop(
    () => ({
      accept: [DropTypesEnum.ProjectAsset],
      drop: ({ value, context }: ProjectAssetDrop, monitor) => {
        if (monitor.didDrop()) return
        const node = context.tree.get(value)!
        const element = getNode(node, context.tree, isValid)
        if (element) {
          handleDrop(withAssetDir(element.asset.src))
          setDropError(false)
        } else {
          setDropError(true)
        }
      },
      canDrop: ({ value, context }: ProjectAssetDrop) => {
        const node = context.tree.get(value)!
        return !!getNode(node, context.tree, isValid)
      },
      collect: (monitor) => ({
        isHover: monitor.canDrop() && monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    [files, isValid]
  )

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [inputRef])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file && (isAsset(file.name) || isAudioFile(file.name))) {
        setDropError(false)
        dispatch(selectAssetsTab({ tab: AssetsTab.Import }))
        const newUploadFile = { ...uploadFile }
        newUploadFile[id.current] = file
        dispatch(updateUploadFile(newUploadFile))
      } else {
        setDropError(true)
      }
    },
    [setPath, setDropError]
  )

  const handleChangeTextField = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      if (value && (isAsset(value) || isAudioFile(value))) {
        setPath(addBase(value))
        setDropError(false)
      } else {
        setDropError(true)
      }
    },
    [addBase, setPath, setDropError]
  )

  const hasError = useMemo(() => {
    return error || dropError
  }, [error, dropError])

  return (
    <div className={cx('FileUpload Field', className)}>
      <div className={cx('FileUploadContainer', { error: hasError, disabled, droppeable: canDrop })}>
        <TextField
          id={id.current}
          className="FileUploadInput"
          ref={drop}
          placeholder="Path File"
          onChange={handleChangeTextField}
          value={removeBase(path)}
          error={hasError}
          disabled={disabled}
          drop={isHover}
        />
        <input type="file" ref={inputRef} onChange={handleChange} accept={parseAccept(accept)} />
        {isEnabledFileExplorer && (
          <button className="FileUploadButton" onClick={handleClick} disabled={disabled}>
            <FolderIcon size={16} />
          </button>
        )}
      </div>
      {hasError && <ErrorMessage error={'File not valid.'} />}
    </div>
  )
}

export default React.memo(FileUploadField)
