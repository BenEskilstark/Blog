// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const Thread = require('../Thread.react');
const {useEffect, useState, useMemo} = React;

const pinSize = 50;
const PINS = {
  ['Menlo Park, California']: {
    name: 'Menlo Park, California',
    key: 'menlo_park',
    picture: 'img/menlo_park_1.png',
    position: {x: 115, y: 325},
    outgoing: ['Sunfair Dry Lake Bed, California'],
  },
  ['Sunfair Dry Lake Bed, California']: {
    name: 'Sunfair Dry Lake Bed, California',
    key: 'sunfair_dry_lake',
    position: {x: 225, y: 450},
    picture: 'img/sunfair_dry_lake_1.png',
    outgoing: ['Red Rock Canyon, Nevada'],
  },
  ['Red Rock Canyon, Nevada']: {
    name: 'Red Rock Canyon, Nevada',
    key: 'red_rock_canyon',
    position: {x: 230, y: 365},
    picture: 'img/red_rock_canyon_1.png',
    outgoing: ['Spotted Wolf View Area, Utah'],
  },
  ['Spotted Wolf View Area, Utah']: {
    name: 'Spotted Wolf View Area, Utah',
    key: 'spotted_wolf_utah',
    position: {x: 355, y: 310},
    picture: 'img/spotted_wolf_utah_1.png',
    outgoing: ['Loveland, Colorado'],
  },
  ['Loveland, Colorado']: {
    name: 'Loveland, Colorado',
    key: 'loveland',
    position: {x: 455, y: 315},
    picture: 'img/loveland_1.png',
    outgoing: ['Osborn, Missouri'],
  },
  ['Osborn, Missouri']: {
    name: ['Osborn, Missouri'],
    key: 'osborn_mo',
    position: {x: 700, y: 310},
    picture: 'img/osborn_mo_1.png',
    outgoing: ['Columbus, Ohio'],
  },
  ['Columbus, Ohio']: {
    name: ['Columbus, Ohio'],
    key: 'columbus',
    position: {x: 900, y: 300},
    picture: 'img/columbus_1.png',
    outgoing: ['Woods Hole, Massachusetts', 'Lexington, Kentucky'],
  },
  ['Woods Hole, Massachusetts']: {
    name: ['Woods Hole, Massachusetts'],
    key: 'woods_hole',
    position: {x: 1120, y: 230},
    picture: 'img/woods_hole_1.png',
    outgoing: ['Washington DC', 'Bridgton, Maine'],
  },
  ['Washington DC']: {
    name: ['Washington DC'],
    key: 'washington_dc',
    position: {x: 1000, y: 320},
    picture: 'img/washington_dc_1.png',
    outgoing: [],
  },
  ['Bridgton, Maine']: {
    name: ['Bridgton, Maine'],
    key: 'bridgton_maine',
    position: {x: 1100, y: 150},
    picture: 'img/bridgton_maine_1.png',
    outgoing: [],
  },
  ['Lexington, Kentucky']: {
    name: ['Lexington, Kentucky'],
    key: 'lexington_kentucky',
    position: {x: 875, y: 365},
    picture: 'img/lexington_kentucky_1.png',
    outgoing: ['Ormond Beach, Florida'],
  },
  ['Ormond Beach, Florida']: {
    name: ['Ormond Beach, Florida'],
    key: 'ormond_beach_florida',
    position: {x: 960, y: 585},
    picture: 'img/ormond_beach_florida_1.png',
    outgoing: ['Eastaboga, Alabama'],
  },
  ['Eastaboga, Alabama']: {
    name: ['Eastaboga, Alabama'],
    key: 'eastaboga_alabama',
    position: {x: 850, y: 485},
    picture: 'img/eastaboga_alabama_1.png',
    outgoing: ['New Orleans'],
  },
  ['New Orleans']: {
    name: ['New Orleans'],
    key: 'new_orleans',
    position: {x: 730, y: 570},
    picture: 'img/new_orleans_1.png',
    outgoing: ['New Orleans'],
  },
}

const mapSize = {width: 1200, height: 800};

const RoadTrip = () => {
  const [dims, setDims] = useState({
    width: window.innerWidth, height: window.innerHeight,
  });

  const handleResize = debounce(() => {
    setDims({
      width: window.innerWidth, height: window.innerHeight,
    });
  }, 500);

  const [pins, edges] = useMemo(() => {
    const pins = [];
    let edges = [];
    let i = 0;
    for (const name in PINS) {
      const pin = PINS[name];
      const x = mapSize.width / dims.width;
      const y = mapSize.height / dims.height;
      const adj = {x: pin.position.x / x, y: pin.position.y / y};

      // edges:
      for (const e of pin.outgoing) {
        const epin = PINS[e];
        const eadj = {x: epin.position.x / x, y: epin.position.y / y};
        edges.push({start: adj, end: eadj});
      }

      pins.push(<Pin
        key={"PIN_" + name} pin={pin} adjustedPosition={adj} index={i}
      />);
      i++;
    }

    edges = edges.map(edge => {
      const dist = Math.sqrt(
        (edge.end.x - edge.start.x) * (edge.end.x - edge.start.x) +
        (edge.end.y - edge.start.y) * (edge.end.y - edge.start.y)
      );
      const theta = 2 * Math.PI
        + Math.atan2((edge.end.y - edge.start.y), (edge.end.x - edge.start.x))
        % (2 * Math.PI);
      const deg = 180 * theta / Math.PI;
      return (
        <div
          key={'edge_'+edge.start.x+'_'+edge.start.y+'_'+edge.end.x+'_'+edge.end.y}
          style={{
            border: '1px solid black',
            height: '2px',
            width: dist,
            backgroundColor: 'black',
            position: 'absolute',
            top: edge.start.y + pinSize / 2,
            left: edge.start.x + pinSize / 2,
            transformOrigin: '0 0',
            transform: 'rotate(' + deg + 'deg)',
            WebkitTransform: 'rotate(' + deg + 'deg)',
            OTransform: 'rotate(' + deg + 'deg)',
            msTransform: 'rotate(' + deg + 'deg)',
            MozTransform: 'rotate(' + deg + 'deg)',
          }}
        ></div>
      );
    });
    return [pins, edges];
  }, [dims.width, dims.height]);


  window.addEventListener('resize', handleResize)
  return (
    <div
      style={{
      }}
    >
      <div
        id="MAP"
        style={{
          overflow: 'hidden',
          maxWidth: '100%',
          maxHeight: '100%',
          margin: 'auto',
          marginLeft: 0,
          position: 'relative',
        }}
      >
        <img src='./img/USA.png' width='100%' height='100%' />
        {edges}
        {pins}
        <a
          style={{
            position: 'absolute',
            bottom: 18,
            left: 12,
          }}
          href={'../'}
        >
          Back to Blog
        </a>
      </div>
    </div>
  );
}

const Pin = (props) => {
  const {pin, adjustedPosition, index} = props;

  const img = pin.picture != ''
    ? (<img src={pin.picture} width='100%' height='100%' />)
    : null

  let border = null;
  if (index == 0) {
    border = '2px solid #7CFC00';
  } else if (index == Object.keys(PINS).length - 1) {
    border = '2px solid red';
  }
  return (
    <a className="roadtrip_pin"
      style={{
        borderRadius: '50%',
        position: 'absolute',
        overflow: 'hidden',
        top:  adjustedPosition.y,
        left: adjustedPosition.x,
        border,
      }}
      href={pin.key + '.html'}
    >
      {img}
    </a>
  );
};

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

ReactDOM.render(
  <RoadTrip />,
  document.getElementById('container'),
);

