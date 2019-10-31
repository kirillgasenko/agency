//получаю апишку
$.getJSON( 'https://smida-dev.test.idoc.com.ua/api/registry/okpoCard?code=01130549',  function( data ) {
    if(data.aListRegistry[0].nID === 36 && data.aListRegistry[0].sID_Registry === 'PublicOffering' && data.aListRegistry[0].sName === 'Публічні пропозиції'){
        function footerRender(){
            $.getJSON( "https://smida-dev.test.idoc.com.ua/api/registry/getTranslatedModels?sOKPO=01130549", function( data ) {
                $.each(data, function( key, val ) {
                    let _date = val.sDateBeginPublicOffering.value;
                    let date = _date.split(' ')[0].replace(/(\d{4})-(\d{2})-(\d{2})/, '$3.$2.$1');
                    let date_regular = val.sDateEndPublicOffering.value;
                    let date1 = date_regular.split(' ')[0].replace(/(\d{4})-(\d{2})-(\d{2})/, '$3.$2.$1');
                    let proposition = {
                        name: val.sNameOfferent.value,
                        start: date,
                        end: date1,
                        paper: val.oDictionary_TypeStockPaper.value,
                        status: val.aoListEvents.value.sName
                    }
                    console.log(proposition);
                    //вывод данных по категориям футер
                    $('tbody').append(`"<tr>""<td data-description class='footer-list'>${proposition.name}</td>" + "<td data-description class='footer-list'>${proposition.start}</td>" "<td data-description class='footer-list'>${proposition.end}</td>" "<td data-description class='footer-list' >${proposition.paper}</td>" "<td data-description class='footer-list' >${proposition.status}</td>" "</tr>"`)
                    size();
                }); 
            });
        }
    }
    let click = false;
    let i = 0;

    $(".footer__name").click(function(){
        i++
        if(i === 1) {
            footerRender();
        } 
        if(click === false) {
            $(".footer__down").addClass("open");
            $(".footer__name-inner").addClass("color");
            click = true;
        } else {
            $(".footer__down").removeClass("open");
            $(".footer__name-inner").removeClass("color");
            click = false;
        }  
    })
    let firts_date = data.oCommonInfoBot.database_date;
    let date_rep = firts_date.split(' ')[0].replace(/(\d{4})-(\d{2})-(\d{2})/, '$3.$2.$1');
    let second_date = data.oCommonInfo.sDateRegistrationEDR;
    let date_rep2 = second_date.split(' ')[0].replace(/(\d{4})-(\d{2})-(\d{2})/, '$3.$2.$1');
    let items = [];
    $('.top__code').append(data.oCommonInfoBot.code)
    const oCommonInfoBot =  data.oCommonInfoBot;
    const oCommonInfo = data.oCommonInfo;
    //делаю свои объекты
    const firstcolumn = {
        code: oCommonInfoBot.code,
        name: oCommonInfoBot.full_name, 
        name_person: oCommonInfoBot.ceo_name,
        capital: oCommonInfoBot.totalcapital,
        zasnovnik: oCommonInfoBot.beneficiaries,
        place: oCommonInfoBot.location,
        time_place: " ",
        email: " ",
        site: " ",
        number: " ",
        date: " ",
        status: oCommonInfoBot.status,
        main_kved: oCommonInfoBot.activities,
        date_update: date_rep
    }
    const secondcolumn = {
        code: oCommonInfo.sOKPO,
        name: oCommonInfo.sNameFull, 
        name_person: oCommonInfo.oCEO.sCeoName,
        capital: oCommonInfo.nSizeCharterCapital,
        zasnovnik: ' ',
        place: oCommonInfo.Address,
        time_place: oCommonInfo.Temporary_Address,
        email: oCommonInfo.Email,
        site: oCommonInfo.www,
        number: oCommonInfo.Phone,
        date: date_rep2,
        status: " ",
        main_kved: " ",
        date_update: " "
    }
    // вывожу информацию
    $.each(firstcolumn, function( key, val ) {
        if(val === firstcolumn.capital){
            $(".main__second").append( "<span data-description class='" + key +  "' >"  + val +  ' <ion-icon name="arrow-dropdown"></ion-icon> '+ "</span>" );
        }else if(val === firstcolumn.zasnovnik ){
            $(".main__second").append( "<span data-description class='" + key +  "' >"  + val[0].title + ": " + val[0].capital + " " +  "</span>" );
        } else {
            $(".main__second").append( "<span data-description class='" + key + "' >"  + val + "</span>" );
        }
    });
    $.each(secondcolumn, function( key, val ) {
        $(".main__third").append( "<span data-description class='" + key + '-sdr'+ "' >"  + val +  "</span>" );
    }); 
    //открывающийся замовник
    let show = false
    $('.capital').click(function(){
        if( show === false){
            $('.zacnov').show();
            $('.zasnovnik').show();
            $('.zasnovnik-sdr').show();
            show = true;
        } else {
            $('.zacnov').hide();
            $('.zasnovnik').hide();
            $('.zasnovnik-sdr').hide();
            show = false;
        }
    })
    size();
})

//функция, что бы данные не выходили за границы
function size(){
let elements = document.querySelectorAll("[data-description]");
        elements.forEach(function(elem){
        var text_text = elem.textContent;
        if(text_text.length > 91){
            elem.textContent = text_text.substring(0, 91) + '...';
        }
    })
}

// сортировка
document.addEventListener('DOMContentLoaded', () => {

    const getSort = ({ target }) => {
        const order = (target.dataset.order = -(target.dataset.order || -1));
        const index = [...target.parentNode.cells].indexOf(target);
        const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
        const comparator = (index, order) => (a, b) => order * collator.compare(
            a.children[index].innerHTML,
            b.children[index].innerHTML
        );
        
        for(const tBody of target.closest('table').tBodies)
            tBody.append(...[...tBody.rows].sort(comparator(index, order)));

        for(const cell of target.parentNode.cells)
            cell.classList.toggle('sorted', cell === target);
    };
    
    document.querySelectorAll('.footer__right thead').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));
    
});
