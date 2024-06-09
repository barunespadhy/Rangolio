import React, { useCallback, useEffect, useState } from 'react'
import {
  Button, ButtonGroup, Label, Input } from 'reactstrap';
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Blockquote from '@tiptap/extension-blockquote'
import Link from '@tiptap/extension-link'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, 
		 faUnderline, faAlignLeft, 
		 faAlignCenter, faAlignRight, 
		 faAlignJustify, faHighlighter, 
		 faStrikethrough, faCode, 
		 faListUl, faLink,
		 faListOl, faQuoteLeft,
		 faQuoteRight, faRulerHorizontal, 
		 faRotateLeft, faRotateRight, faImage } from '@fortawesome/free-solid-svg-icons';


import CustomImageExtension from './tiptap-custom-extensions/custom-image-extension.jsx'
import MediaUpload from './media-upload.jsx'

const MenuBar = (props) => {
  const { editor } = useCurrentEditor()

  const addMedia = (url) => {
    editor.commands.setImage({
      src: url,
    });
  };

  if (!editor) {
    return null
  }

  useEffect(() => {
    if (editor){
      const handleChange = () => {
        props.setContent(editor.getHTML())
      }
      editor.on('update', handleChange)
      return () => {
        editor.on('update', handleChange)
      }
    }
  },[editor])
  
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;


  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    
    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <>
	  <ButtonGroup className='mt-2'>
	    <Button
        color={ThemeConfig[GlobalTheme].buttonColor}  
	      onClick={() => editor.chain().focus().setTextAlign('left').run()}
	      outline
	      active={editor.isActive('left')}
	     >
          <FontAwesomeIcon icon={faAlignLeft}/>
        </Button>
        <Button 
        color={ThemeConfig[GlobalTheme].buttonColor} 
	      onClick={() => editor.chain().focus().setTextAlign('center').run()}
	      outline
	      active={editor.isActive('center')}
	     >
          <FontAwesomeIcon icon={faAlignCenter}/>
        </Button>
        <Button 
        color={ThemeConfig[GlobalTheme].buttonColor} 
	      onClick={() => editor.chain().focus().setTextAlign('right').run()}
	      outline
	      active={editor.isActive('right')}
	     >
          <FontAwesomeIcon icon={faAlignRight}/>
        </Button>
        <Button 
        color={ThemeConfig[GlobalTheme].buttonColor} 
	      onClick={() => editor.chain().focus().setTextAlign('justify').run()}
	      outline
	      active={editor.isActive('justify')}
	     >
          <FontAwesomeIcon icon={faAlignJustify}/>
        </Button>
	  </ButtonGroup >
      <ButtonGroup className='mt-2' style={{marginLeft: '10px'}}>
	    <Button
        color={ThemeConfig[GlobalTheme].buttonColor} 
	      onClick={() => editor.chain().focus().toggleBold().run()}
	      disabled={
	        !editor.can()
	           .chain()
	           .focus()
	           .toggleBold()
	           .run()
	      }
	      outline
	      active={editor.isActive('bold')}
	    >
	      <FontAwesomeIcon icon={faBold}/>
	    </Button>
	    <Button
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          outline
          active={editor.isActive('italic')}
        >
          <FontAwesomeIcon icon={faItalic}/>
        </Button>
        <Button
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          outline
          active={editor.isActive('underline')}
        >
          <FontAwesomeIcon icon={faUnderline}/>
        </Button>
        <Button 
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          outline
          active={editor.isActive('highlight')}
        >
          <FontAwesomeIcon icon={faHighlighter}/>
        </Button>
        <Button
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          outline
          active={editor.isActive('strike')}
        >
          <FontAwesomeIcon icon={faStrikethrough}/>
        </Button>
	  </ButtonGroup>
	  <Button 
      className='mt-2'
      color={ThemeConfig[GlobalTheme].buttonColor} 
	    onClick={setLink}
	    style={{marginLeft: '10px'}}
	    outline
	    active={editor.isActive('link')}
	   >
        <FontAwesomeIcon icon={faLink}/>
      </Button>
      <Button
        className='mt-2'
        color={ThemeConfig[GlobalTheme].buttonColor} 
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        style={{marginLeft: '10px'}}
        outline
        active={editor.isActive('codeBlock')}
      >
        <FontAwesomeIcon icon={faCode}/>
      </Button>
      <ButtonGroup className='mt-2' style={{marginLeft: '10px'}}>
        <Button
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().setParagraph().run()}
          outline
          active={editor.isActive('paragraph')}
        >
          p
        </Button>
	      <Button
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          outline
          active={editor.isActive('heading', { level: 1 })}
        >
        h1
        </Button>
        <Button
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          outline
          active={editor.isActive('heading', { level: 2 })}
        >
        h2
        </Button>
        <Button
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          outline
          active={editor.isActive('heading', { level: 3 })}
        >
        h3
        </Button>
        <Button
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          outline
          active={editor.isActive('heading', { level: 4 })}
        >
        h4
        </Button>
        <Button
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          outline
          active={editor.isActive('heading', { level: 5 })}
        >
        h5
        </Button>
        <Button
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          outline
          active={editor.isActive('heading', { level: 6 })}
        >
        h6
        </Button>
	  </ButtonGroup>
	  <ButtonGroup className='mt-2' style={{marginLeft: '10px'}}>
	    <Button
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          outline
          active={editor.isActive('bulletList')}
        >
          <FontAwesomeIcon icon={faListUl}/>
        </Button>
        <Button
          color={ThemeConfig[GlobalTheme].buttonColor} 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          outline
          active={editor.isActive('orderedList')}
        >
          <FontAwesomeIcon icon={faListOl}/>
        </Button>
	  </ButtonGroup>
      <Button
        className='mt-2'
        color={ThemeConfig[GlobalTheme].buttonColor} 
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        style={{marginLeft: '10px'}}
        outline
        active={editor.isActive('blockquote')}
      >
        <FontAwesomeIcon icon={faQuoteLeft}/> <FontAwesomeIcon icon={faQuoteRight}/>
      </Button>
      <Button 
        className='mt-2'
        color={ThemeConfig[GlobalTheme].buttonColor} 
      	onClick={() => editor.chain().focus().setHorizontalRule().run()}
      	outline
      	style={{marginLeft: '10px'}}
      >
        <FontAwesomeIcon icon={faRulerHorizontal}/>
      </Button>
      <ButtonGroup className='mt-2' style={{marginLeft: '10px'}}>
      <Button
        color={ThemeConfig[GlobalTheme].buttonColor} 
        onClick={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        <FontAwesomeIcon icon={faRotateLeft}/>
      </Button>
      <Button
        color={ThemeConfig[GlobalTheme].buttonColor} 
        onClick={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        <FontAwesomeIcon icon={faRotateRight}/>
      </Button>
      </ButtonGroup>
      <Button
        className='mt-2 ms-2'
        color={ThemeConfig[GlobalTheme].buttonColor}
        onClick={() => props.toggle()}
        outline
      >
        <FontAwesomeIcon icon={faImage}/>
      </Button>
      <MediaUpload setMedia={addMedia} notificationToggler={props.notificationToggler} modal={props.modal} toggle={props.toggle} resourceType={props.resourceType} resourceId={props.resourceId}></MediaUpload>
    </>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Underline,
  Blockquote,
  CustomImageExtension,
  TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
  Highlight,
  Link.configure({
        openOnClick: false,
        autolink: true,
      }),
]

export default (props) => {
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  if (props.content && GlobalTheme && ThemeConfig)
  return (
    <>
      <EditorProvider slotBefore={<MenuBar resourceType={props.resourceType} resourceId={props.resourceId} modal={modal} toggle={toggle} notificationToggler={props.notificationToggler} setContent={props.setContent} GlobalTheme={GlobalTheme} ThemeConfig={ThemeConfig}/>} extensions={extensions} content={props.content}></EditorProvider>
    </>
  )
}