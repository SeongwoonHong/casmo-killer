import React, { Component } from 'react';
import ReactRte from 'react-rte';
import classnames from 'classnames';
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
    document.querySelector('#article-form .react-rte').addEventListener('click', () => {
      this.focus();
    });
  }
  componentWillUnmount() {
    document.querySelector('#article-form .react-rte').removeEventListener('click', this.focus);
  }
  onChange = (value) => {
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(
        this.editor.refs.editor.refs.editor.innerHTML
      );
    }
  };
  focus() {
    this.editor._focus();
  }
  render() {
    return (
      <ReactRte
        value={this.state.value}
        onChange={this.onChange}
        ref={el => this.editor = el}
        className={classnames('react-rte', this.props.className)}
      />
    );
  }
}
export default RichTextEditor;
