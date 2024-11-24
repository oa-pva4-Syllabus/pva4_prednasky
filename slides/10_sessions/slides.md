---
#== Layout
theme: default
background: https://cover.sli.dev # https://unsplash.com/collections/94734566/slidev
transition: slide-left #https://sli.dev/guide/animations#slide-transitions
mdc: true # https://sli.dev/guide/syntax#mdc-syntax
selectable: false
codeCopy: false
download: true
hideInToc: true

#== Code Highlighter
highlighter: shiki
lineNumbers: true

#== Dravings https://sli.dev/guide/drawing
drawings:
  persist: false

#== Export Configuration
# use export CLI options in camelCase format https://sli.dev/guide/exporting.html
export:
  format: pdf
  timeout: 30000
  dark: false
  withClicks: false

#== Slide Info
src: '../../pages/index.md'
title: "Sessions"
exportFilename: "10_sessions"
titleTemplate: "PVA4 %s by Adam Fišer"
info: |
  ## PVA4 Programování a vývoj aplikací

  Určeno pouze pro výukové účely

  [Repository](https://github.com/OA-PVA4-Syllabus/pva4_prednasky) / [Prezentace](https://oa-pva4-syllabus.github.io/pva4_prednasky/)

  Created by [Adam Fišer](https://github.com/AdamFiser)
---
layout: default
---

#  Obsah

<Toc :columns="2" minDepth="1" maxDepth="1"></Toc>
---

# Co je session?

- Session je způsob jak udržovat stav mezi jednotlivými požadavky
- Sessions jsou serverové cookie
- Standardní limit pro cookie jsou 4 kB. 
- Session uloží data na webový server (a nebo do databáze) a do prohlížeče klienta uloží identifikátor.
- Podle identifikátoru pozná server, k jakému klientu data patří.
- Uživatel neví, co je v sessions uloženo.

<br>

> Používání sessions na serveru generuje mnoho malých souborů, na které je nutné myslet v rámci údržby a správy aplikace a serveru.


---

# Session v PHP


```php {all|2-4|8-12|16-19|all} {maxHeight:'300px'}
<?php
// nastartování session
// musí být na začátku každého souboru (ideálně v common.php)
session_start();

// ...

// uložení hodnot do session
// pracujeme s superglobální proměnnou $_SESSION
$_SESSION['userId'] = 1;
$_SESSION['user'] = 'Adam';
$_SESSION['role'] = 'admin';

// ...

// zobrazení hodnot
// klasicky přes index
echo $_SESSION['user'];
```

---

# Ukončení session

```php {all|3-4|6-7|9-12|all}
// ...

// odstranění konkrétní hodnoty
unset($_SESSION['user']);

// odstranění všech hodnot
session_unset();

// ukončení session
// odstraní všechny session proměnné, adekvátní k funkci session_start()
// ideální pro zařazení do common footeru
session_destroy();
?>
```

---

# Parametry session

```php
<?php
// nastartování session s vlastními parametry
session_start([
    'cache_limiter' => 'private',
    'cookie_lifetime' => 86400, // 1 den
    'cookie_path' => '/app',
    'cookie_domain' => '.example.com'
]);
```

```php
// alternativně lze parametry nastavit i pomocí funkcí
// musí být nastaveny před spuštěním session
session_cookie_lifetime(86400);
session_cache_limiter('private');
session_set_cookie_params(86400, '/app', '.example.com');

session_start();
```

- `cookie_lifetime` - jak dlouho (v sekundách) bude session cookie platná. Standardně je to 0, což znamená, že cookie se zruší při zavření prohlížeče.
- `cache_limiter` - Nastavuje způsob, jakým bude session řídit cache HTTP. Může nabývat hodnot jako 'nocache', 'private', 'private_no_expire', nebo 'public'. Ovlivňuje, jak bude prohlížeč nebo proxy server pracovat s cache. Například 'nocache' zajišťuje, že obsah nebude uložen do mezipaměti.
- `cookie_path` Nastavuje cestu, ve které je session cookie dostupná. Výchozí hodnota je '/', což znamená, že cookie je dostupná v celé doméně.
- `cookie_domain` Nastavuje doménu, ve které je session cookie dostupná. Výchozí hodnota je '', což znamená, že cookie je dostupná v doméně, ze které byla vytvořena. Používá se k tomu, aby session cookie fungovala na více subdoménách.


Další parametry viz https://www.php.net/manual/en/session.configuration.php


---
src: '../../pages/thanku.md'
---