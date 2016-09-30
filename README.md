# twisto-node-api
Implémentation de l'API Twisto pour NodeJs

### Utilisation

Installation avec npm :
```bash
npm install --save twisto-node-api
```

Installation avec bower :
```bash
ToDo
```

Puis instancier la classe ```Twisto```.
```javascript
// es5
var Twisto = require('twisto-node-api');

var twst = new Twisto();

// es6
import Twisto from 'twisto-node-api';

const twst = new Twisto();
```

### API
Les méthodes suivent retourne une ```Promise``` donc il est possible de les chaîner.

```javascript
import Twisto from 'twisto-node-api';

const twst = new Twisto();
twst.getLines()
  .then((res) => {

    return twst.getBusStopsByLine(res[1].code, 'A');
  })
  .then((res) => {

    return twst.getNextBusesByBusStop(res[1].reference);
  })
  .then((res) => {

    console.log(res);
  })
  .catch((err) => {

    console.error(err);
  });
```

- ```getLines``` - Retourne un tableau des lignes de bus et tram disponibles.
- ```getBusStopsByLine``` Retourne un tableau des arrêts de bus de la ligne.
- ```getNextBusesByBusStop``` Retourne un tableau des deux prochaines bus arrivant à l'arrêt.
