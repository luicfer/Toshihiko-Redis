# Toshihiko-Redis

The redis support for Toshihiko as an addon.

## Installation

```sh
$ npm install toshihiko-redis
```

## How to Use

When you define a Toshihiko, you could pass the object into `cache` option:

```javascript
var T = require("toshihiko");
var toshihiko = new T.Toshihiko("database", "username", "", {
    cache: {
        name: "redis",
        servers: "localhost:6379",
        options: { prefix: "_" }
    }
});
```

> `name` must be `redis` and then Toshihiko will search for the package `toshihiko-redis`.
>
> `servers` may be a string for the server addresses.
>


Otherwise, you may create this object by yourself and pass the created object into cached:

```javascript
var Redis = require("toshihiko-redis");
var object = Redis.create(SERVRES, OPTIONS);
var toshihiko = new T.Toshihiko(DATABASE, USERNAME, PASSWORD, {
    cache: object
});
```

or

```javascript
var Redis = require("toshihiko-redis");
var object = new Redis(SERVRES, OPTIONS);
var toshihiko = new T.Toshihiko(DATABASE, USERNAME, PASSWORD, {
    cache: object
});
```

## DEBUG

use [dubug](https://www.npmjs.com/package/debug) lib
```bash
DEBUG=toshihiko-redis
```

