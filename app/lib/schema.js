import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

/**
 * @typedef {object} Activity
 * @property {number} id
 * @property {string} time
 * @property {string} activity
 * @property {string} location
 * @property {'sightseeing'|'culture'|'food'|'relax'|'adventure'|'transport'|'other'} type
 */

/**
 * @typedef {object} Day
 * @property {number} id
 * @property {string} date - ISO date string
 * @property {Activity[]} activities
 */

/**
 * @typedef {object} Itinerary
 * @property {string} destination
 * @property {string} startDate - ISO date string
 * @property {string} endDate - ISO date string
 * @property {number} travelers
 * @property {string} interests
 * @property {string} summary
 * @property {string} image - URL
 * @property {Day[]} days
 */

export const ItinerarySchema = {
  type: 'object',
  properties: {
    destination: { type: 'string' },
    startDate: { type: 'string', format: 'date' },
    endDate: { type: 'string', format: 'date' },
    travelers: { type: 'integer', minimum: 1 },
    interests: { type: 'string' },
    summary: { type: 'string' },
    image: { type: 'string', format: 'uri' },
    days: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          date: { type: 'string', format: 'date' },
          activities: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                time: { type: 'string' },
                activity: { type: 'string' },
                location: { type: 'string' },
                type: { enum: ['sightseeing', 'culture', 'food', 'relax', 'adventure', 'transport', 'other'] },
              },
              required: ['id', 'time', 'activity', 'location', 'type'],
            },
          },
        },
        required: ['id', 'date', 'activities'],
      },
    },
  },
  required: ['destination', 'startDate', 'endDate', 'travelers', 'summary', 'image', 'days'],
  additionalProperties: true,
};

export const FlightSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    airline: { type: 'string' },
    flightNumber: { type: 'string' },
    departure: { type: 'string', format: 'date-time' },
    arrival: { type: 'string', format: 'date-time' },
    duration: { type: 'string' },
    price: { type: 'number' },
    currency: { type: 'string' },
    stops: { type: 'integer' },
    meta: { type: 'object' },
  },
  required: ['id', 'airline', 'departure', 'arrival', 'price'],
};

export const validateItinerary = ajv.compile(ItinerarySchema);
export const validateFlight = ajv.compile(FlightSchema);