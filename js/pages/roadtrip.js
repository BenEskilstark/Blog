// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const Thread = require('../Thread.react');
const {useEffect, useState} = React;

PINS = {
  ['Menlo Park, California']: {
    name: 'Menlo Park, California',
    position: {x: 100, y: 100},
    picture: '',
    outgoing: ['Joshua Tree, California'],
  },
  ['Joshua Tree, California']: {
    name: 'Joshua Tree, California',
    position: {x: 200, y: 200},
    picture: '',
    outgoing: ['Sunfair Dry Lake Bed, California'],
  },
  ['Sunfair Dry Lake Bed, California']: {
    name: 'Sunfair Dry Lake Bed, California',
    position: {x: 250, y: 250},
    picture: '',
    outgoing: ['Red Rock Canyon, Nevada'],
  },
  ['Red Rock Canyon, Nevada']: {
    name: 'Red Rock Canyon, Nevada',
    position: {x: 275, y: 275},
    picture: '',
    outgoing: ['Las Vegas, Nevada'],
  },
  ['Las Vegas, Nevada']: {
    name: 'Las Vegas, Nevada',
    position: {x: 300, y: 300},
    picture: '',
    outgoing: ['Spotted Wolf View Area, Utah'],
  },
  ['Spotted Wolf View Area, Utah']: {
    name: 'Spotted Wolf View Area, Utah',
    position: {x: 350, y: 300},
    picture: '',
    outgoing: ['Loveland, Colorado'],
  },
  ['Loveland, Colorado']: {
    name: 'Loveland, Colorado',
    position: {x: 350, y: 350},
    picture: '',
    outgoing: ['Kansas City, Missouri'],
  },
}

const RoadTrip = () => {
  return (
    <div
      style={{
        marginBottom: 500,
      }}
    >
      <h2>Comments:</h2>
      <Thread
        cols={75}
        thread={window.location.pathname}
      />
    </div>
  );
}

ReactDOM.render(
  <RoadTrip />,
  document.getElementById('container'),
);

