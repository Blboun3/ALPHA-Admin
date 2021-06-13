# ALPHA-Admin
ALPHA-Admin je admin discord bot. Funguje na základě SQL databází a je připravený pro spuštění a běh na raspberry pi. 
Umí základní funkce moderování serveru, hrát hudbu, generovat welcome message a mnoho dalšího.

## Kontakt
V případě jakýchkoliv dotazů či problémů, se nebojte se mě zeptat přímo na mém discordu Blboun3#0084, mém discord serveru https://discord.gg/HRye3R7F32. Kontakt pomocí mailu je možný také.

## Vlastnosti a funkce
Bot umí většinu základních funkcí, co by měl admin bot umět, navíc umí hrát hudbu!

### Obecné funkce

* ##### Statisky serveru
  Bot umí automaticky upravovat dva voice kanály tak, aby jeden ukazoval stáří serveru a druhý počet uživatelů na serveru

  ![screenshot_20210613_160019](https://user-images.githubusercontent.com/62328614/121810352-cf31b480-cc60-11eb-9602-bfa4e1790809.png)

* ##### Pravidla
  Bot umí pomocí příkazu `!rules` zobrazit standartní discord pravidla

  ![screenshot_20210613_160428](https://user-images.githubusercontent.com/62328614/121810386-f8524500-cc60-11eb-9112-93f09019966d.png)

* ##### Verifikace
  Pokud se připojí někdo nový, bot umí zjistit, jestli je to skutečný člověk pomocí jednoduchého úkolu.

  ![image](https://user-images.githubusercontent.com/62328614/121810562-b4137480-cc61-11eb-8a47-7f1238a12228.png)

* ##### Welcome message
  Když se někdo připojí a projde verifikací, bot ho umí přivítat v předem nastaveném textovém kanálu, pomocí vygenerování obrázku a napsání základní zprávy

  ![image](https://user-images.githubusercontent.com/62328614/121810458-45ceb200-cc61-11eb-87e9-937f31e0b72b.png)

* ##### Automatické role
  Důležitou funkcí pro spoustu serverů může být automatické udělování rolí přes reakce

  ![image](https://user-images.githubusercontent.com/62328614/121810616-e02ef580-cc61-11eb-95c9-cfec5b9ff936.png)
  
* ##### Zobrazení informací o uživatelích 
  Pomocí příkaz `!user-info` je možné zobrazhit si podrobnější informace o daném uživately
  
  ![image](https://user-images.githubusercontent.com/62328614/121812617-c5ac4a80-cc68-11eb-88ca-2b0c9d4c2ddb.png)

### Hudební funkce
* ##### Hraní hudby
  ![image](https://user-images.githubusercontent.com/62328614/121810834-985c9e00-cc62-11eb-90f2-b535987e6643.png)
* ##### Playlisty
  ![image](https://user-images.githubusercontent.com/62328614/121812316-aeb92880-cc67-11eb-970b-69b463151537.png)
* ##### Zobrazení informací o právě hrající skladbě
  ![image](https://user-images.githubusercontent.com/62328614/121812266-86c9c500-cc67-11eb-881e-d68e4134defa.png)
* ##### Filtry
  ![image](https://user-images.githubusercontent.com/62328614/121812327-b973bd80-cc67-11eb-8a4e-df261fa8ef0e.png)
* ##### Smysluplné error hlášky 😎
  ![image](https://user-images.githubusercontent.com/62328614/121812461-1ec7ae80-cc68-11eb-85af-1a0eea35c513.png)
  
## Instalace, závislosti a spouštění
Běh discord bota je závislý na Node.js v12, a to ideálně v12.22.11 a npm v6.14.12. Další nezbytonstí je možnost spojení s SQL databází, ať už je to na stejném stroji, nebo stroji jiném. 

Pokud si chcete bota spusti sami a nevyužít package, tu jsou soubory, které by se vám mohli hodit. Další co k tomu budete potřebovat, je kopie kódu z tohoto githubu. Výhodou je, že se jedná o nejnovějsí kód, který často není v package.zip, ale nemusí být vždy stejně dobře funkční jako stabilní vydaný kód.
* SQL pro vytvoření databáze:
  [ALPHA.txt](https://github.com/Blboun3/ALPHA-Admin/files/6644128/ALPHA.txt)
  > Poznámka: 
  > Je nezbytně nutné upravit soubor ALPHA.txt, je tam pár hodnot, které je nutné doplnit pro správný chod discord bota
* .env soubor s nastavením:
  [env.txt](https://github.com/Blboun3/ALPHA-Admin/files/6644130/env.txt)
 
 Dalším krokem instalace, je instalování všech npm modulů pomocí `npm install`, tím by se měly nainstalovat všechny nezbytné knihovny.
 
 Spuštění bota doporučuji pomocí příkazu `nodemon .` (pokud je nainstalovaný pomocí `npm install nodemon -g`) nebo `node .` v root složce projektu.
 Ideální a jediný správný výstup:
 
 ![image](https://user-images.githubusercontent.com/62328614/121813191-3bb1b100-cc6b-11eb-8aca-83f87b9c79aa.png)

  > Pokud discord bota budete spouště na Raspberry pi, nebo jakémkoliv linuxovém systém a chcete, aby se discord bot automaticky spustil při každém spuštění systému, doporučuji přidat `@reboot sleep 30 && cd /cesta/kde/je/discord/bot && node app.js > /cesta/k/output/logu/log.txt` do crontabu (pomocí `sudo crontab -e`, sudo není nezbytně nutné). Toto po doplnění (cesta k app.js a cesta k log.txt) spustí discord bota a uloží výstup do souboru log.txt
