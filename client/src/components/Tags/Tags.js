import React, { Component } from 'react';
import TransitionGroup from 'react-transition-group-plus';
import PropTypes from 'prop-types';
import Tag from './Tag/Tag';
import './Tags.scss';

const delimeters = [',', ' '];
class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      inputInitialSize: 5
    };
  }
  componentWillMount = () => {
    if (this.props.tags.trim()) {
      this.setState({
        tags: this.props.tags.trim().split(' ')
      });
    }
  }
  onChange = (e) => {
    const inputValue = e.target.value;
    const lastChar = inputValue[inputValue.length - 1];
    if (inputValue.length > this.state.inputInitialSize) {
      this.setState({ inputInitialSize: inputValue.length });
    }
    if (delimeters.includes(lastChar)) {
      const delimeterIndex = delimeters.indexOf(lastChar);
      const tag = this.splitByDelimeter(inputValue, delimeters[delimeterIndex]);
      if (tag.trim() && this.state.tags.indexOf(tag) === -1 && this.props.input.value.trim().split(' ').indexOf(tag) === -1) {
        this.state.tags.push(tag);
        this.props.input.onChange(this.props.input.value.concat(`${tag} `));
        this.setState(this.state);
      }
      e.target.value = '';
    }
  }
  onDeleteTagHandler = (index) => {
    this.props.input.onChange(
      this.props.input.value
        .trim()
        .split(' ')
        .filter((tag) => {
          return tag !== this.state.tags[index];
        })
        .join(' ')
        .concat(' ')
    );
    this.state.tags.splice(index, 1);
    this.setState(this.state);
  };
  focusOnInput = () => {
    this.component.querySelector('.tags-input').focus();
  }
  splitByDelimeter = (str, delimeter = ',') => {
    return str.split(delimeter)[0];
  }
  render() {
    const {
      input, label, type, fieldClass, meta: {
        error
      }
    } = this.props;
    return (
      <div
        onClick={this.focusOnInput}
        ref={el => this.component = el}
        onKeyDown={() => {}}
        role="presentation"
      >
        <span>
          <TransitionGroup>
            {
                this.state.tags.filter(cat => cat.trim() !== '')
                  .map((tag, i) => {
                    return (
                      <Tag
                        tag={tag}
                        key={tag}
                        index={i}
                        onDeleteTagHandler={this.onDeleteTagHandler}
                      />
                    );
                })
            }
          </TransitionGroup>
        </span>
        <input
          type={type}
          onChange={this.onChange}
          id={input.name}
          placeholder="tags"
          className="tags-input"
          size={this.state.inputInitialSize}
        />
        <label htmlFor={input.name} data-error={error} className={fieldClass}>{label}
        </label>
      </div>
    );
  }
}
Tags.defaultProps = {
  input: {
    name: ''
  },
  type: 'text',
  label: 'label',
  fieldClass: '',
  meta: {
    error: ''
  }
};

Tags.propTypes = {
  input: PropTypes.object,
  type: PropTypes.string,
  label: PropTypes.string,
  fieldClass: PropTypes.string,
  meta: PropTypes.object
};

export default Tags;
