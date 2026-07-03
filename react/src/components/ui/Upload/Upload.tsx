import cloneDeep from 'lodash/cloneDeep'
import { forwardRef, useRef, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'

import Button from '../Button/Button'
import CloseButton from '../CloseButton'
import Notification from '../Notification/Notification'
import toast from '../toast/toast'

import FileItem from './FileItem'

import type { CommonProps } from '../@types/common'
import type { ReactNode, ChangeEvent, MouseEvent } from 'react'

export interface UploadProps extends CommonProps {
    accept?: string
    beforeUpload?: (file: FileList | null, fileList: File[]) => boolean | string
    disabled?: boolean
    draggable?: boolean
    fileList?: File[]
    fileListClass?: string
    fileItemClass?: string
    multiple?: boolean
    onChange?: (file: File[], fileList: File[]) => void
    onFileRemove?: (file: File[]) => void
    showList?: boolean
    tip?: string | ReactNode
    uploadLimit?: number
    field?: any
}

const UploadContainer = styled.div<{
    $draggable?: boolean
    $disabled?: boolean
    $dragOver?: boolean
}>`
    border: 2px dashed
        ${({ $draggable, $dragOver, theme }) =>
            $draggable && $dragOver
                ? theme.colors.primary
                : theme.colors.border.default};
    background: ${({ $disabled, theme }) =>
        $disabled ? '#f3f4f6' : theme.colors.bg.input};
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radius.md};
    transition: border-color 0.2s;
    position: relative;
    min-width: 200px;
    min-height: 56px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 12px;
`

const UploadInput = styled.input`
    display: none;
`

const FileList = styled.div`
    width: 100%;
    margin-top: ${({ theme }) => theme.spacing.md};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`

const FileRemoveButton = styled(CloseButton)`
    margin-left: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.status.error};
    cursor: pointer;
    &:hover {
        opacity: 0.7;
    }
`

const filesToArray = (files: File[]) =>
    Object.keys(files).map((key) => files[key as any])

const Upload = forwardRef<HTMLDivElement, UploadProps>((props, ref) => {
    const {
        accept,
        beforeUpload,
        disabled = false,
        draggable = false,
        fileList = [],
        fileListClass,
        fileItemClass,
        multiple,
        onChange,
        onFileRemove,
        showList = true,
        tip,
        uploadLimit,
        children,
        className,
        field,
        ...rest
    } = props

    const fileInputField = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState(fileList)
    const [dragOver, setDragOver] = useState(false)

    useEffect(() => {
        if (JSON.stringify(files) !== JSON.stringify(fileList)) {
            setFiles(fileList)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(fileList)])

    const triggerMessage = (msg: string | ReactNode = '') => {
        toast.push(
            <Notification type="danger" duration={2000}>
                {msg || 'Upload Failed!'}
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }

    const pushFile = (newFiles: FileList | null, file: File[]) => {
        if (newFiles) {
            for (const f of newFiles) {
                file.push(f)
            }
        }

        return file
    }

    const addNewFiles = (newFiles: FileList | null) => {
        let file = cloneDeep(files)
        if (typeof uploadLimit === 'number' && uploadLimit !== 0) {
            if (Object.keys(file).length >= uploadLimit) {
                if (uploadLimit === 1) {
                    file.shift()
                    file = pushFile(newFiles, file)
                }

                return filesToArray({ ...file })
            }
        }
        file = pushFile(newFiles, file)
        return filesToArray({ ...file })
    }

    const onNewFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const { files: newFiles } = e.target
        let result: boolean | string = true

        if (beforeUpload) {
            result = beforeUpload(newFiles, files)

            if (result === false) {
                triggerMessage()
                return
            }

            if (typeof result === 'string' && result.length > 0) {
                triggerMessage(result)
                return
            }
        }

        if (result) {
            const updatedFiles = addNewFiles(newFiles)
            setFiles(updatedFiles)
            onChange?.(updatedFiles, files)
        }
    }

    const removeFile = (fileIndex: number) => {
        const deletedFileList = files.filter((_, index) => index !== fileIndex)
        setFiles(deletedFileList)
        onFileRemove?.(deletedFileList)
    }

    const triggerUpload = (e: MouseEvent<HTMLDivElement>) => {
        if (!disabled) {
            fileInputField.current?.click()
        }
        e.stopPropagation()
    }

    const renderChildren = () => {
        if (!draggable && !children) {
            return (
                <Button disabled={disabled} onClick={(e) => e.preventDefault()}>
                    Upload
                </Button>
            )
        }

        if (draggable && !children) {
            return <span>Choose a file or drag and drop here</span>
        }

        return children
    }

    const handleDragLeave = useCallback(() => {
        if (draggable) {
            setDragOver(false)
        }
    }, [draggable])

    const handleDragOver = useCallback(() => {
        if (draggable && !disabled) {
            setDragOver(true)
        }
    }, [draggable, disabled])

    const handleDrop = useCallback(
        (e?: React.DragEvent<HTMLDivElement>) => {
            if (draggable) {
                setDragOver(false)
                if (
                    e &&
                    e.dataTransfer &&
                    e.dataTransfer.files &&
                    e.dataTransfer.files.length > 0
                ) {
                    e.preventDefault()
                    let result: boolean | string = true
                    const newFiles = e.dataTransfer.files
                    if (beforeUpload) {
                        result = beforeUpload(newFiles, files)
                        if (result === false) {
                            triggerMessage()
                            return
                        }
                        if (typeof result === 'string' && result.length > 0) {
                            triggerMessage(result)
                            return
                        }
                    }
                    if (result) {
                        const updatedFiles = addNewFiles(newFiles)
                        setFiles(updatedFiles)
                        onChange?.(updatedFiles, files)
                    }
                }
            }
        },
        [draggable, beforeUpload, files, addNewFiles, onChange],
    )

    return (
        <>
            <UploadContainer
                ref={ref as any}
                $draggable={draggable}
                $disabled={disabled}
                $dragOver={dragOver}
                onClick={triggerUpload}
                onDragLeave={draggable ? handleDragLeave : undefined}
                onDragOver={draggable ? handleDragOver : undefined}
                onDrop={draggable ? handleDrop : undefined}
                {...rest}
            >
                <UploadInput
                    ref={fileInputField}
                    type="file"
                    disabled={disabled}
                    multiple={multiple}
                    accept={accept}
                    title=""
                    value=""
                    onChange={onNewFileUpload}
                    {...field}
                />
                {renderChildren()}
            </UploadContainer>
            {tip}
            {showList && (
                <FileList>
                    {files.map((file, index) => (
                        <FileItem
                            key={file.name + index}
                            file={file}
                            className={fileItemClass}
                        >
                            <FileRemoveButton
                                onClick={() => removeFile(index)}
                            />
                        </FileItem>
                    ))}
                </FileList>
            )}
        </>
    )
})

Upload.displayName = 'Upload'

export default Upload
