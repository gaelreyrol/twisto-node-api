# twisto-node-api
Implémentation de l'API Twisto pour NodeJs

Version stable : ```0.1.0```

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
Les méthodes retournent une ```Promise``` il est donc possible de les chaîner.

View online documentation =>  [zevran.github.io/twisto-node-api](http://zevran.github.io/twisto-node-api)

### ToDo

 - [x] Publish first pre-release
 - [x] Improve documentation
 - [ ] Implement unit testing

### Credits

Merci à @outadoc pour ce [précieux gist](https://gist.github.com/outadoc/40060db45c436977a912)
