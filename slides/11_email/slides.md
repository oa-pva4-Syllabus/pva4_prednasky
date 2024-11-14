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
title: "Email"
exportFilename: "11_email"
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

# Použití emailových zpráv

- Nákladově efektivní způsob, jak upozornit uživatele na důležité události.
- Zasílání zpráv skrze kontaktní formuláře.
- Pro vývojáře upozornění na chyby v aplikaci.
- Zasílání aktivačních odkazů pro potvrzení emailové adresy.
- Zasílání odkazů pro obnovení hesla.
- Není doporučeno pro mailing.



---

# Hlavičky emailu

| Hlavička | Popis | Příklad                                  |
| --- | --- |------------------------------------------|
| `From` | Adresa odesílatele | `From: mojeAplikace@wanex.cz`            |
| `To` | Adresa příjemce | `To: prijemce@gmail.com`                 |
| `Bcc` | Skrytá kopie | `Bcc: skrytaKopie@gmail.com`             |
| `Reply-To` | Adresa pro odpověď | `Reply-To: odpoved@mail.cz`            |
| `Subject` | Předmět zprávy | `Subject: Aktivace účtu`                 |
| `Content-Type` | Typ obsahu | `Content-Type: text/html; charset=utf-8` |
| `Content-Transfer-Encoding` | Kódování obsahu | `Content-Transfer-Encoding: 8bit`        |
| `MIME-Version` | Verze MIME | `MIME-Version: 1.0`                      |
|`Return-Path` | Návratová adresa | `Return-Path: helpdesk@wanex.cz`         |
| `X-Mailer` | Informace o odesílateli | `X-Mailer: PHP/8.1`                      |
| `X-Priority` | Priorita zprávy | `X-Priority: 1`                          |
| `X-MSMail-Priority` | Priorita zprávy | `X-MSMail-Priority: High`                |
| `Date` | Datum odeslání | `Date: Mon, 11 Nov 2024 12:00:00 +0100`  |

---

# Hlavičky emailu

```php
// Obecně hlavičky nejsou povinné
// Pokud chcete posílat HTMl emaily, musí být nastaveno
$hlavicky[] = 'MIME-Version: 1.0';
$hlavicky[] = 'Content-type: text/html; charset=windows-1250';

// Další hlavičky
$hlavicky[] = 'To: Příjemce <prijemce@example.cz>, Druhý příjemce <druhy@example.cz>';
$hlavicky[] = 'From: Moje Aplikace <moje@aplikace.cz>';
$hlavicky[] = 'Cc: kopie@example.com';
$hlavicky[] = 'Bcc: skryta@kopie.cz';
```

---

# `mail()`

```php

$emailPrijemce = 'muj@email.com';
$predmet = 'Předmět emailové zprávy';
$obsah = 'Obsah zprávy';

// Základní poslání
mail($emailPrijemce, $predmet, $obsah, implode("\r\n", $hlavicky));
    
```

---

# Emaily na vývoji

- Pro vývoj je vhodné nastavit `Return-Path` na email, který je schopen přijímat emaily.
- Vývojové prostředí může být blokováno kvůli špatně nastaveným emailům.
- Pro vývoj je vhodné použít nástroje jako Mailtrap, Papercut SMTP,...

## Papercut SMTP
- Vyžaduje .NET 8+ Desktop Runtime - https://dotnet.microsoft.com/en-us/download/dotnet/8.0
- https://github.com/ChangemakerStudios/Papercut-SMTP
- stáhnout z poslední release portable verzi a spustit (Pokud chcete používat pravidelně, stáhnout instalátor)
- 

---

# Nastavení php.ini

- Pro odesílání emailů je nutné mít nastavený SMTP server.
- Nastavení se provádí v souboru `php.ini`

```ini
[mail function]
; For Win32 only.
; http://php.net/smtp
SMTP = localhost
; http://php.net/smtp-port
smtp_port = 25

; Je-li posílání přes externí server, vyplnit
; pro authorizované smtp
auth_username = uzivatel@domena.cz
auth_password = mojeTajneHeslo
```

---
src: '../../pages/thanku.md'
---