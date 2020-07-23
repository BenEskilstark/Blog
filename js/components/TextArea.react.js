const React = require('React');

/**
 * Props:
 *  - value: str,
 *  - placeholder: ?str
 *  - onChange: (str) => void
 *  - style: Object
 *  - rows: ?number
 *  - cols: ?number
 */
const TextArea = (props) => {
  const {value, placeholder, onChange, rows, cols} = props;
  const style = props.style != null ? props.style : {};

  const defaultRows = 4;
  const defaultCols = 60;

  return (
    <textarea
      style={style}
      placeholder={placeholder}
      value={value}
      rows={rows != null ? rows : defaultRows}
      cols={cols != null ? cols : defaultCols}
      onChange={(ev) => {
        onChange(ev.target.value);
      }}
    />

  );
};

module.exports = TextArea;
