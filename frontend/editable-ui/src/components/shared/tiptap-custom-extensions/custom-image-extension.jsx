/*

  extension credits: Angelika Tyborska: https://angelika.me/2023/02/26/how-to-add-editing-image-alt-text-tiptap/

*/

import Image from '@tiptap/extension-image'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import {
  Button
} from 'reactstrap';

function ImageNode(props) {
  const { src, alt } = props.node.attrs
  const { updateAttributes } = props
  const onEditAlt = () => {
    const newAlt = prompt('Set alt text:', alt || '')
    updateAttributes({ alt: newAlt })
  }

  let className = 'image'
  if (props.selected) { className += ' ProseMirror-selectednode'}

  return (
    <NodeViewWrapper className={className} data-drag-handle>
      <div className="image-container d-md-block">
        <img className='mx-auto d-block' src={src} alt={alt} />
        <div className="image-overlay">
          <span className="image-text mx-auto d-block">
            { alt ?
              <span>✔</span> :
              <span>!</span>
            }
            { alt ?
              <span className="text">Alt text: "{alt}".</span>:
              <span className="text">Alt text missing.</span>
            }
            <Button className="edit" type="button" onClick={onEditAlt}>
              Edit
            </Button>
          </span>
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export default Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageNode)
  }
})