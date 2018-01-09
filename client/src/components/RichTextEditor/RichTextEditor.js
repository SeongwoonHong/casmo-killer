import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import ReactRte from 'react-rte';
// import { stateToHTML } from 'draft-js-export-html';
import './RichTextEditor.scss';

class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value ?
        ReactRte.createValueFromString(this.props.value, 'html') :
        ReactRte.createEmptyValue()
    };
  }
  componentDidMount() {
    // console.log('this.props.value');
    // console.log(this.props.value);
  }
  onChange = (value) => {
    // console.log(value);
    this.setState({ value });
    // const htmlPre = '<!DOCTYPE html><html><body><div data-contents="true">';
    // const htmlPost = '</div></body></html>';
    // this.props.onChange(value.toString('html'));
    if (this.props.onChange) {
      this.props.onChange(
        this.editor.refs.editor.refs.editor.innerHTML
      )
    }
    // this.props.onChange(this.editor.refs.editor.refs.editor.innerHTML);
    // console.log(this.editor.refs.editor.refs.editor.innerHTML);
  };
  render() {
    return (
      <ReactRte
        value={this.state.value}
        onChange={this.onChange}
        ref={el => this.editor = el}
        className="react-rte"
      />
    );
  }
}
export default RichTextEditor;
