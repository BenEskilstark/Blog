// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const Thread = require('../Thread.react');
const {useEffect, useState} = React;

const PINS = {
  ['Menlo Park, California']: {
    name: 'Menlo Park, California',
    picture: 'img/day0-2.png',
    position: {x: 115, y: 465},
    outgoing: ['Joshua Tree, California'],
  },
  ['Joshua Tree, California']: {
    name: 'Joshua Tree, California',
    position: {x: 190, y: 550},
    picture: 'img/day1-2.png',
    outgoing: ['Sunfair Dry Lake Bed, California'],
  },
  ['Sunfair Dry Lake Bed, California']: {
    name: 'Sunfair Dry Lake Bed, California',
    position: {x: 225, y: 590},
    picture: 'img/day0-2.png',
    outgoing: ['Red Rock Canyon, Nevada'],
  },
  ['Red Rock Canyon, Nevada']: {
    name: 'Red Rock Canyon, Nevada',
    position: {x: 230, y: 525},
    picture: 'img/day3-1.png',
    outgoing: ['Las Vegas, Nevada'],
  },
  ['Las Vegas, Nevada']: {
    name: 'Las Vegas, Nevada',
    position: {x: 255, y: 550},
    picture: 'img/day3-2.jpg',
    outgoing: ['Spotted Wolf View Area, Utah'],
  },
  ['Spotted Wolf View Area, Utah']: {
    name: 'Spotted Wolf View Area, Utah',
    position: {x: 355, y: 490},
    picture: '',
    outgoing: ['Loveland, Colorado'],
  },
  ['Loveland, Colorado']: {
    name: 'Loveland, Colorado',
    position: {x: 455, y: 475},
    picture: '',
    outgoing: ['Osborn, Missouri'],
  },
  ['Osborn, Missouri']: {
    name: ['Osborn, Missouri'],
    position: {x: 680, y: 485},
    picture: '',
    outgoing: [],
  },
}

const RoadTrip = () => {
  const pins = [];
  for (const name in PINS) {
    const pin = PINS[name];
    pins.push(<Pin key={"PIN_" + name} pin={pin} />);
  }

  return (
    <div
      style={{
        marginBottom: 500,
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          maxWidth: 1200,
          maxHeight: 700,
          margin: 'auto',
          marginLeft: 0,
        }}
      >
        <img src='./img/USA.png' width='100%' height='100%' />
      </div>
      {pins}
    </div>
  );
}

const Pin = (props) => {
  const {pin} = props;

  const width = 50;
  const height = 50;

  const img = pin.picture != ''
    ? (<img src={pin.picture} width='100%' height='100%' />)
    : null

  return (
    <div className="roadtrip_pin"
      style={{
        borderRadius: '50%',
        position: 'absolute',
        overflow: 'hidden',
        top: pin.position.y,
        left: pin.position.x
      }}
    >
      {img}
    </div>
  );
};

ReactDOM.render(
  <RoadTrip />,
  document.getElementById('container'),
);

