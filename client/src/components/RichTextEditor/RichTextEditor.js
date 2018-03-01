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
    // console.log('this.props.value');
    // console.log(this.props.value); 여기에있는 코멘트 한것들 지금 있는 버그 나중에 잡으려고 안지웠음.
    document.querySelector('#article-form .react-rte').addEventListener('click', () => {
      this.focus();
    });
  }
  componentWillUnmount() {
    document.querySelector('#article-form .react-rte').removeEventListener('click', this.focus);
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
      );
    }
    // this.props.onChange(this.editor.refs.editor.refs.editor.innerHTML);
    // console.log(this.editor.refs.editor.refs.editor.innerHTML);
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
