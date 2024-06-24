import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import { Button } from 'reactstrap';
import CustomImagePropertiesModal from './custom-image-properties-modal.jsx';
import { useState, useRef, useEffect } from 'react';

const CustomImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      height: {
        default: '300',
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) {
            return {};
          }
          return { height: attributes.height };
        },
      },
      width: {
        default: '300',
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }
          return { width: attributes.width };
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNode);
  },
});

function ImageNode(props) {
  const imageRef = useRef(null);
  const [modal, setModal] = useState(false);
  const [height, setHeight] = useState(props.node.attrs.height || '');
  const [width, setWidth] = useState(props.node.attrs.width || '');

  const toggle = () => setModal(!modal);

  const { src, alt } = props.node.attrs;
  const { updateAttributes } = props;

  const setAlt = (alt) => {
    updateAttributes({ alt });
  };

  const handleSetWidth = (width) => {
    setWidth(width);
    updateAttributes({ width });
  };

  const handleSetHeight = (height) => {
    setHeight(height);
    updateAttributes({ height });
  };

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.height = height;
      imageRef.current.width = width;
    }
  }, [height, width]);

  useEffect(() => {
    if (imageRef.current) {
      if (imageRef.current.height !== ''){
        setHeight(imageRef.current.height)
      }
      if (imageRef.current.width !== ''){
        setWidth(imageRef.current.width)
      }
    }
  });

  let className = 'image';
  if (props.selected) className += ' ProseMirror-selectednode';

  return (
    <NodeViewWrapper className={className} data-drag-handle>
      <CustomImagePropertiesModal
        modal={modal}
        toggle={toggle}
        setAlt={setAlt}
        alt={alt}
        imageRef={imageRef}
        setWidth={handleSetWidth}
        setHeight={handleSetHeight}
      />
      <div className='image-container d-md-block'>
        <img ref={imageRef} className='mx-auto d-block' src={src} alt={alt} height={height === '' ? '300' : height} width={width === '' ? '300' : width} />
        <div className="image-overlay">
          <span className="image-text mx-auto d-block">
            <Button className="edit" type="button" onClick={toggle}>
              Edit Image Properties
            </Button>
          </span>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export default CustomImageExtension;
