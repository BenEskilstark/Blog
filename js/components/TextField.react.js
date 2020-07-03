const React = require('React');

/**
 * Props:
 *  - value: str,
 *  - placeholder: ?str
 *  - password: ?boolean
 *  - onChange: (str) => void
 */
const TextField = (props) => {
  const {value, placeholder, password, onChange} = props;
  return (
    <input
      placeholder={placeholder}
      type={password ? 'password' : 'text'}
      value={value}
      onChange={(ev) => {
        onChange(ev.target.value);
      }}
    />

  );
};

module.exports = TextField;
