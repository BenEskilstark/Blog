const React = require('react');

// props:
// id: ?string
// label: string
// onClick: () => void
// onMouseDown: optional () => void
// onMouseUp: optional () => void
// disabled: optional boolean
// style: optional Object

class Button extends React.Component {

  componentWillUnmount() {
    // document.onkeydown = null;
  }

  render() {
    const {props} = this;
    const id = props.id || props.label;

    return (
      <button type="button"
        style={{
          touchAction: 'initial',
          fontSize: '18px',
          ...props.style,
        }}
        key={id || label}
        className={'fancyButton'}
        id={id.toUpperCase() + '_button'}
        onClick={props.disabled ? () => {} : props.onClick}
        onTouchStart={props.onMouseDown}
        onTouchEnd={props.onMouseUp}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        disabled={props.disabled}
      >
        {props.label}
      </button>
    );
  }
}

module.exports = Button;
