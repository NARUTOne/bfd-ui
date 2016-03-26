import 'bfd-bootstrap'
import React, { PropTypes, Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

/**
 * 获取浏览器滚动条的宽度，模态框打开时隐藏 body 滚动条
 */
const scrollbarWidth = (() => {
  const scrollDiv = document.createElement('div')
  const body = document.body

  scrollDiv.className = 'modal-scrollbar-measure'
  body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  body.removeChild(scrollDiv)
  
  return scrollbarWidth
})()


const childContextTypes = {
  /**
   * 响应 ModelHeader 关闭点击事件
   */
  handleClose: PropTypes.func
}

const Modal = React.createClass({
  getInitialState() {
    return {
      isOpen: false    
    }
  },

  getChildContext() {
    return {
      handleClose: this.close
    }
  },
  
  handleClick(e) {
    if (e.target.className.indexOf('modal-backdrop') !== -1) {
      this.close()
    }
  },

  open() {
    this.setState({isOpen: true})
  },

  close() {
    this.setState({isOpen: false})
  },

  componentDidMount() {
    this.bodyClassName = document.body.className
    this.bodyPaddingRight = parseInt(document.body.style.paddingRight, 10) || 0
  },

  componentWillUpdate(nextProps, nextState) {
    const body = document.body
    if (nextState.isOpen) {
      body.className = this.bodyClassName + ' modal-open'
      body.style.paddingRight = this.bodyPaddingRight + scrollbarWidth + 'px'
    } else {
      setTimeout(() => {
        body.className = this.bodyClassName
        if (this.bodyPaddingRight) {
          body.style.paddingRight = this.bodyPaddingRight + 'px'
        } else {
          body.style.paddingRight = ''
        }
      }, 300)
    }
  },

  render() {
    return (
      <ReactCSSTransitionGroup transitionName="in" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
        {this.state.isOpen ? (
          <div className="modal">
            <div className="modal-backdrop" onClick={this.handleClick}></div>
            <div className="modal-dialog">
              <div className="modal-content">
                {this.props.children}
              </div>
            </div>
          </div>
        ) : null}
      </ReactCSSTransitionGroup>
    )
  }
})

Modal.childContextTypes = childContextTypes

export default Modal