import React from 'react';
import { Container, Dimmer, Loader, Image, Segment, TextArea, Grid } from 'semantic-ui-react';
import '../css/Style.css';
import { stateToHTML } from 'draft-js-export-html';
import { stateToMarkdown } from 'draft-js-export-markdown';
import { rawContent } from '../extras/rawContent';
import GetCurrentlySelectedBlock from './GetCurrentlySelectedBlock';
// import createHashtagPlugin from 'draft-js-hashtag-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import 'draft-js-linkify-plugin/lib/plugin.css';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';
import {
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  ContentState,
  // Editor,
  EditorState,
  Entity,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
} from 'draft-js';
import Editor from 'draft-js-plugins-editor';

const {hasCommandModifier} = KeyBindingUtil;
const editorStateDefault = EditorState.createEmpty();
// const hashtagPlugin = createHashtagPlugin();
const linkifyPlugin = createLinkifyPlugin();
const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

const plugins = [
  // hashtagPlugin,
  linkifyPlugin,
  emojiPlugin,
];

function myKeyBindingFn(e: SyntheticKeyboardEvent): string {
  if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    return 'myeditor-save';
  }
  return getDefaultKeyBinding(e);
}

const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'left':
      return 'align-left';
    case 'center':
      return 'align-center';
    case 'right':
      return 'align-right';
    default:
      return null;
  }
}

class Main extends React.Component {
  state = {
    editorState: EditorState.createEmpty(),
    loaded: false,
  };

  componentWillMount () {
    this.setState({ editorState: editorStateDefault, loaded: false });
    console.log("cwm: editorStateDefault: ", editorStateDefault);
  }

  componentDidMount () {
    this.setState({ loaded: true });
    // TODO: set focus to input field
    console.log("cdm: editorStateDefault: ", editorStateDefault);
  }

  onChange = (editorState) => {
    this.setState({ editorState });
    console.log(stateToHTML(this.state.editorState.getCurrentContent()));
  }

  // handleKeyCommand(command, editorState) {
  //   const newState = RichUtils.handleKeyCommand(editorState, command);
  //   if (newState) {
  //     this.onChange(newState);
  //     return 'handled';
  //   }
  //   return 'not-handled';
  // }
  handleKeyCommand(command: string): DraftHandleValue {
    if (command === 'myeditor-save') {
      console.log("you just hit Command-S");
      // Perform a request to save your contents, set
      // a new `editorState`, etc.
      return 'handled';
    }
    return 'not-handled';
  }

  logState = () => console.log(
    this.state.editorState.toJS()
  );

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'BOLD'
    ));
  }
  _onItalicClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'ITALIC'
    ));
  }
  _onULClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'UL'
    ));
  }
  _onOLClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'OL'
    ));
  }
  _onAlignLeftClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'LEFT'
    ));
  }

  render() {
    if( this.state.loaded ){
      return (
        <Container fluid>
          <Grid padded columns={2}>
            <Grid.Row columns={2}>
              <Grid.Column>
                <h1>Rich Text</h1>
                <button onClick={this._onBoldClick.bind(this)}>Bold</button>
                <button onClick={this._onItalicClick.bind(this)}>Italic</button>
                <button onClick={this._onULClick.bind(this)}>UL</button>
                <button onClick={this._onOLClick.bind(this)}>OL</button>
                <button onClick={this._onAlignLeftClick.bind(this)}>Left</button>
                <input
                  onClick={this.logState}
                  style={styles.button}
                  type="button"
                  value="Log State"
                />
              </Grid.Column>
              <Grid.Column>
                <h1>HTML</h1>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <div style={styles.root}>
                  <div style={styles.editor} onClick={this.focus}>
                    <Editor
                      editorState={this.state.editorState}
                      onChange={this.onChange}
                      handleKeyCommand={this.handleKeyCommand}
                      keyBindingFn={myKeyBindingFn}
                      blockStyleFn={getBlockStyle}
                      placeholder="Click in center of this field just under this line to start. So picky!"
                      width="100%"
                      ref={this.setDomEditorRef}
                      plugins={[linkifyPlugin, emojiPlugin]}
                    />
                  </div>
                </div>
              </Grid.Column>
              <Grid.Column>
                <TextArea
                  placeholder='Tell us more'
                  style={styles.textWindow}
                  value={stateToHTML(this.state.editorState.getCurrentContent())}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <EmojiSuggestions />
                <EmojiSelect />
              </Grid.Column>
              <Grid.Column>
                <p> </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                <h3>Features</h3>
                <ul className="UlNoBullet">
                  <li>Anything looking like a link is recognized and styled</li>
                </ul>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <h1>ContentState</h1>
              </Grid.Column>
              <Grid.Column>
                <h1>Rendered</h1>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <TextArea
                  placeholder='Tell us more'
                  style={styles.textWindow}
                  // value={stateToMarkdown(this.state.editorState.getCurrentContent())}
                  value={this.state.editorState.getCurrentContent()}
                />
              </Grid.Column>
              <Grid.Column>
                <TextArea
                  placeholder='Tell us more'
                  style={styles.textWindow}
                  // value={stateToHTML(this.state.editorState.getCurrentContent())}
                />
              </Grid.Column>
            </Grid.Row>

          </Grid>
        </Container>
      );
    } else {
        return (
          <Dimmer active inverted size='small' className='dimmer'>
            <Loader inverted content={this.state.errorMessage} />
          </Dimmer>
        )
      }
    }
}

const styles = {
  root: {
    fontFamily: '\'Helvetica\', sans-serif',
    height: '100%',
    minHeight: 300,
    width: '100%',
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    height: '100%',
    minHeight: 300,
    width: '100%',
    padding: 20,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  textWindow: {
    height: '100%',
    minHeight: 300,
    width: '100%',
    padding: 20,
    border: '1px solid #ccc',
  }
};

export default Main;
