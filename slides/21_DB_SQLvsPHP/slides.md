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
title: "Databáze SQL vs PHP"
exportFilename: "21_DB_SQLvsPHP"
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

# Připojení k databázovému serveru

- Pro práci s databází je potřeba se připojit k databázovému serveru
- K tomu slouží knihovna `mysqli` (MySQL Improved) 
- Knihovna `mysqli` je součástí PHP od verze 5.0
- Knihovna `mysqli` je založena na starší knihovně `mysql`, která je již zastaralá a nepoužívá se!
- Podpora procedurálního a objektově orientovaného přístupu

```php
// Připojení k databázi
// Údaje ukládáme do samostatného souboru dle přostředí (lokální, testovací, produkční)
$servername = "localhost"; //adresa sql serveru poskytovatele
$username   = "uzivatelskeJmeno";
$password   = "tajne*heslo";
$database   = "nazevDatabaze";
```

<!-- 
My budeme používat procedurální přístup, objektový se naučíme později až budeme probírat OOP.
-->

```php
// Vytvoření spojení na databázi
// Zpravidla v souboru common.php
$conn = mysqli_connect($servername, $username, $password, $database);
```
```php
// Uzavření spojení na databázi
mysqli_close($conn);
```

---

# Ověření připojení k databázi

```php
if (!$conn) {
    // Pokud spojení selže
    // zobrazí chybovou hlášku (pouze pro vývojové účely). Na produkci chyby nikdy nezobrazujeme!
    die("Připojení na databázi selhalo: " . mysqli_connect_error());
}
echo "Připojení na databázi bylo úspěšné!";
```

---

# Dotazy na databázi

```php
// Dotaz na databázový server
$sql = "SELECT * FROM tabulka";

// Výsledek dotazu uložíme do proměnné $result
$result = mysqli_query($conn, $sql);
```

---

# Zpracování výsledků

- `mysqli_num_rows()` - Výpočet počtu řádků výsledku
```php
mysqli_num_rows($result);
```

<v-click>

- `mysqli_fetch_row()` - Výsledky v podobě pole s číselnými indexy
```php
$row = mysqli_fetch_row($result);
```

</v-click>

<v-click>

- `mysqli_fetch_assoc()` - Výsledky v podobě asociativního pole
```php
// Výpis všech řádků výsledku
while($row = mysqli_fetch_assoc($result)) {
    // $row obsahuje asociativní pole s daty odpovídajícímu jednomu řádku výsledku
    // název indexu odpovídá názvu sloupce tabulky $row["sloupecTabulky"]
    echo "ID: " . $row["id"]. " - Jméno: " . $row["jmeno"]. "<br>";
}
```

</v-click>


<!--
Všechny řádky vstupu
- konfigurace údajů
- připojení na db
- sql dotaz a jeho zpracování db
- zpracování výsledků ve formě řádků
- ošetříme situaci, kdy není žádný výsledek
- uzavření spojení

-->



---

# Příklad


```php {all|1-4|6|8-12|15-17|14,18-20|14-20|22|all}
$servername = "localhost"; //adresa sql serveru poskytovatele
$username 	= "uzivatelskeJmeno";
$password 	= "tajne*heslo";
$database	= "nazevDatabaze";

$conn = mysqli_connect($servername, $username, $password, $database);

$sql = "
        SELECT id, jmeno
        FROM uzivatele
        ";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        echo "ID: " . $row["id"]. " - Jméno: " . $row["jmeno"]. "<br>";
    }
} else {
    echo "0 výsledků";
}

mysqli_close($conn);
```



---
src: '../../pages/thanku.md'
---