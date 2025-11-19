import React, { useEffect, useState ,useCallback, useRef} from 'react';
import  MonacoEditor  from '@monaco-editor/react';

import { BiSolidRightArrow } from "react-icons/bi"
import { useSessionStore } from '../store/useSessionStore';
import { RxCross2 } from "react-icons/rx";
const MyEditor = () => {
    const {selectedSession,isRunning,onRun,code,changeCode,listenCodeChange} = useSessionStore();
    const [defaultValue,setDefaultValue] = useState("");
    const [output , setOutput ] = useState("");
    // local editor content to avoid cursor jump on rapid remote/store updates
    const [editorContent, setEditorContent] = useState("");
    const editorRef = useRef(null);

    
    useEffect(()=>{
      listenCodeChange();
      console.log("Code from MyEditor",code)
    },[listenCodeChange])
    
    useEffect(()=>{
        if(selectedSession.language == "javascript" ){
            setDefaultValue("// Start your code here...")
        }else if(selectedSession.language == 'python'){
            setDefaultValue("# Start your code here...")
        }else if(selectedSession.language == 'cpp'){
            setDefaultValue("// Start your code here...")
        }else if(selectedSession.language == 'c'){
            setDefaultValue("// Start your code here...")
        }else if(selectedSession.language == 'java'){
            setDefaultValue("// Start your code here...")
        }
    },[selectedSession && selectedSession.language])

    // initialize local editor content from store code or default value
    useEffect(()=>{
      const initial = code && code.length ? code : defaultValue;
      setEditorContent(initial || "");
    },[code, defaultValue])

    // when remote/store code changes, update local editor only if editor is not focused
    useEffect(()=>{
      if (!editorRef.current) return;
      const editorInstance = editorRef.current;
      if (code !== editorContent) {
        try {
          const hasFocus = editorInstance.hasTextFocus && editorInstance.hasTextFocus();
          if (!hasFocus) {
            setEditorContent(code);
          }
        } catch (e) {
          // fallback: update if not focused or error
          setEditorContent(code);
        }
      }
    },[code])
    
  // Debounce function
function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer); // Clear the previous timeout if the function is called again
      timer = setTimeout(() => {
        func.apply(this, args); // Execute the function after the delay
      }, delay);
    };
  }
  
  const handleEditorChange = (changedValue, event) => {
    // update local editor immediately to keep cursor position stable
    setEditorContent(changedValue || "");
    // Call the debounced function and pass changedValue to sync to store
    debouncedSetValue(changedValue || "");
  };
  
  // Create a debounced version of the function
  const debouncedSetValue = useCallback(debounce(async function(changedValue) {
    await changeCode(changedValue);
    console.log("From debounced.");
  }, 300),[]);
  const languageMapping = {
    javascript: 63,
    python: 71,
    c: 50,
    cpp: 54,
    java: 62,
  };
  const handleRunClick = async() => {
    // Logic to run the code
    const requestData = {
        source_code: code,
        language_id: languageMapping[selectedSession.language],
        stdin: "",
      };
    const out = await onRun(requestData);
    console.log("output : ",out)
    setOutput(out)
    console.log("Run button clicked!");
  };

  const handleEditorDidMount = (editor, monaco) => {
    // store editor instance for focus checks and advanced ops
    editorRef.current = editor;
    monaco.editor.defineTheme('myCustomTheme', {
      base: 'vs-dark', // Can be 'vs', 'vs-dark', or 'hc-black'
      inherit: true, // Inherit default settings
      rules: [
        { token: 'comment', foreground: '#15f4ee', fontStyle: 'italic' },
        { token: 'keyword', foreground: '#9F9FFF' },
        { token: 'identifier', foreground: '#c4c4fb' },
        { token: 'delimiter.parenthesis', foreground: 'ff0000' }, // Red parentheses
        { token: 'delimiter.bracket', foreground: '00ff00' },    // Green square brackets
        { token: 'delimiter.brace', foreground: '0000ff' },  
      ],
      colors: {
        'editor.background': '#1e1e1e', // Background color of the editor
        'editor.foreground': '#ffffff', // Default color of the text
      },
    });
    setTimeout(() => {
        // Get the DOM node of the editor
        const editorNode = editor.getDomNode();
  
        if (editorNode) {
          // Find the minimap DOM element
          const minimapContainer = editorNode.querySelector('.minimap');
  
          if (minimapContainer) {
            // Adjust the position of the minimap
            minimapContainer.style.position = 'relative';
            minimapContainer.style.top = '30px'; // Move it 50px down
          }
        }
      }, 100); 

    // Apply the custom theme
    monaco.editor.setTheme('myCustomTheme');
  };

  return (
    <div className='editor' style={{ height: '100%',width:"100%",position:'relative' ,border:"3px solid #7272FF"}}>
        {/* <BiRightArrow className='icon'/> */}
      <MonacoEditor
        height={output.length !=0 ? "80%" : "100%"}
        width="100%"
        theme='vs'
        defaultLanguage={selectedSession.language}
        options={{
            selectOnLineNumbers: true,
            readOnly: false,
            minimap: { enabled: true ,scale:3,maxColumn:50,},
            fontSize:"20",
            padding:{top:30,bottom:30},
          }}
        defaultValue={editorContent}
        value={editorContent}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
      />
      <button
      title='run'
        style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          padding: '3px 12px',
          color: 'white',
          fontSize:"16px",
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor:"#9F9FFF",
          zIndex:20,
        }}
        onClick={handleRunClick} disabled={isRunning}
      >
        {isRunning ? "..." :<BiSolidRightArrow/>}
      </button>
      {output.length != 0 && <div className='output'>
        <div className='title'>
            <p>Code Executed .</p>
            <div className='cross' onClick={()=>setOutput("")}><RxCross2/></div>
        </div>
            <div className='text'>{output}</div>
            
        </div>}
    </div>
  );
};

export default MyEditor;
