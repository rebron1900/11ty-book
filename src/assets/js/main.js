import "../sass/book.scss";

import Alpine from "alpinejs";
import mediumZoom from "medium-zoom";
import search from "./search";
import Artalk from "./ArtalkLite";
import quicklink from "quicklink/dist/quicklink.umd";
import { initCopyButton } from "./code.js";
import initMap from "./map.js"

import { getMemos, parseMemos } from "./memos.js";

window.Alpine = Alpine;
Alpine.data("theme", () => ({
    themeName: localStorage.name,
    changeTheme: changeTheme,
    setName: function () {
        this.themeName = localStorage.name;
    },
}));
Alpine.data("memos", () => ({
    data: {},
    limit: 0,
    offset: 0,
    url: "",
    getMemoss: function () {
        this.data = getMemos(this.url, this.limit, this.offset);
    },
    loadmore: function () {
        this.offset = this.offset + this.offset;
        this.limit = this.limit + this.limit;
        this.getMemoss();
    },
    initZoom: initZoom,
}));

Alpine.data("douban", () => ({
    change: function (type) {
        // 选择所有具有data-itemtype属性的元素
        const elements = document.querySelectorAll("[data-itemtype]");

        // 遍历这些元素
        elements.forEach(function (el) {
            // 检查data-itemtype的值是否不等于'book'
            const t = el.getAttribute("data-itemtype");
            if (type == "all") {
                el.style.display = "";
                return;
            }
            if (t !== type) {
                // 如果不等于，隐藏该元素
                el.style.display = "none";
            } else {
                el.style.display = "";
            }
        });
        this.hidden();
    },
    hidden: function () {
        const cardElements = document.querySelectorAll(".db--listBydate");

        cardElements.forEach(function (card) {
            // 检查db--dateList__card类下的子元素是否全部被隐藏
            let allHidden = true;
            card.querySelectorAll(".db--item").forEach(function (dateListCard) {
                // 如果存在任何未隐藏的子元素，则将allHidden设置为false
                if (dateListCard.style.display !== "none") {
                    allHidden = false;
                    card.style.display = ''
                }
            });

            // 如果所有子元素都被隐藏，则隐藏db--list__card元素
            if (allHidden) {
                card.style.display = "none";
            }
        });
    },
    active: function(el){
        document.querySelectorAll('.db--navItem').forEach(function(item){
            item.classList.remove('current')
        });
        el.currentTarget.classList.add('current')
    }
}));

Alpine.start();
//init kg-gallery-image

var gallery = document.querySelectorAll(".kg-gallery-image img");
gallery.forEach(function (e) {
    var l = e.closest(".kg-gallery-image"),
        a = e.attributes.width.value / e.attributes.height.value;
    l.style.flex = a + " 1 0%";
});

function initZoom() {
    mediumZoom(".markdown img", {
        background: "rgba(0,0,0,0.75)",
    });
    // this.$nextTick(() => {
    //     mediumZoom(".markdown img", {
    //         background: "rgba(0,0,0,0.75)",
    //     });
    // });
    return;
}

search();
initZoom();
initCopyButton();
initMap();

if (navigator.serviceWorker) {
    navigator.serviceWorker.register(location.origin + "/sw.js", {
        scope: location.origin,
    });
}

if (
    commentinfo.type == "artalk" &&
    document.getElementById("comments") != null
) {
    window.artalk = Artalk.init({
        el: commentinfo.el, // 绑定元素的 Selector
        server: commentinfo.server, // 后端地址
        site: commentinfo.name, // 你的站点名
    });
    artalk.on(
        "list-loaded",
        changeTheme(localStorage.theme, localStorage.name)
    );
}

window.addEventListener("load", () => {
    quicklink.listen();
});

function changeTheme(theme, name) {
    if (theme == "auto") {
        document.documentElement.setAttribute("class", "");
        const prefersDarkScheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        // if (window.artalk) window.artalk.setDarkMode(prefersDarkScheme);
    } else {
        // 切换主题并存储到localStorage
        document.documentElement.setAttribute("class", theme);
        // if (window.artalk)
        //     window.artalk.setDarkMode(theme === "dark" ? true : false);
    }
    localStorage.theme = theme;
    localStorage.name = name;
}

// var options = {
//     // optional
//     contentSelector: ".markdown",
//     copyiconclass: "test",
//     copyIconContent:
//         "<img src='" +
//         location.origin +
//         "/assets/svg/theme.svg' class='book-icon' /></span>",
// };

// window.highlightJsBadge(options);

// var options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
// function success(pos) {
//     var crd = pos.coords;
//     console.log("Your current position is:");
//     console.log("Latitude : " + crd.latitude);
//     console.log("Longitude: " + crd.longitude);
//     console.log("More or less " + crd.accuracy + " meters.");
// }
// function error(err) {
//     console.warn("ERROR(" + err.code + "): " + err.message);
// }
// navigator.geolocation.getCurrentPosition(success, error, options);

// 选择所有具有data-itemtype属性的元素
// const elements = document.querySelectorAll('[data-itemtype]');

// // 遍历这些元素
// elements.forEach(function(el) {
//   // 检查data-itemtype的值是否不等于'book'
//   if (el.getAttribute('data-itemtype') !== 'book') {
//     // 如果不等于，隐藏该元素
//     el.style.display = 'none';
//   }

// // 隐藏所有非当前类型的元素
const cardElements = document.querySelectorAll(".db--listBydate");

cardElements.forEach(function (card) {
    // 检查db--dateList__card类下的子元素是否全部被隐藏
    let allHidden = true;
    card.querySelectorAll(".db--item").forEach(function (dateListCard) {
        // 如果存在任何未隐藏的子元素，则将allHidden设置为false
        if (dateListCard.style.display !== "none") {
            allHidden = false;
        }
    });

    // 如果所有子元素都被隐藏，则隐藏db--list__card元素
    if (allHidden) {
        card.style.display = "none";
    }
});
