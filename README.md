# Own Radar

Application to show the own radar data from https://opensky-network.org/.

Example: https://radar.gise.at

## Proxy

To get data from OpenSky Network your need a proxy for the authentification.

proxy.php
```php
<?php
$p = $_GET['p'];
$path = "https://{{Username}}:{{Password}}@opensky-network.org/".$p;
echo file_get_contents($path);
?>
```

## Development

```
npm install
grunt watch
```
