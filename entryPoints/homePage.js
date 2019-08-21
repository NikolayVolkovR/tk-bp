import {Banner} from '../Banner/Banner'
import {Carousel} from "../Carousel/Carousel"

(function(){
    const mainHeader = document.getElementById('main-header');
    const bannerContainer = document.querySelector('.site-index');
    let bannerData = [
        {
            'src': {
                'el':  '/images/banner/mainPage/3_1/el.jpg',
                'md':  '/images/banner/mainPage/3_1/md.jpg',
                'es':  '/images/banner/mainPage/3_1/es.jpg',
            },
            'header':
            'Спецпредложение' +
            '<div class="banner__board-header-big2">Соседи</div>' +
            '<span class="banner__board-header-hint">Хорошо, когда Вы рядом</span>' +
            '<div class="banner__board-text-example"> Мин. заказ 2 часа + подача</div>',
            'subHeader': 'Для районов:',
            'text':
            '<a href="/obl/khimki">Химки</a>, ' +
            '<a href="/obl/solnechnogorsk">Солнечногорск</a>, ' +
            '<a href="/obl/skhodnya">Сходня</a>, ' +
            '<a href="/obl/lobnya">Лобня</a>, ' +
            '<a href="/obl/dolgoprudnyy">Долгопрудный</a>, ' +
            '<a href="/obl/zelenograd">Зеленоград</a>, ' +
            '<a href="/obl/strogino">Строгино</a>, ' +
            '<a href="/obl/rechnoy-vokzal">Речной вокзал</a>, ' +
            '<a href="/obl/vodnyy-stadion">Водный стадион</a>, ' +
            '<a href="/obl/planernaya">Планерная</a>, ' +
            '<a href="/obl/skhodnenskoy">Сходненская</a> ' +
            ' ...'
        },
        {
            'src': {
                'el':  '/images/banner/mainPage/2/el.jpg',
                'md':  '/images/banner/mainPage/2/md.jpg',
                'es':  '/images/banner/mainPage/2/es.jpg',
            },
            'header':
            'Спецпредложение' +
            '<div class="banner__board-header-big2">Быстрый заказ</div>' +
            '<span class="banner__board-header-hint">для</span>' +
            '<span class="banner__board-text-example"> Лада Ларгус</span>',
            'subHeader':
            'Минимальный заказ: <span class="price-3">1</span> час' +
            '<br />Стоимость: <span class="price-3">1000</span><span class="rub-1">₽</span> ' +
            '<div style="margin-top:5px"><a href="/tarif/kabluk">Подробнее...</a></div>',
            'text':
            'а ещё, "Быстрый заказ" работает для:' +
            '<div><a href="/tarif/gazelle-3m">Газель 3 метра</a> и <a href="/tarif/porter">Портер</a></div>'
        },
        {
            'src': {
              'el':  '/images/banner/mainPage/1/el.png', // 1100 x 660
              'md':  '/images/banner/mainPage/1/md.png', // 800
              'es':  '/images/banner/mainPage/1/es.png', // 700
            },
            'header':
                '<span class="banner__board-header-big">Спецпредложение</span>' +
                '<br/>для Юридических лиц' +
                '<div class="banner__board-header-hint">цены на основе зон</div>' +
                '<span class="banner__board-text-example">Например:</span>' +
                '<div class="banner__board-text-example-item">Газель из Зеленограда в Домодедово: <b>всего</b> <span class="price-3">3000</span><span class="rub-1">₽</span>!</div>' +
                '<div class="banner__board-text-example-item">Газель из Лобни в Южное чертаново <b>(другой конец Москвы!)</b>: всего <span class="price-3">2500</span><span class="rub-1">₽</span>!</div>',
            'subHeader': '',/*'<br /><br /><a href="#">Подробнее...</a>',*/
            'text': '<a href="/yur-litsam">Подробнее...</a>'
        }


    ];
    let banner = new Banner({
        bannerData: bannerData,
        height: 400,
        width: parseInt(window.getComputedStyle(bannerContainer).width),
        slideNumber: 0,
        changeSlideDuration: 11000,
        bgAnimationMultiplier: 30,
        srcVersion: '0.2'
    });
    bannerContainer.insertBefore(banner.getElem(), mainHeader);


    let carouselData = [
        {
            url: '/client/demark',
            src: '/images/Client/1.png'
        },
{
            url: '/client/vr-sport',
            src: '/images/Client/2.png'
        },
{
            url: '/client/galard',
            src: '/images/Client/3.png'
        },
{
            url: '/client/astro-doors',
            src: '/images/Client/4.png'
        },
{
            url: '/client/eka',
            src: '/images/Client/5.png'
        },
        {
            url: '/client/alie-dream',
            src: '/images/Client/6.png'
        },
        {
            url: '#',
            src: '/images/Client/7.png'
        },
        {
            url: '#',
            src: '/images/Client/8.png'
        },
        {
            url: '#',
            src: '/images/Client/9.png'
        },
        {
            url: '#',
            src: '/images/Client/10.png'
        },
        {
            url: '#',
            src: '/images/Client/11.png'
        },
        {
            url: '#',
            src: '/images/Client/12.png'
        }

    ];
    let dataPromise = new Promise(resolve => {
        setTimeout(()=>{
            resolve({data: carouselData})
        }, 0)
    });
    //const ourClientsHeader = document.getElementById('our-clients-header');
    let carousel = new Carousel({dataPromise: dataPromise, height: 80});
    bannerContainer.append(carousel.getElem());

})(Banner, Carousel);