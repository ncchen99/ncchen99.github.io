---
title: 💦簡易 Dijkstra
slug: 簡易Dijkstra
description: 圖解 Dijkstra 演算法🍾
date: 2020-04-08 02:55:23
tags: 
    - 演算法
categories: 
    - 演算法
image: https://i.imgur.com/uvhI0MV.png
---

# Dijkstra Note

---

以走迷宮圖的最短路徑為例
https://zerojudge.tw/ShowProblem?problemid=d793

在 hackmd ㄉ： https://hackmd.io/@UltraGeek/Sy6vIEqvI

```cpp
#include <bits/stdc++.h>
using namespace std;

typedef struct Node {
    int i;
    int j;
    int dis;
    bool operator<(const Node& a) const {
        return a.dis < dis;
    }
} node;

int ta, N, M;  // taskAmount
int maze[1000][1000];
int dis[1000][1000];
bool flag[1000][1000];
int mv[4][2] = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}};
priority_queue<node> dispq;

void dijsktra() {
    while (!dispq.empty()) {
        flag[dispq.top().i][dispq.top().j] = true;
        for (int k = 0; k < 4; k++) {
            node nn;  //nextNode
            nn.i = dispq.top().i + mv[k][0];
            nn.j = dispq.top().j + mv[k][1];
            nn.dis = dis[nn.i][nn.j];
            if ((nn.i < N && nn.i >= 0) && (nn.j < M && nn.j >= 0) && (!flag[nn.i][nn.j])) {
                if (dispq.top().dis + maze[nn.i][nn.j] < nn.dis) {
                    nn.dis = dispq.top().dis + maze[nn.i][nn.j];
                    dispq.push(nn);
                    dis[nn.i][nn.j] = nn.dis;
                }
            }
        }
        dispq.pop();
    }
}

int main() {
    ios_base::sync_with_stdio(0);
    cin.tie(nullptr);
    cin >> ta;
    while (ta--) {
        //int p[1000][1000];
        cin >> N >> M;
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < M; j++) {
                cin >> maze[i][j];
                flag[i][j] = 0;
                dis[i][j] = 9999999;
            }
        }
        node n = {0, 0, maze[0][0]};
        dis[0][0] = maze[0][0];
        dispq.push(n);

        dijsktra();
        cout << dis[N - 1][M - 1] << '\n';
    }
}
```

<div>
<hr><ol>
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:green"> 0 </span></th>
<th><span style="color:red"> 3 </span></th>
<th>1</th>
<th>2</th>
<th>9</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:red"> 7 </span></td>
<td>3</td>
<td>4</td>
<td>9</td>
<td>9</td>
</tr>
<tr>
<td>1</td>
<td>7</td>
<td>5</td>
<td>5</td>
<td>3</td>
</tr>
<tr></div>
<td>2</td>
<td>3</td>
<td>4</td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:red"> 3 </span></th>
<th>INF</th>
<th>INF</th>
<th>INF</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:red"> 7 </span></td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (0 , 1) ，距離： 3 </p><hr><ol start="2">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:green"> 3 </span></th>
<th><span style="color:red"> 1 </span></th>
<th>2</th>
<th>9</th>
</tr>
</thead>
<tbody>
<tr>
<td>7</td>
<td><span style="color:red"> 3 </span></td>
<td>4</td>
<td>9</td>
<td>9</td>
</tr>
<tr>
<td>1</td>
<td>7</td>
<td>5</td>
<td>5</td>
<td>3</td>
</tr>
<tr>
<td>2</td>
<td>3</td>
<td>4</td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:red"> 4 </span></th>
<th>INF</th>
<th>INF</th>
</tr>
</thead>
<tbody>
<tr>
<td>7</td>
<td><span style="color:red"> 6 </span></td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (0 , 2) ，距離： 4 </p><hr><ol start="3">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:green"> 1 </span></th>
<th><span style="color:red"> 2 </span></th>
<th>9</th>
</tr>
</thead>
<tbody>
<tr>
<td>7</td>
<td>3</td>
<td><span style="color:red"> 4 </span></td>
<td>9</td>
<td>9</td>
</tr>
<tr>
<td>1</td>
<td>7</td>
<td>5</td>
<td>5</td>
<td>3</td>
</tr>
<tr>
<td>2</td>
<td>3</td>
<td>4</td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:red"> 6 </span></th>
<th>INF</th>
</tr>
</thead>
<tbody>
<tr>
<td>7</td>
<td>6</td>
<td><span style="color:red"> 8 </span></td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (1 , 1) ，距離： 6 </p><hr><ol start="4">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th>2</th>
<th>9</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:red"> 7 </span></td>
<td><span style="color:green"> 3 </span></td>
<td><span style="color:red"> 4 </span></td>
<td>9</td>
<td>9</td>
</tr>
<tr>
<td>1</td>
<td><span style="color:red"> 7 </span></td>
<td>5</td>
<td>5</td>
<td>3</td>
</tr>
<tr>
<td>2</td>
<td>3</td>
<td>4</td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th>6</th>
<th>INF</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:red"> 7 </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:red"> 8 </span></td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td>INF</td>
<td><span style="color:red"> 13 </span></td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (0 , 3) ，距離： 6 </p><hr><ol start="5">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:green"> 2 </span></th>
<th><span style="color:red"> 9 </span></th>
</tr>
</thead>
<tbody>
<tr>
<td>7</td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td>4</td>
<td><span style="color:red"> 9 </span></td>
<td>9</td>
</tr>
<tr>
<td>1</td>
<td>7</td>
<td>5</td>
<td>5</td>
<td>3</td>
</tr>
<tr>
<td>2</td>
<td>3</td>
<td>4</td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th><span style="color:red"> 15 </span></th>
</tr>
</thead>
<tbody>
<tr>
<td>7</td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td>8</td>
<td><span style="color:red"> 15 </span></td>
<td>INF</td>
</tr>
<tr>
<td>INF</td>
<td>13</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (1 , 0) ，距離： 7 </p><hr><ol start="6">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th>9</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:green"> 7 </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td>4</td>
<td>9</td>
<td>9</td>
</tr>
<tr>
<td><span style="color:red"> 1 </span></td>
<td>7</td>
<td>5</td>
<td>5</td>
<td>3</td>
</tr>
<tr>
<td>2</td>
<td>3</td>
<td>4</td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th>15</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td>8</td>
<td>15</td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:red"> 8 </span></td>
<td>13</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (2 , 0) ，距離： 8 </p><hr><ol start="7">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th>9</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td>4</td>
<td>9</td>
<td>9</td>
</tr>
<tr>
<td><span style="color:green"> 1 </span></td>
<td><span style="color:red"> 7 </span></td>
<td>5</td>
<td>5</td>
<td>3</td>
</tr>
<tr>
<td><span style="color:red"> 2 </span></td>
<td>3</td>
<td>4</td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th>15</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td>8</td>
<td>15</td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:red"> 13 </span></td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:red"> 10 </span></td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (1 , 2) ，距離： 8 </p><hr><ol start="8">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th>9</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:green"> 4 </span></td>
<td><span style="color:red"> 9 </span></td>
<td>9</td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td>7</td>
<td><span style="color:red"> 5 </span></td>
<td>5</td>
<td>3</td>
</tr>
<tr>
<td>2</td>
<td>3</td>
<td>4</td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th>15</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:red"> 15 </span></td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td>13</td>
<td><span style="color:red"> 13 </span></td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td>10</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (3 , 0) ，距離： 10 </p><hr><ol start="9">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th>9</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td>9</td>
<td>9</td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td>7</td>
<td>5</td>
<td>5</td>
<td>3</td>
</tr>
<tr>
<td><span style="color:green"> 2 </span></td>
<td><span style="color:red"> 3 </span></td>
<td>4</td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th>15</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td>15</td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td>13</td>
<td>13</td>
<td>INF</td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>10</s> </span></td>
<td><span style="color:red"> 13 </span></td>
<td>INF</td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (2 , 2) ，距離： 13 </p><hr><ol start="10">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th>9</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td>9</td>
<td>9</td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td><span style="color:red"> 7 </span></td>
<td><span style="color:green"> 5 </span></td>
<td><span style="color:red"> 5 </span></td>
<td>3</td>
</tr>
<tr>
<td><span style="color:gray"> <s>2</s> </span></td>
<td>3</td>
<td><span style="color:red"> 4 </span></td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th>15</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td>15</td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:red"> 13 </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:red"> 18 </span></td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>10</s> </span></td>
<td>13</td>
<td><span style="color:red"> 17 </span></td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (3 , 1) ，距離： 13 </p><hr><ol start="11">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th>9</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td>9</td>
<td>9</td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td><span style="color:red"> 7 </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td>5</td>
<td>3</td>
</tr>
<tr>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:green"> 3 </span></td>
<td><span style="color:red"> 4 </span></td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th>15</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td>15</td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:red"> 13 </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td>18</td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>10</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:red"> 17 </span></td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (2 , 1) ，距離： 13 </p><hr><ol start="12">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th>9</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td>9</td>
<td>9</td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td><span style="color:green"> 7 </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td>5</td>
<td>3</td>
</tr>
<tr>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td>4</td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th>15</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td>15</td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td>18</td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>10</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td>17</td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (1 , 3) ，距離： 15 </p><hr><ol start="13">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th>9</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:green"> 9 </span></td>
<td><span style="color:red"> 9 </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td><span style="color:red"> 5 </span></td>
<td>3</td>
</tr>
<tr>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td>4</td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th>15</th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>15</s> </span></td>
<td><span style="color:red"> 24 </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:red"> 18 </span></td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>10</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td>17</td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (0 , 4) ，距離： 15 </p><hr><ol start="14">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th><span style="color:green"> 9 </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:gray"> <s>9</s> </span></td>
<td><span style="color:red"> 9 </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td>5</td>
<td>3</td>
</tr>
<tr>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td>4</td>
<td>2</td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th><span style="color:gray"> <s>15</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>15</s> </span></td>
<td><span style="color:red"> 24 </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td>18</td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>10</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td>17</td>
<td>INF</td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (3 , 2) ，距離： 17 </p><hr><ol start="15">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th><span style="color:gray"> <s>9</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:gray"> <s>9</s> </span></td>
<td>9</td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td>5</td>
<td>3</td>
</tr>
<tr>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:green"> 4 </span></td>
<td><span style="color:red"> 2 </span></td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th><span style="color:gray"> <s>15</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>15</s> </span></td>
<td>24</td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td>18</td>
<td>INF</td>
</tr>
<tr>
<td><span style="color:gray"> <s>10</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>17</s> </span></td>
<td><span style="color:red"> 19 </span></td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (2 , 3) ，距離： 18 </p><hr><ol start="16">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th><span style="color:gray"> <s>9</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:gray"> <s>9</s> </span></td>
<td>9</td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td><span style="color:green"> 5 </span></td>
<td><span style="color:red"> 3 </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:red"> 2 </span></td>
<td>5</td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th><span style="color:gray"> <s>15</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>15</s> </span></td>
<td>24</td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>18</s> </span></td>
<td><span style="color:red"> 21 </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>10</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>17</s> </span></td>
<td><span style="color:red"> 19 </span></td>
<td>INF</td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (3 , 3) ，距離： 19 </p><hr><ol start="17">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th><span style="color:gray"> <s>9</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:gray"> <s>9</s> </span></td>
<td>9</td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td>3</td>
</tr>
<tr>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:green"> 2 </span></td>
<td><span style="color:red"> 5 </span></td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th><span style="color:gray"> <s>15</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>15</s> </span></td>
<td>24</td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>18</s> </span></td>
<td>21</td>
</tr>
<tr>
<td><span style="color:gray"> <s>10</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>17</s> </span></td>
<td><span style="color:gray"> <s>19</s> </span></td>
<td><span style="color:red"> 24 </span></td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (2 , 4) ，距離： 21 </p><hr><ol start="18">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th><span style="color:gray"> <s>9</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:gray"> <s>9</s> </span></td>
<td><span style="color:red"> 9 </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td><span style="color:green"> 3 </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:red"> 5 </span></td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th><span style="color:gray"> <s>15</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>15</s> </span></td>
<td><span style="color:red"> 24 </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>18</s> </span></td>
<td><span style="color:gray"> <s>21</s> </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>10</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>17</s> </span></td>
<td><span style="color:gray"> <s>19</s> </span></td>
<td><span style="color:red"> 24 </span></td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (3 , 4) ，距離： 24 </p><hr><ol start="19">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th><span style="color:gray"> <s>9</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:gray"> <s>9</s> </span></td>
<td>9</td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:green"> 5 </span></td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th><span style="color:gray"> <s>15</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>15</s> </span></td>
<td>24</td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>18</s> </span></td>
<td><span style="color:gray"> <s>21</s> </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>10</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>17</s> </span></td>
<td><span style="color:gray"> <s>19</s> </span></td>
<td><span style="color:gray"> <s>24</s> </span></td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (1 , 4) ，距離： 24 </p><hr><ol start="20">
<li></li>
</ol><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>1</s> </span></th>
<th><span style="color:gray"> <s>2</s> </span></th>
<th><span style="color:gray"> <s>9</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:gray"> <s>9</s> </span></td>
<td><span style="color:green"> 9 </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>1</s> </span></td>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:gray"> <s>3</s> </span></td>
<td><span style="color:gray"> <s>4</s> </span></td>
<td><span style="color:gray"> <s>2</s> </span></td>
<td><span style="color:gray"> <s>5</s> </span></td>
</tr>
</tbody>
</table> </br><table>
<thead>
<tr>
<th><span style="color:gray"> <s>0</s> </span></th>
<th><span style="color:gray"> <s>3</s> </span></th>
<th><span style="color:gray"> <s>4</s> </span></th>
<th><span style="color:gray"> <s>6</s> </span></th>
<th><span style="color:gray"> <s>15</s> </span></th>
</tr>
</thead>
<tbody>
<tr>
<td><span style="color:gray"> <s>7</s> </span></td>
<td><span style="color:gray"> <s>6</s> </span></td>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>15</s> </span></td>
<td><span style="color:gray"> <s>24</s> </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>8</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>18</s> </span></td>
<td><span style="color:gray"> <s>21</s> </span></td>
</tr>
<tr>
<td><span style="color:gray"> <s>10</s> </span></td>
<td><span style="color:gray"> <s>13</s> </span></td>
<td><span style="color:gray"> <s>17</s> </span></td>
<td><span style="color:gray"> <s>19</s> </span></td>
<td><span style="color:gray"> <s>24</s> </span></td>
</tr>
</tbody>
</table><p>透過<span style="color:green">綠色</span>這格更新旁邊的<span style="color:red">紅色</span>格ㄉ最短路徑，再從<strong>所有格子</strong>中挑選<strong>未走過</strong>且路徑<strong>最短</strong>者繼續尋找 ，即格子： (1 , 4) ，距離： 24 </p><hr></div>
