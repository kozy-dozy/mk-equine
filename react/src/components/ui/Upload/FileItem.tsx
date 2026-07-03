import { VscFilePdf, VscFileZip, VscFile } from 'react-icons/vsc'
import styled from 'styled-components'

import type { CommonProps } from '../@types/common'

const BYTE = 1000
const getKB = (bytes: number) => Math.round(bytes / BYTE)

const StyledFileIcon = styled.span`
    font-size: 2.25rem;
`

const StyledFlex = styled.div`
    display: flex;
    align-items: center;
`

const UploadFileWrap = styled.div``

const UploadFileThumbnail = styled.div``

const UploadFileInfo = styled.div``

const UploadFileName = styled.h6``

const UploadFileSize = styled.span``

const UploadFileImage = styled.img``

const FileIcon = ({ children }: CommonProps) => {
    return <StyledFileIcon>{children}</StyledFileIcon>
}

export interface FileItemProps extends CommonProps {
    file: File
}

const FileItem = (props: FileItemProps) => {
    const { file, children } = props
    const { type, name, size } = file

    const renderThumbnail = () => {
        const isImageFile = type.split('/')[0] === 'image'

        if (isImageFile) {
            return (
                <UploadFileImage
                    src={URL.createObjectURL(file)}
                    alt={`file preview ${name}`}
                />
            )
        }

        if (type === 'application/zip') {
            return (
                <FileIcon>
                    <VscFileZip />
                </FileIcon>
            )
        }

        if (type === 'application/pdf') {
            return (
                <FileIcon>
                    <VscFilePdf />
                </FileIcon>
            )
        }

        return (
            <FileIcon>
                <VscFile />
            </FileIcon>
        )
    }

    return (
        <UploadFileWrap>
            <StyledFlex>
                <UploadFileThumbnail>{renderThumbnail()}</UploadFileThumbnail>
                <UploadFileInfo>
                    <UploadFileName>{name}</UploadFileName>
                    <UploadFileSize>{getKB(size)} kb</UploadFileSize>
                </UploadFileInfo>
            </StyledFlex>
            {children}
        </UploadFileWrap>
    )
}

FileItem.displayName = 'UploadFileItem'

export default FileItem
