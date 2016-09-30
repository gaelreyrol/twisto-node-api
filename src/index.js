import request from 'superagent';
import { parseString as xmlParse } from 'xml2js';
import moment from 'moment';

const TWISTO_ENDPOINT = 'http://timeo3.keolis.com/relais/147.php';

export default class Twisto {
  constructor() {

  }

  _parseConvertedXmlResponseError(xml) {
    const error = (xml.erreur && xml.erreur[0]) ? xml.erreur[0] : null;

    if (!error) {
      return null;
    }

    if (error['$'] && error['$'].code === '000') {
      return null;
    }

    return (error['$']) ? error['$'] : null;
  }

  _capitalize(str) {
    let newString = str.toLowerCase();

    return newString.charAt(0).toUpperCase() + newString.slice(1);
  }

  getLines() {
    return new Promise((resolve, reject) => {
      request.get(TWISTO_ENDPOINT).query({
        xml: 1
      }).end((err, res) => {
        if (err) {
          reject(err);
        } else {

          let body = null;

          const sync = function *() {

            try {

              xmlParse(res.text, {
                trim: true,
                explicitArray: false
              }, (err, data) => {
                if (data && !err) {
                  body = data;
                } else {
                  throw new Error('Invalid XML data');
                }
              });

            } catch (e) {
              reject(e);
            }

            yield body;
          };

          sync().next();

          const xmlError = this._parseConvertedXmlResponseError(body.xmldata);
          if (xmlError) {
            reject(xmlError);
          }

          if (!body.xmldata.alss || !body.xmldata.alss.als) {
            reject(new Error('Invalid Response format'));
          }

          const sanitizedLines = body.xmldata.alss.als.map((line) => {
            return line.ligne;
          });

          const reformatedLines = sanitizedLines.map((line) => {
            if (!line) {
              return ;
            }

            const newLine = {
              code: line.code,
              name: line.nom.charAt(0).toUpperCase() + line.nom.slice(1),
              color: parseInt(line.couleur, 10).toString(16),
              endpoints: {
                A: null,
                R: null,
              }
            };

            if (line.sens === 'A') {
              newLine.endpoints.A = this._capitalize(line.vers);
            }

            if (line.sens === 'R') {
              newLine.endpoints.R = line.vers;
            }

            for (let i = 0; i < sanitizedLines.length; i++) {
              if (sanitizedLines[i].code === newLine.code) {
                if (sanitizedLines[i].sens === 'A' && !newLine.endpoints.A) {
                  newLine.endpoints.A = this._capitalize(sanitizedLines[i].vers);
                  sanitizedLines.splice(i, 1);
                }

                if (sanitizedLines[i].sens === 'R' && !newLine.endpoints.R) {
                  newLine.endpoints.R = this._capitalize(sanitizedLines[i].vers);
                  sanitizedLines.splice(i, 1);
                }
              }
            }

            return newLine;
          });

          const cleanedLines = reformatedLines.filter((line) => {
            if (line) {
              return true;
            }

            return false;
          });

          resolve(cleanedLines);
        }
      });
    });
  }

  getBusStopsByLine(code, endpoint) {
    return new Promise((resolve, reject) => {
      request.get(TWISTO_ENDPOINT).query({
        ligne: code,
        sens: endpoint,
        xml: 1
      }).end((err, res) => {
        if (err) {
          reject(err);
        } else {

          let body = null;

          const sync = function *() {

            try {

              xmlParse(res.text, {
                trim: true,
                explicitArray: false
              }, (err, data) => {
                if (data && !err) {
                  body = data;
                } else {
                  throw new Error('Invalid XML data');
                }
              });

            } catch (e) {
              reject(e);
            }

            yield body;
          };

          sync().next();

          const xmlError = this._parseConvertedXmlResponseError(body.xmldata);
          if (xmlError) {
            reject(xmlError);
          }

          if (!body.xmldata.alss || !body.xmldata.alss.als) {
            reject(new Error('Invalid Response format'));
          }

          const sanitizedBusStops = body.xmldata.alss.als.map((busStop) => {
            const newBusStop = {
              code: busStop.arret.code,
              name: this._capitalize(busStop.arret.nom),
              reference: busStop.refs
            };

            return newBusStop;
          });

          resolve(sanitizedBusStops);
        }
      });
    });
  }

  getNextBusesByBusStop(reference) {
    return new Promise((resolve, reject) => {
      request.get(TWISTO_ENDPOINT).query({
        refs: reference,
        ran: 1,
        xml: 3
      }).end((err, res) => {
        if (err) {
          reject(err);
        } else {

          let body = null;

          const sync = function *() {

            try {

              xmlParse(res.text, {
                trim: true,
                explicitArray: false
              }, (err, data) => {
                if (data && !err) {
                  body = data;
                } else {
                  throw new Error('Invalid XML data');
                }
              });

            } catch (e) {
              reject(e);
            }

            yield body;
          };

          sync().next();

          const xmlError = this._parseConvertedXmlResponseError(body.xmldata);
          if (xmlError) {
            reject(xmlError);
          }

          if (!body.xmldata.horaires
          || !body.xmldata.horaires.horaire
          || !body.xmldata.horaires.horaire.passages
          || !body.xmldata.horaires.horaire.passages.passage) {
            reject(new Error('Invalid Response format'));
          }

          const nextBuses = body.xmldata.horaires.horaire.passages.passage;

          const sanitizedNextBuses = nextBuses.map((nextBus) => {
            const datetime = moment().hours(nextBus.duree.split(':')[0]).minutes(nextBus.duree.split(':')[1]).toDate();

            return datetime;
          });

          resolve(sanitizedNextBuses);
        }
      });
    });
  }
}
