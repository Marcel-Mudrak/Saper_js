const plansza = document.querySelector('.grid')
const info = document.getElementById('info')
const gora = document.getElementById('gora')
const srodek = document.getElementById('lewo')
const lewo = document.getElementById('lewo')
const prawo = document.getElementById('prawo')
const all = document.getElementById('all')  // <-------------------

// s = parseInt(prompt('Wprowadź szerokość (na razie sensownie wygląda tylko 10)'))
// let szerokosc = s
// hp = plansza.style.width = s * s * 4 + 50 + "px"
// wp = plansza.style.height = s * s * 4 + 50 + "px"
// hp1 = plansza.style.width = s * s * 4 + 50
// wp1 = plansza.style.height = s * s * 4 + 50

s = 10
let szerokosc = s

hp = plansza.style.width = s * s * 4 + 50 + "px"
wp = plansza.style.height = s * s * 4 + 50 + "px"
hp1 = plansza.style.width = s * s * 4 + 50
wp1 = plansza.style.height = s * s * 4 + 50

m = parseInt(prompt('Ile min?'));
if(m > szerokosc*szerokosc || m <= 0) {
    m = 20
    alert('Wartosc nie moze byc wieksza niz liczba pol i mniejsza lub równa 0, automatycznie zmieniono na 20 min')
}

let ileMin = m

let ileFlag = 0         // <-------------------
let koniecGry = false   // <-------------------
let pola = []  
let bomba = '<img src="bomba.png" alt="B"></img>'

var ileMinZostalo = ileMin;
var seconds = 1000

let rozkladMin = losujMiny(szerokosc, ileMin)
generujPola()
dodajDaneOMinach() 

function losujMiny(szerokosc, ileMin){
    const rozkladMin = Array(szerokosc*szerokosc)
    rozkladMin.fill('czysto')
    let gdzie
    do {
        gdzie = Math.floor(Math.random()*100)
        if(rozkladMin[gdzie] === 'czysto'){
            rozkladMin[gdzie] = 'mina'
            ileMin--
        }
    } while (ileMin !== 0)

    return rozkladMin
}

function animateValue(id, start, end, duration) {
    if (start === end) return;
    var range = end - start;
    var current = start;
    var increment = end > start? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById("prawo")
    var timer = setInterval(function() {
        current += increment;
        if(current < 10) 
            obj.innerHTML = '<h4 style="margin-top: 10px">00' + current + '</h4>';
        else if (current >= 10 && current < 100) 
            obj.innerHTML = '<h4 style="margin-top: 10px">0' + current + '</h4>';
        else if (current >= 100 && current < 1000) {
            obj.innerHTML = '<h4 style="margin-top: 10px">' + current + '</h4>';
        }
        else
            obj.innerText = "(づ｡◕‿‿◕｡)づ"
        if (current == end || koniecGry == true) {
            clearInterval(timer);
            koniecGry = true;
        }
    }, stepTime);
}

animateValue("value", 0, seconds, (seconds)*1000);

function generujPola(){
    for(let i = 0; i < szerokosc*szerokosc; i++ ){
        const pole = document.createElement('div')
        pole.style.width = (wp1)/11.25  + "px"
        pole.style.height = (hp1)/11.25  + "px"
        w = pole.style.width = (wp1)/11.25
        h = pole.style.height = (hp1)/11.25 
        pole.setAttribute('id', i)
        pole.classList.add('pole')
        pole.classList.add(rozkladMin[i])
        plansza.appendChild(pole)
        pola.push(pole) 

        pole.addEventListener('click',function(e) {
           klik(pole)
        })
        pole.addEventListener('contextmenu',function(e) {
           e.preventDefault()
           postawFlage(pole)
        })
    }   
}

function dodajDaneOMinach(){    
    for (let i = 0; i < pola.length; i++) {
        let minDookola = 0
        const lewyBok = i % szerokosc === 0
        const prawyBok = i % szerokosc === szerokosc - 1
        const gora = i < szerokosc
        const dol = i > szerokosc*szerokosc-szerokosc-1

        if (pola[i].classList.contains('czysto')) {
            if (!gora && !prawyBok && pola[i+1-szerokosc].classList.contains('mina')) minDookola++ //NE
            if (!lewyBok && pola[i-1].classList.contains('mina')) minDookola++    //W
            if (!gora && pola[i-szerokosc].classList.contains('mina')) minDookola++  //N
            if (!gora && !lewyBok && pola[i-1-szerokosc].classList.contains('mina')) minDookola++ //NW
            if (!prawyBok && pola[i+1].classList.contains('mina')) minDookola++  //E
            if (!dol && !lewyBok && pola[i-1+szerokosc].classList.contains('mina')) minDookola++ //SW
            if (!dol && !prawyBok && pola[i+1+szerokosc].classList.contains('mina')) minDookola++ //SE
            if (!dol && pola[i+szerokosc].classList.contains('mina')) minDookola++  //S
            pola[i].setAttribute('data',minDookola)
        }
    }
}

function klik(pole){
    if (koniecGry != true) {
        var dat = pole.getAttribute('data')
            if(dat == 0) {
                sprawdzSasiada(pole)
            }
            else {
                pole.innerText = dat
                sprawdzone(pole)
                kolory(pole)
            }
        wybuch(pole);
    }
}

function postawFlage(pole){               // <-------------------
    if(koniecGry || pole.classList.contains('sprawdzone')) return
    if(pole.classList.contains('flaga')){
        pole.classList.remove('flaga')
        pole.innerHTML = ''
        ileFlag--
        lewo.innerHTML = '<h4>' + (ileMin - ileFlag) + '</h4>'
        return
    }
    else if(ileFlag < ileMin){
        pole.classList.add('flaga')
        pole.innerHTML = '<img src="flaga.ico" width="' + w + 'px"' + 'height="' + h + 'px">'
        ileFlag++
        lewo.innerHTML = '<h4>' + (ileMin - ileFlag) + '</h4'
        if(ileFlag == ileMin) czyWygrana()
    }
}

function czyWygrana(){                   // <-------------------
    if(pola.every(flagaNaMinie)) {
        document.getElementsByClassName('smile')[0].src = "cool.png"
        lewo.innerHTML = '<h4>Wygrałeś!!</h4>'
        console.log("Wygrana")
        koniecGry = true
        document.body.style.backgroundImage = "url('win.gif')";
    }
}
    lewo.innerHTML = '<h4>' + ileMin + '</h4'

    function flagaNaMinie(pole){
        if(pole.classList.contains('mina')){
            return pole.classList.contains('flaga')
        }
        else {
            return true
        }
}

    function wybuch(pole) {
        
        if(pole.classList.contains('mina')) {
            document.getElementsByClassName('smile')[0].src = "sad.png"
            srodek.innerHTML = '<h4>Przegrałeś</h4>'
            console.log("Przegrana")
            koniecGry = true
            pokazBomby();
        }
}

    function pokazBomby() {
        for(i = 0; i < 100; i++) {
            if(pola[i].classList.contains('mina')) {
                pola[i].innerHTML = '<img src="bomba.png" width="' + w + 'px"' + 'height="' + h + 'px">'
                pola[i].style.background = 'red';
            }
        }   
}

    function sprawdzSasiada(pole){
        if(pole.classList.contains('sprawdzone')) return;
        if(pole.getAttribute('data')*1 > 0 && pole.getAttribute('data')*1 < 9){
            pole.innerText = pole.getAttribute('data');
            kolory(pole)  
            sprawdzone(pole)
            return;
        }
        if(pole.getAttribute('data') != "0") return;
        sprawdzone(pole)
        let id = pole.id*1;
        if(id+szerokosc < szerokosc*szerokosc) sprawdzSasiada(document.getElementById(id+szerokosc));
        if(id%szerokosc < szerokosc-1) sprawdzSasiada(document.getElementById(id+1));
        if(id%szerokosc > 0) sprawdzSasiada(document.getElementById(id-1));
        if(id-szerokosc >= 0) sprawdzSasiada(document.getElementById(id-szerokosc));
    }

    function kolory(pole) {
        var dat = pole.getAttribute('data')
        
        if(dat == 1) {
            pole.style.color = "rgb(71, 71, 250)"
        }
        if(dat == 2) {
            pole.style.color = "green"
        }
        if(dat == 3) {
            pole.style.color = "red"
        }
        if(dat == 4) {
            pole.style.color = "darkblue"
        }
        if(dat == 5) {
            pole.style.color = "yellow"
        }
        if(dat == 6) {
            pole.style.color = "pink"
        }
        if(dat == 7) {
            pole.style.color = "black"
        }
        if(dat == 8) {
            pole.style.color = "orange"
        }
    }

    function sprawdzone(pole) {
        pole.classList.add('sprawdzone');
        pole.style.background = "rgb(214, 214, 214)"
    }