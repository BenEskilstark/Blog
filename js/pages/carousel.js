// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const {useEffect, useState, useMemo} = React;

// TODO: this is a hack
const maxPics = {
  menlo_park: 1,
  sunfair_dry_lake: 11,
  red_rock_canyon: 12,
  spotted_wolf_utah: 5,
  loveland: 4,
  osborn_mo: 3,
  columbus: 4,
  woods_hole: 6,
  washington_dc: 1,
};

const Carousel = () => {
  const [dims, setDims] = useState({
    width: window.innerWidth, height: window.innerHeight,
  });

  const handleResize = debounce(() => {
    setDims({
      width: window.innerWidth, height: window.innerHeight,
    });
  }, 500);

  window.addEventListener('resize', handleResize)

  const key = getKey();
  const pictures = useMemo(() => {
    const pictures = [];
    for (let i = 0; i < maxPics[key]; i++) {
      try {
        const imgURL = getImageURL(i);
        pictures.push(
          <div
            style={{
              display: 'inline',
            }}
          >
            <img
              onError={() => {
                const slf = document.getElementById('img_' + imgURL);
                if (slf != null) slf.height = 0;
              }}
              id={"img_" + imgURL}
              alt=""
              height="100%"
              src={imgURL}
            />
          </div>
        );
      } catch (e) {
        console.log(e);
      }
    }
    return pictures;
  }, []);

  const [index, setIndex] = useState(0);

  // handle key press
  useEffect(() => {
    document.onkeydown = (ev) => {
      if (ev.keyCode == 37) { // left
        goToNextImage(index, -1, setIndex)
      } else if (ev.keyCode == 39) { // right
        goToNextImage(index, 1, setIndex)
      }
    }
    return () => document.onkeydown = null;
  }, [index]);

  return (
    <div
      style={{
        marginLeft: '25%',
        marginBottom: 20,
        height: 500,
      }}
    >
      {pictures[index]}
      <div>
        <Button label="Previous" onClick={() => goToNextImage(index, -1, setIndex)} />
        <Button label="Next" onClick={() => goToNextImage(index, 1, setIndex)} />
      </div>
    </div>
  );
}

function goToNextImage(index, increment, setIndex) {
  const key = getKey();
  let nextIndex = (index + increment) % maxPics[key];
  if (nextIndex < 0) {
    nextIndex = maxPics[key] - 1;
  }

  setIndex(nextIndex);
}

function getKey() {
  const url = window.location.pathname;
  const key = url.substring(url.lastIndexOf('/')+1).slice(0, -5);
  return key;
}

function getImageURL(i) {
  const key = getKey();
  const imgURL = 'img/' + key + '_' + (i+1) + '.png';
  return imgURL;
}

function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}

function Button(props) {
  const id = props.id || props.label;

  const touchFn = () => {
    if (props.onMouseDown != null) {
      props.onMouseDown();
    } else {
      props.onClick();
    }
  }
  const [intervalID, setIntervalID] = useState(null);

  const depressedStyle = props.depressed ? {
    color: 'rgba(16, 16, 16, 1)',
    backgroundColor: 'rgba(239, 239, 239, 0.3)',
    borderColor: 'rgba(118, 118, 118, 0.3)',
    borderRadius: '2px',
    border: '1px solid',
    paddingTop: '2px',
    paddingBottom: '2px',
  } : {};

  const highlightedStyle = props.highlighted ? {
    color: 'rgba(10, 118, 10, 0.3)',
    borderColor: 'rgba(10, 118, 10, 0.3)',
    borderRadius: '2px',
    border: '2px solid',
    paddingTop: '2px',
    paddingBottom: '2px',
  } : {};

  return (
    <button type="button"
      style={{
        touchAction: 'initial',
        fontSize: '18px',
        ...props.style,
        ...depressedStyle,
        ...highlightedStyle,
      }}
      key={id || label}
      className={props.disabled || props.depressed ? 'buttonDisable' : ''}
      id={props.id || id.toUpperCase() + '_button'}
      onClick={(ev) => {
        if (props.disabled) return false;
        ev.preventDefault();
        if (props.onClick) {
          props.onClick(ev);
        }
        return false;
      }}
      onTouchStart={(ev) => {
        ev.preventDefault();
        if (intervalID) {
          console.log("already in interval, clearing");
          clearInterval(intervalID);
          setIntervalID(null);
        }
        touchFn();
        // HACK: if it's any of these 4 buttons, then allow repeating
        if (
          props.label == 'Bite (E)' || props.label == 'Follow (F)' || props.label == 'Dig (R)'
          || props.label == 'Alert (F)'
        ) {
          const interval = setInterval(touchFn, 120);
          setIntervalID(interval);
        }
      }}
      onTouchEnd={(ev) => {
        ev.preventDefault();
        clearInterval(intervalID);
        setIntervalID(null);
        props.onMouseUp;
      }}
      onTouchCancel={(ev) => {
        clearInterval(intervalID);
        setIntervalID(null);
        props.onMouseUp;
      }}
      onTouchMove={(ev) => {
        ev.preventDefault();
      }}
      onMouseDown={(ev) => {
        ev.preventDefault();
        if (intervalID) {
          console.log("already in interval, clearing");
          clearInterval(intervalID);
          setIntervalID(null);
        }
        if (!props.onMouseDown) return false;

        props.onMouseDown();
        // HACK: if it's any of these 4 buttons, then allow repeating
        if (
          props.label == 'Bite (E)' || props.label == 'Follow (F)' || props.label == 'Dig (R)'
          || props.label == 'Alert (F)'
        ) {
          const interval = setInterval(props.onMouseDown, 120);
          setIntervalID(interval);
        }
      }}
      onMouseUp={(ev) => {
        clearInterval(intervalID);
        setIntervalID(null);
        if (props.onMouseUp) {
          props.onMouseUp();
        }
      }}
      disabled={props.disabled}
    >
      {props.label}
    </button>
  );
}

ReactDOM.render(
  <Carousel />,
  document.getElementById('carousel'),
);

