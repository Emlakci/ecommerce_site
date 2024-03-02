const soc_media_icon_list = document.querySelectorAll('.icons-list .soc-media-icn');
const background = document.querySelector('.socials-media');

//~initialize vanilla tilt function ~//
VanillaTilt.init(document.querySelectorAll(".icons-list .soc-media-icn .soc-media-link"), {
    max: 25,
    speed: 400,
    glare: true,
    'max-glare': 1,
});
//~initialize vanilla tilt function ~//

soc_media_icon_list.forEach(item=>{
    item.addEventListener('mouseenter', function (event){
        const bg_color = event.target.getAttribute('data-bgColor');
        background.setAttribute('style', `background-color: ${bg_color}`);
    });
    item.addEventListener('mouseleave', function (event){
        background.setAttribute('style', `background-color: transparent`);
    })
});