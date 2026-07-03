import { forwardRef } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import styled from 'styled-components'

type RichTextEditorProps = ReactQuill.ReactQuillProps

export type RichTextEditorRef = ReactQuill

const RichTextEditorWrapper = styled.div`
    .ql-editor {
        min-height: 120px;
    }
`

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
    (props, ref) => {
        return (
            <RichTextEditorWrapper>
                <ReactQuill ref={ref} {...props} />
            </RichTextEditorWrapper>
        )
    },
)

RichTextEditor.displayName = 'RichTextEditor'

export default RichTextEditor
