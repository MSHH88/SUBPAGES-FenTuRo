/*
 * Steuerung aller optischen und logischen Anhängigkeiten
* */

//Grafik-Warenkorb
function img_basket(src) {
    let bild_name = src;
    const myArr = bild_name.split("/");
    let image_name_c = myArr[myArr.length - 1];
    let image_name_o = myArr[myArr.length - 1];
    let modul_name = myArr[myArr.length - 2];
    let modul_version = myArr[myArr.length - 3];
    let url = obj_konfig.images_path + "/" + modul_version + "/" + modul_name + "/";
    //console.log(  image_name_o,  image_name_c  );
    obj_konfig.basket_img = url + image_name_c;
    obj_konfig.basket_img_o = url + image_name_o;
}

function setViewImageBasket() {
    $("#img_rollladen").addClass("collapse");
    $("#img_oberlichtelement").addClass("collapse");
    $("#img_unterlichtelement").addClass("collapse");
    $("#img_fensterbankanschluss").addClass("collapse");
    if (obj_konfig.roll == "roll_1") {
        $("#img_rollladen").removeClass("collapse");
    }
    if (obj_konfig.oer_oben != "-") {
        $("#img_oberlichtelement").removeClass("collapse");
    }
    if (obj_konfig.oer_unten != "-") {
        $("#img_unterlichtelement").removeClass("collapse");
    }
    if (obj_konfig.febaan == "febaan_1") {
        $("#img_fensterbankanschluss").removeClass("collapse");
    }
}

//Profil
function mouseOverImgOER($bild, $divID) {
    document.getElementById($divID).src = $bild;
}

function rules_rab(obj_konfig) {
    if (obj_konfig.profil !== "p5" && obj_konfig.profil !== "p4" && obj_konfig.profil !== "p3" && obj_konfig.profil !== "p7") {
        $("#view_rab").css('display', 'block');
    } else {
        $("#view_rab").css('display', 'none');
        obj_konfig.rab = "rab_0";
        $("#rab_0").prop("checked", true);
    }
}

function rules_vanes_view(obj_konfig) {
    $("#vanes1").css('display', 'none');
    $("#vanes2").css('display', 'none');
    $("#vanes3").css('display', 'none');
    if (obj_konfig.art == "a1") {
        $("#vanes1").css('display', 'block');
    }
    if (obj_konfig.art == "a2") {
        $("#vanes2").css('display', 'block');
    }
    if (obj_konfig.art == "a3") {
        $("#vanes3").css('display', 'block');
    }
}

function rules_set_typ_default(obj_konfig) {
    let element = "";
    if (obj_konfig.art == "a1") {
        obj_konfig.typ = "typ1";
        setBorder("typ", "typ1");
        obj_konfig.oer = "fn_1_fest_ohne_fluegel";
        element = document.getElementById('fn_1_fest_ohne_fluegel');
        setBorder("oer", "fn_1_fest_ohne_fluegel");
    }
    if (obj_konfig.art == "a2") {
        obj_konfig.typ = "typ2";
        setBorder("typ", "typ2");
        obj_konfig.oer = "fn_2_festfluegel_festfluegel";
        element = document.getElementById('fn_2_festfluegel_festfluegel');
        setBorder("oer", "fn_2_festfluegel_festfluegel");
    }
    if (obj_konfig.art == "a3") {
        obj_konfig.typ = "typ3";
        setBorder("typ", "typ3");
        obj_konfig.oer = "fn_3_fest_fest_fest";
        element = document.getElementById('fn_3_fest_fest_fest');
        setBorder("oer", "fn_3_fest_fest_fest");
    }
    obj_konfig.oer_oben = "-";
    obj_konfig.basket_img_oberlicht = "";
    obj_konfig.oer_unten = "-";
    obj_konfig.basket_img_unterlicht = "";
    obj_konfig.main_handleside = "main_handleside_0";
    obj_konfig.ol_handleside = "ol_handleside_0";
    obj_konfig.ul_handleside = "ul_handleside_0";
    ul_kippgriffe(obj_konfig);
    ol_kippgriffe(obj_konfig);
    main_kippgriffe(obj_konfig);
    check_sprossen_oberlicht(obj_konfig);
    img_basket(element.src);
}

function rules_min_height_kipp_handle_side(obj_konfig) {
    if (obj_konfig.hoehe_ul < 370) {
        $('#message_min_ul_handle_side').removeClass('hidden');
        $('#ul_handleside_0').prop('checked', true);
        $('#ul_handleside_2').attr('disabled', true);
        $('#ul_handleside_3').attr('disabled', true);
        obj_konfig.ul_handleside = 'ul_handleside_0';
    } else {
        $('#message_min_ul_handle_side').addClass('hidden');
        $('#ul_handleside_2').attr('disabled', false);
        $('#ul_handleside_3').attr('disabled', false);
    }
    if (obj_konfig.hoehe_ol < 370) {
        $('#message_min_ol_handle_side').removeClass('hidden');
        $('#ol_handleside_0').prop('checked', true);
        $('#ol_handleside_2').attr('disabled', true);
        $('#ol_handleside_3').attr('disabled', true);
        obj_konfig.ol_handleside = 'ol_handleside_0';
    } else {
        $('#message_min_ol_handle_side').addClass('hidden');
        $('#ol_handleside_2').attr('disabled', false);
        $('#ol_handleside_3').attr('disabled', false);
    }
    if (obj_konfig.hoehe < 370) {
        $('#message_min_main_handle_side').removeClass('hidden');
        $('#main_handleside_0').prop('checked', true);
        $('#main_handleside_2').attr('disabled', true);
        $('#main_handleside_3').attr('disabled', true);
        obj_konfig.main_handleside = 'main_handleside_0';
    } else {
        $('#message_min_main_handle_side').addClass('hidden');
        $('#main_handleside_2').attr('disabled', false);
        $('#main_handleside_3').attr('disabled', false);
    }
    //$('#message_min_main_handle_side').addClass('hidden');
    //$('#message_min_ol_handle_side').addClass('hidden');
}

function check_sprossen_oberlicht(obj_konfig) {
    if (obj_konfig.oer_oben == "-") {
        obj_konfig.sprossenOU = "sprossenOU_0";
    }
}

function rules_vanes_value_default(obj_konfig) {
    if (obj_konfig.art == "a1") {
        obj_konfig.typ = "typ1";
        setBorder("typ", "typ1");
        obj_konfig.oer = "fn_1_fest_ohne_fluegel";
        setBorder("oer", "fn_1_fest_ohne_fluegel");
    }
    if (obj_konfig.art == "a2") {
        obj_konfig.typ = "typ2";
        setBorder("typ", "typ2");
        obj_konfig.oer = "fn_2_dreh_drehkipp_pfosten";
        setBorder("oer", "fn_2_dreh_drehkipp_pfosten");
    }
    if (obj_konfig.art == "a3") {
        obj_konfig.typ = "typ3";
        setBorder("typ", "typ3");
        obj_konfig.oer = "fn_3_drehkipp_drehlinks_drehkipp_pfosten";
        setBorder("oer", "fn_3_drehkipp_drehlinks_drehkipp_pfosten");
    }
    obj_konfig.oer_oben = "-";
    obj_konfig.oer_unten = "-";
    //OER gesteuert
    rules_oer_view(obj_konfig);
}

function rules_oer_view(obj_konfig) {
    $("#oer").css('display', 'none');
    $("#oer_oben").css('display', 'none');
    $("#oer_unten").css('display', 'none');
    if (obj_konfig.typ == "typ1"
        || obj_konfig.typ == "typ2"
        || obj_konfig.typ == "typ3") {
        $("#oer").css('display', 'block');
        $("#oer_oben").css('display', 'none');
        $("#oer_unten").css('display', 'none');
    }
    if (obj_konfig.typ == "typ1o1" || obj_konfig.typ == "typ1o2" || obj_konfig.typ == "typ1o3"
        || obj_konfig.typ == "typ2o1" || obj_konfig.typ == "typ2o2" || obj_konfig.typ == "typ2o3" ||
        obj_konfig.typ == "typ3o1" || obj_konfig.typ == "typ3o2" || obj_konfig.typ == "typ3o3") {
        $("#oer").css('display', 'block');
        $("#oer_oben").css('display', 'block');
        $("#oer_unten").css('display', 'none');
    }
    if (obj_konfig.typ == "typ1u1" || obj_konfig.typ == "typ1u2" || obj_konfig.typ == "typ1u3"
        || obj_konfig.typ == "typ2u1" || obj_konfig.typ == "typ2u2" || obj_konfig.typ == "typ2u3" ||
        obj_konfig.typ == "typ3u1" || obj_konfig.typ == "typ3u2" || obj_konfig.typ == "typ3u3") {
        $("#oer").css('display', 'block');
        $("#oer_oben").css('display', 'none');
        $("#oer_unten").css('display', 'block');
    }


    private_rules_oer_oer_oben_oer_unten(obj_konfig);
    rules_masse_view_input(obj_konfig);
}



function private_rules_oer_oer_oben_oer_unten(obj_konfig) {
    $("#fn_1_fluegel").css('display', 'none');
    $("#fn_2_fluegel").css('display', 'none');
    $("#fn_3_fluegel").css('display', 'none');
    $("#fn_1_fluegel_oe").css('display', 'none');
    $("#fn_2_fluegel_oe").css('display', 'none');
    $("#fn_3_fluegel_oe").css('display', 'none');
    $("#fn_1_fluegel_ue").css('display', 'none');
    $("#fn_2_fluegel_ue").css('display', 'none');
    $("#fn_3_fluegel_ue").css('display', 'none');
    //1
    if (obj_konfig.typ == "typ1" || obj_konfig.typ == "typ1o1" || obj_konfig.typ == "typ1o2" || obj_konfig.typ == "typ1o3"
        || obj_konfig.typ == "typ1u1" || obj_konfig.typ == "typ1u2" || obj_konfig.typ == "typ1u3") {
        $("#fn_1_fluegel").css('display', 'block');
    }
    if (obj_konfig.typ == "typ1o1") {
        $("#fn_1_fluegel_oe").css('display', 'block');
    }
    if (obj_konfig.typ == "typ1o2") {
        $("#fn_2_fluegel_oe").css('display', 'block');
    }
    if (obj_konfig.typ == "typ1o3") {
        $("#fn_3_fluegel_oe").css('display', 'block');
    }
    if (obj_konfig.typ == "typ1u1") {
        $("#fn_1_fluegel_ue").css('display', 'block');
    }
    if (obj_konfig.typ == "typ1u2") {
        $("#fn_2_fluegel_ue").css('display', 'block');
    }
    if (obj_konfig.typ == "typ1u3") {
        $("#fn_3_fluegel_ue").css('display', 'block');
    }
    //2
    if (obj_konfig.typ == "typ2" || obj_konfig.typ == "typ2o1" || obj_konfig.typ == "typ2o2" || obj_konfig.typ == "typ2o3"
        || obj_konfig.typ == "typ2u1" || obj_konfig.typ == "typ2u2" || obj_konfig.typ == "typ2u3") {
        $("#fn_2_fluegel").css('display', 'block');
    }
    if (obj_konfig.typ == "typ2o1") {
        $("#fn_1_fluegel_oe").css('display', 'block');
    }
    if (obj_konfig.typ == "typ2o2") {
        $("#fn_2_fluegel_oe").css('display', 'block');
    }
    if (obj_konfig.typ == "typ2o3") {
        $("#fn_3_fluegel_oe").css('display', 'block');
    }
    if (obj_konfig.typ == "typ2u1") {
        $("#fn_1_fluegel_ue").css('display', 'block');
    }
    if (obj_konfig.typ == "typ2u2") {
        $("#fn_2_fluegel_ue").css('display', 'block');
    }
    if (obj_konfig.typ == "typ2u3") {
        $("#fn_3_fluegel_ue").css('display', 'block');
    }
    //3
    if (obj_konfig.typ == "typ3" || obj_konfig.typ == "typ3o1" || obj_konfig.typ == "typ3o2" || obj_konfig.typ == "typ3o3"
        || obj_konfig.typ == "typ3u1" || obj_konfig.typ == "typ3u2" || obj_konfig.typ == "typ3u3") {
        $("#fn_3_fluegel").css('display', 'block');
    }
    if (obj_konfig.typ == "typ3o1") {
        $("#fn_1_fluegel_oe").css('display', 'block');
    }
    if (obj_konfig.typ == "typ3o2") {
        $("#fn_2_fluegel_oe").css('display', 'block');
    }
    if (obj_konfig.typ == "typ3o3") {
        $("#fn_3_fluegel_oe").css('display', 'block');
    }
    if (obj_konfig.typ == "typ3u1") {
        $("#fn_1_fluegel_ue").css('display', 'block');
    }
    if (obj_konfig.typ == "typ3u2") {
        $("#fn_2_fluegel_ue").css('display', 'block');
    }
    if (obj_konfig.typ == "typ3u3") {
        $("#fn_3_fluegel_ue").css('display', 'block');
    }
}

function rules_check_oer_by_typ(obj_konfig) {
    if (obj_konfig.typ == "typ1o1"
        || obj_konfig.typ == "typ2o1"
        || obj_konfig.typ == "typ3o1") {
        obj_konfig.oer_unten = "-";
        obj_konfig.oer_oben = "fn_1_oberlicht_f";
        var obj = getHTMLObjectById("fn_1_oberlicht_f");
        ////console.log(obj.src);
        obj_konfig.basket_img_oberlicht = obj.src;
        setBorder(obj.name, obj.id);
    }
    if (obj_konfig.typ == "typ1o2"
        || obj_konfig.typ == "typ2o2"
        || obj_konfig.typ == "typ3o2") {
        obj_konfig.oer_unten = "-";
        obj_konfig.oer_oben = "ob_f_f";
        var obj = getHTMLObjectById("ob_f_f");
        ////console.log(obj.src);
        obj_konfig.basket_img_oberlicht = obj.src;
        setBorder(obj.name, obj.id);
    }
    if (obj_konfig.typ == "typ1o3"
        || obj_konfig.typ == "typ2o3"
        || obj_konfig.typ == "typ3o3") {
        obj_konfig.oer_unten = "-";
        obj_konfig.oer_oben = "ob_f_f_f";
        var obj = getHTMLObjectById("ob_f_f_f");
        ////console.log(obj.src);
        obj_konfig.basket_img_oberlicht = obj.src;
        setBorder(obj.name, obj.id);
    }
    if (obj_konfig.typ == "typ1u1"
        || obj_konfig.typ == "typ2u1"
        || obj_konfig.typ == "typ3u1") {
        obj_konfig.oer_oben = "-";
        obj_konfig.oer_unten = "fn_1_unterlicht_f";
        var obj = getHTMLObjectById("fn_1_unterlicht_f");
        obj_konfig.basket_img_unterlicht = obj.src;
        setBorder(obj.name, obj.id);
    }
    if (obj_konfig.typ == "typ1u2"
        || obj_konfig.typ == "typ2u2"
        || obj_konfig.typ == "typ3u2") {
        obj_konfig.oer_oben = "-";
        obj_konfig.oer_unten = "ub_f_f";
        var obj = getHTMLObjectById("ub_f_f");
        obj_konfig.basket_img_unterlicht = obj.src;
        setBorder(obj.name, obj.id);
    }
    if (obj_konfig.typ == "typ1u3"
        || obj_konfig.typ == "typ2u3"
        || obj_konfig.typ == "typ3u3") {
        obj_konfig.oer_oben = "-";
        obj_konfig.oer_unten = "ub_f_f_f";
        var obj = getHTMLObjectById("ub_f_f_f");
        obj_konfig.basket_img_unterlicht = obj.src;
        setBorder(obj.name, obj.id);
    }
}

function rules_masse_view_input(obj_konfig) {
    $('#hoehe_ol').attr('readonly', true);
    $('#hoehe_ul').attr('readonly', true);
    $('#hoehe_ol_view').addClass('hidden');
    $('#hoehe_ul_view').addClass('hidden');
    if (obj_konfig.typ == "typ1"
        || obj_konfig.typ == "typ2"
        || obj_konfig.typ == "typ3") {
        obj_konfig.hoehe_ol = 0;
        obj_konfig.hoehe_ul = 0;
    }
    if (obj_konfig.typ == "typ1o1" || obj_konfig.typ == "typ1o2" || obj_konfig.typ == "typ1o3"
        || obj_konfig.typ == "typ2o1" || obj_konfig.typ == "typ2o2" || obj_konfig.typ == "typ2o3" ||
        obj_konfig.typ == "typ3o1" || obj_konfig.typ == "typ3o2" || obj_konfig.typ == "typ3o3") {
        $('#hoehe_ol').attr('readonly', false);
        $('#hoehe_ol_view').removeClass('hidden');
        obj_konfig.hoehe_ul = 0;
    }
    if (obj_konfig.typ == "typ1u1" || obj_konfig.typ == "typ1u2" || obj_konfig.typ == "typ1u3"
        || obj_konfig.typ == "typ2u1" || obj_konfig.typ == "typ2u2" || obj_konfig.typ == "typ2u3" ||
        obj_konfig.typ == "typ3u1" || obj_konfig.typ == "typ3u2" || obj_konfig.typ == "typ3u3") {
        $('#hoehe_ul').attr('readonly', false);
        $('#hoehe_ul_view').removeClass('hidden');
        obj_konfig.hoehe_ol = 0;
    }
}

function checkMinMaxMasse(obj_konfig, flag = false) {
    var main_minmax = new Array();
    main_minmax = setMinMax(obj_konfig);
    if (undefined == main_minmax.data) {
        return false;
    }
    var breite_sum = 0;
    var hoehe_sum = 0;
    var breite = 0;
    var hoehe = 0;
    var hoehe_ol = 0;
    var hoehe_ul = 0;
    $('#hoehe_ol').val(hoehe_ol);
    $('#hoehe_ul').val(hoehe_ul);
    $('#min_max_breite').html('zulässiger Bereich von ' + main_minmax.data[0].min_breite + ' bis ' + main_minmax.data[0].max_breite + ' mm');
    $("#breite").attr({
        "max": main_minmax.data[0].max_breite,
        "min": main_minmax.data[0].min_breite
    });
    if (parseFloat(obj_konfig.breite) > parseFloat(main_minmax.data[0].min_breite) &&
        parseFloat(obj_konfig.breite) <= parseFloat(main_minmax.data[0].max_breite) && !flag) {
        breite = parseFloat(obj_konfig.breite);
    } else {
        breite = parseFloat(main_minmax.data[0].min_breite);
    }
    $('#breite').val(breite);
    obj_konfig.breite = breite;
    $('#min_max_hoehe').html('zulässiger Bereich von ' + main_minmax.data[0].min_hoehe + ' bis ' + main_minmax.data[0].max_hoehe + ' mm');
    $("#hoehe").attr({
        "max": main_minmax.data[0].max_hoehe,
        "min": main_minmax.data[0].min_hoehe
    });
    if (parseFloat(obj_konfig.hoehe) > parseFloat(main_minmax.data[0].min_hoehe) &&
        parseFloat(obj_konfig.hoehe) <= parseFloat(main_minmax.data[0].max_hoehe) && !flag) {
        hoehe = parseFloat(obj_konfig.hoehe);
    } else {
        hoehe = parseFloat(main_minmax.data[0].min_hoehe);
    }
    $('#hoehe').val(hoehe);
    obj_konfig.hoehe = hoehe;
    // Oberlicht berechnen
    if (obj_konfig.oer_oben != "-") {
        var erg_oben = new Array();
        erg_oben = checkMinMaxOben(obj_konfig);
        $('#min_max_hoehe_ol').html('zulässiger Bereich von ' + erg_oben.data[0].min_hoehe + ' bis ' + erg_oben.data[0].max_hoehe + ' mm');
        $("#hoehe_ol").attr({
            "max": erg_oben.data[0].max_hoehe,
            "min": erg_oben.data[0].min_hoehe
        });
        if (parseFloat(obj_konfig.hoehe_ol) > parseFloat(erg_oben.data[0].min_hoehe) &&
            parseFloat(obj_konfig.hoehe_ol) <= parseFloat(erg_oben.data[0].max_hoehe) && !flag) {
            hoehe_ol = parseFloat(obj_konfig.hoehe_ol);
        } else {
            hoehe_ol = parseFloat(erg_oben.data[0].min_hoehe);
        }
        ////console.log('Check', hoehe_ol);
        $('#hoehe_ol').val(hoehe_ol);
        obj_konfig.hoehe_ol = hoehe_ol;
    }
    //Unterlicht checken
    if (obj_konfig.oer_unten != "-") {
        var erg_unten = new Array();
        erg_unten = checkMinMaxUnten(obj_konfig);
        $('#min_max_hoehe_ul').html('zulässiger Bereich von ' + erg_unten.data[0].min_hoehe + ' bis ' + erg_unten.data[0].max_hoehe + ' mm');
        $("#hoehe_ul").attr({
            "max": erg_unten.data[0].max_hoehe,
            "min": erg_unten.data[0].min_hoehe
        });
        if (parseFloat(obj_konfig.hoehe_ul) > parseFloat(erg_unten.data[0].min_hoehe) &&
            parseFloat(obj_konfig.hoehe_ul) <= parseFloat(erg_unten.data[0].max_hoehe) && !flag) {
            hoehe_ul = parseFloat(obj_konfig.hoehe_ul);
        } else {
            hoehe_ul = parseFloat(erg_unten.data[0].min_hoehe);
        }
        $('#hoehe_ul').val(hoehe_ul);
        obj_konfig.hoehe_ul = hoehe_ul;
    }
    // Summen bilden
    $("#breite_sum").html("Gesamtbreite: " + breite + " mm");
    tmp_fbaan = 0;
    if (obj_konfig.febaan == "febaan_1") {
        tmp_fbaan = 30;
    }
    tmp_h = parseFloat(hoehe) + parseFloat(hoehe_ol) + parseFloat(hoehe_ul) + parseFloat(tmp_fbaan);
    $("#hoehe_sum").html("Gesamthöhe: " + tmp_h + " mm");
    check_griffhoehe(obj_konfig);
    
    check_dimension_by_oer (obj_konfig);
    
}

function check_dimension_by_oer (obj_konfig) {
	$("#dimension_view").addClass('collapse');
	if ( (obj_konfig.oer == "fn_1_drehkipp_rechts" || obj_konfig.oer == "fn_1_drehkipp_links") && obj_konfig.breite >= 1250) {
		$("#dimension_view").removeClass('collapse');
	}	
}

function checkMinMaxOben(obj_konfig) {
    var erg = new Array();
    $.ajax({
        url: conf_url + '/ajax/minmax/',
        type: 'POST',
        data: {csrf_cyko: global_hash, conf_obj: obj_konfig, flag: "up"},
        async: false,
        complete: function (data) {
            erg = jQuery.parseJSON(data.responseText);
        },
        beforeSend: function () {
        }
    });
    return erg;
}

function checkMinMaxUnten(obj_konfig) {
    var erg = new Array();
    $.ajax({
        url: conf_url + '/ajax/minmax/',
        type: 'POST',
        data: {csrf_cyko: global_hash, conf_obj: obj_konfig, flag: "down"},
        async: false,
        complete: function (data) {
            erg = jQuery.parseJSON(data.responseText);
        },
        beforeSend: function () {
        }
    });
    return erg;
}

function check_message_febaan(obj_konfig) {
    $('#message_febaan').addClass('collapse');
    if (obj_konfig.febaan == "febaan_1") {
        $('#message_febaan').removeClass('collapse');
    }
}

// Farbe
function rules_farben_check_gleich_i(obj_konfig) {
    if (obj_konfig.dekofarbe_i !== "fs1_01_i") {
        var color_a = obj_konfig.dekofarbe_i.substr(0, obj_konfig.dekofarbe_i.length - 2);
        obj_konfig.dekofarbe_a = color_a;
        setBorder("dekofarbe_a", color_a);
    }
}

function rules_farben_check_gleich_a(obj_konfig) {
    if (obj_konfig.dekofarbe_i !== "fs1_01_i") {
        var color_i = obj_konfig.dekofarbe_a + "_i";
        obj_konfig.dekofarbe_i = color_i;
        setBorder("dekofarbe_i", color_i);
    }
}

function rules_kernfarbe_check(obj_konfig) {
    checkKernFarbe(obj_konfig)
    /*
    if (obj_konfig.dekofarbe_a !== "fs1_01" && obj_konfig.dekofarbe_i !== "fs1_01_i"  ) {
        $("#kf_braun_mess").addClass('hidden');
    }else{
        $("#kf_braun_mess").removeClass('hidden');
        obj_konfig.kf = "kf_0";
        setBorder('kf', "kf_0");

    }*/
}

function kernColorRules() {
    let fi = "dekofarbe_i";
    let fa = "dekofarbe_a";
    let kernradios = "kf";
    let innen = obj_konfig[fi].split('_')[1];
    let aussen = obj_konfig[fa].split('_')[1];
    let weiss = $("#kf_0");
    let braun = $("#kf_1");
    let anthr = $("#kf_2");
    $('.kf').removeClass('disabled')
    //console.log('i',innen)
    //console.log('a',aussen)
    // fn_farbe_a_xy //
    let kernfarben = {
        "01": {"w": 1, "b": 0, "a": 0}, // Weiss (ohne Dekorfarbe)
        "03": {"w": 0, "b": 1, "a": 0}, // Schokobraun (887505)
        "05": {"w": 0, "b": 1, "a": 0}, // Eiche Dunkel (2052089)
        "07": {"w": 0, "b": 1, "a": 0}, // Mahagoni (2097013)
        "02": {"w": 1, "b": 1, "a": 1}, // antraagrau (1701605)
        "04": {"w": 0, "b": 1, "a": 0}, // Golden Oak (2178001)
        "10": {"w": 0, "b": 1, "a": 0}, // Nussbaum (2178007)
        "06": {"w": 0, "b": 1, "a": 0}, // Macore (3162002)
        "25": {"w": 0, "b": 1, "a": 0}, // Oregon (2115008)
        "21": {"w": 0, "b": 1, "a": 0}, // Eiche Hell (2052090)
        "19": {"w": 0, "b": 1, "a": 0}, // Streifen Douglasie (3152009)
        "20": {"w": 1, "b": 1, "a": 0}, // Eiche Natur (3118076)
        "23": {"w": 1, "b": 0, "a": 0}, // Cremeweiss (1137905)
        "12": {"w": 1, "b": 0, "a": 1}, // Grau (715505)
        "26": {"w": 0, "b": 1, "a": 0}, // Schwarzbraun (851805)
        "17": {"w": 1, "b": 0, "a": 0}, // Brillantblau (1500705)
        "18": {"w": 1, "b": 0, "a": 0}, // Dunkelgrün (612505)
        "28": {"w": 1, "b": 0, "a": 0}, // Moosgrün (1600505)
        "16": {"w": 1, "b": 0, "a": 0}, // Dunkelrot (308105)
        "27": {"w": 0, "b": 1, "a": 0}, // Braun Maron (809905)
        "24": {"w": 1, "b": 1, "a": 1}, // Quarzgrau (703905)
        "11": {"w": 0, "b": 1, "a": 0}, // Winchester XA (49240-015)
        "31": {"w": 1, "b": 1, "a": 1}, // Quarzgrau glatt (703905-083)
        "15": {"w": 1, "b": 1, "a": 1}, // Basaltgrau (701205)
        "35": {"w": 1, "b": 0, "a": 1}, // Lichtgrau (7251)
        "14": {"w": 1, "b": 0, "a": 0}, // Weiss FX strukturiert (915205-168)
        "30": {"w": 1, "b": 1, "a": 1}, // Basaltgrau glatt (701205-083)
        "29": {"w": 1, "b": 1, "a": 1}, // anthrazit glatt (701605-083)
        "32": {"w": 1, "b": 0, "a": 0}, // Aluminium gebürstet (1298702-195)
        "33": {"w": 1, "b": 1, "a": 1}, // Betongrau (702305)
        "22": {"w": 0, "b": 1, "a": 0}, // Bergkiefer (9.3069041)
        "13": {"w": 1, "b": 0, "a": 0}, // Sheffield Oak Light (F456-3081)
        "34": {"w": 1, "b": 1, "a": 1}, // Crown Platin (9.1293001)
        "36": {"w": 1, "b": 1, "a": 1}, // Eisenglimmer Schiefer (DB703)
        "37": {"w": 1, "b": 1, "a": 1}, // Schiefergrau glatt (7015)
        "08": {"w": 1, "b": 1, "a": 1}, // Schwarz Ulti-Matt
        "09": {"w": 1, "b": 1, "a": 1} // a  Ulti-Matt
    }
    if (innen === aussen) {
        let rule = kernfarben[aussen];
        //console.log('---- Kernfarbe regel ---',rule)
        //erlaube weiss
        if (rule.w === 1) {
            //console.log('erlaube weiss')
            //weiss.attr("disabled", false);
            weiss.removeClass('disabled')
        } else {
            //weiss.attr("disabled", true);
            //console.log('verbiete weiss')
            weiss.addClass('disabled')
        }
        //erlaub braun
        if (rule.b === 1) {
            //braun.attr("disabled", false);
            //console.log('erlaube braun')
            braun.removeClass('disabled')
        } else {
            //braun.attr("disabled", true);
            //console.log('verbiete braun')
            braun.addClass('disabled')
        }
        //erlaube athrazit
        //anthrazit nur bei iglo energy classic p3
        if (obj_konfig.profil === 'p3' && rule.a === 1) {
            //anthr.attr("disabled", false);
            //console.log('erlaube anthrazit wegen')
            anthr.removeClass('disabled')
        } else {
            //anthr.attr("disabled", true);
            //console.log('verbiete anthrazit')
            anthr.addClass('disabled')
        }
        //prüfen ob durch regel deaktivierte Kernfarbe ausgewählt ist, wenn dass der fall, dann freie kernfarbe wählen
        $('#view_kernfarben img.disabled.auswahl').each(function () {
            let attr_id = $(this).attr('id');
            if (attr_id === 'kf_0') {
                if (rule.b === 1) {
                    //console.log('set to brown 1 ')
                    //braun.trigger('click')
                    $('#kf_1').removeClass('disabled')
                    setBorder("kf", "kf_1");
                    obj_konfig.kf = 'kf_1';
                }
            }
            if (attr_id === 'kf_1') {
                if (rule.w === 1) {
                    //console.log('set to white 2 ')
                    //weiss.trigger('click')
                    $('#kf_0').removeClass('disabled')
                    setBorder("kf", "kf_0");
                    obj_konfig.kf = 'kf_0';
                }
            }
            if (attr_id === 'kf_2') {
                if (rule.w === 1) {
                    //console.log('set to white 3')
                    //weiss.trigger('click')
                    $('#kf_0').removeClass('disabled')
                    setBorder("kf", "kf_0");
                    obj_konfig.kf = 'kf_0';
                } else {
                    //console.log('set to brown 4')
                    //braun.trigger('click')
                    $('#kf_1').removeClass('disabled')
                    setBorder("kf", "kf_1");
                    obj_konfig.kf = 'kf_1';
                }
            }
        })
    } else {
        //console.log('no rule: set to white')
        $('#kf_0').removeClass('disabled')
        setBorder("kf", "kf_0");
        obj_konfig.kf = 'kf_0';
    }
}

function checkKernFarbe(obj_konfig) {
    //console.log('---Kernfarbenregeln---')
    $("#kf_braun_mess").removeClass('hidden');
    if (obj_konfig.profil !== 'p3') {
        $("#kf_energy_classic_mess").removeClass('hidden');
    } else {
        $("#kf_energy_classic_mess").addClass('hidden');
    }
    if (obj_konfig.profil == 'p5') {
        $("#kf_iglo_light_mess").removeClass('hidden');
        $("#kf_energy_classic_mess").addClass('hidden');
    } else {
        $("#kf_iglo_light_mess").addClass('hidden');
    }
    if (obj_konfig.dekofarbe_i.replace('_i', '') === obj_konfig.dekofarbe_a) {
        $("#kf_braun_mess").addClass('hidden');
    } else {
        $("#kf_0").removeClass('disabled')
        $("#kf_1").addClass('disabled');
        $("#kf_2").addClass('disabled');
        if (obj_konfig.kf !== 'kf_0') {
            obj_konfig.kf = "kf_0";
            setBorder('kf', "kf_0");
        }
        return;
    }
    if (obj_konfig.dekofarbe_a == "fs1_01" ||
        obj_konfig.dekofarbe_i == "fs1_01_i"
        || obj_konfig.profil === "p5" // p5 Iglo light
    ) {
        //console.log('---Kernfarbenregeln--- Farbe ist weiss oder  Iglo light')
        $("#kf_0").removeClass('disabled')
        $("#kf_1").addClass('disabled');
        $("#kf_2").addClass('disabled');
        if (obj_konfig.kf !== 'kf_0') {
            //$("#kf_0").trigger('click');
            setBorder("kf", "kf_0");
            obj_konfig.kf = 'kf_0';
        }
        return;
    }
    kernColorRules()
}

function dichtungsfarbeSwisspacer(obj_konfig) {
    // wenn dichtungsfarbe innen oder aussen grau, dann schlage bei 2fach verglasung swisspacer gau vor
    if (obj_konfig.dfa === 'dfa_1' || obj_konfig.dfi === 'dfi_1') {
        //console.log('set wak')
        obj_konfig.warme_kante = 'wk_2';
    }
}

function _farbe_aussen_rest(obj) {
    if ($("#farbe_aussen_rest").hasClass('collapse')) {
        $("#farbe_aussen_rest").removeClass('collapse')
    } else {
        $("#farbe_aussen_rest").addClass('collapse')
    }
}

function check_farbeaussen_rest_view(obj_konfig) {
    if (obj_konfig.dekofarbe_a !== 'fs1_01' && obj_konfig.dekofarbe_a !== 'fs1_02' && obj_konfig.dekofarbe_a !== 'fs1_03' && obj_konfig.dekofarbe_a !== 'fs1_04' && obj_konfig.dekofarbe_a !== 'fs1_05' && obj_konfig.dekofarbe_a !== 'fs1_06') {
        $("#farbe_aussen_rest").removeClass('collapse');
    } else {
        $("#farbe_aussen_rest").addClass('collapse');
    }
}

function _farbe_innen_rest(obj) {
    if ($("#farbe_innen_rest").hasClass('collapse')) {
        $("#farbe_innen_rest").removeClass('collapse')
    } else {
        $("#farbe_innen_rest").addClass('collapse')
    }
}

function check_farbeinnen_rest_view(obj_konfig) {
    if (obj_konfig.dekofarbe_i !== 'fs1_01_i' && obj_konfig.dekofarbe_i !== 'fs1_02_i' && obj_konfig.dekofarbe_i !== 'fs1_03_i' && obj_konfig.dekofarbe_i !== 'fs1_04_i' && obj_konfig.dekofarbe_i !== 'fs1_05_i' && obj_konfig.dekofarbe_i !== 'fs1_06_i') {
        $("#farbe_innen_rest").removeClass('collapse');
    } else {
        $("#farbe_innen_rest").addClass('collapse');
    }
}

//GLAS
function rules_view_warme_kante(obj_konfig) {
    if(obj_konfig.profil=='p100'){ //IGLO5 Aktion 2023-05
        obj_konfig.glas='g4';
        $('#div_warme_kante').removeClass('hidden');
        $('.glas').parent().hide();
        $('#g4').parent().show();
    }
    if (obj_konfig.glas == "g2" || obj_konfig.glas == "g4") {
        $('#div_warme_kante').removeClass('hidden');
    } else {
        $('#div_warme_kante').addClass('hidden');
        obj_konfig.warme_kante = "wk_1";
        setBorder("warme_kante", "wk_1");
    }
}

function rules_view_glas_schallschutz(obj_konfig) {
    $("#_schalschutz_").css('display', 'none');
    if (obj_konfig.schallschutz == "schallschutz_ja") {
        $("#_schalschutz_").css('display', 'block');
    }
}

function rules_glas_schallschutz_default(obj_konfig) {
    obj_konfig.schallschutz_db = "schallschutz_stufe01";
    var obj = getHTMLObjectById(obj_konfig.schallschutz_db);
    setBorder(obj.name, obj.id);
}

function rules_view_schallschutz_by_glas(obj_konfig) {
    $("#schallschutz_stufe01").css('display', 'none');
    $("#schallschutz_stufe01_h3").css('display', 'none');
    $('#s1').addClass(' collapse ');
    $("#schallschutz_stufe02").css('display', 'none');
    $("#schallschutz_stufe02_h3").css('display', 'none');
    $('#s2').addClass(' collapse ');
    $("#schallschutz_stufe03").css('display', 'none');
    $("#schallschutz_stufe03_h3").css('display', 'none');
    $('#s3').addClass(' collapse ');
    $("#schallschutz_stufe04").css('display', 'none');
    $("#schallschutz_stufe04_h3").css('display', 'none');
    $('#s4').addClass(' collapse ');
    $("#schallschutz_stufe05").css('display', 'none');
    $("#schallschutz_stufe05_h3").css('display', 'none');
    $('#s5').addClass(' collapse ');
    if (obj_konfig.schallschutz === "schallschutz_ja"
        && (obj_konfig.glas === "g1" || obj_konfig.glas === "g2")) {
        $("#schallschutz_stufe01").css('display', 'block');
        $("#schallschutz_stufe01_h3").css('display', 'block');
        $('#s1').removeClass(' collapse ');
        $("#schallschutz_stufe02").css('display', 'block');
        $("#schallschutz_stufe02_h3").css('display', 'block');
        $('#s2').removeClass(' collapse ');
        $("#schallschutz_stufe03").css('display', 'block');
        $("#schallschutz_stufe03_h3").css('display', 'block');
        $('#s3').removeClass(' collapse ');
        $("#schallschutz_stufe04").css('display', 'block');
        $("#schallschutz_stufe04_h3").css('display', 'block');
        $('#s4').removeClass(' collapse ');
        $("#schallschutz_stufe05").css('display', 'block');
        $("#schallschutz_stufe05_h3").css('display', 'block');
        $('#s5').removeClass(' collapse ');
    }
    if (obj_konfig.schallschutz === "schallschutz_ja"
        && (obj_konfig.glas === "g3" || obj_konfig.glas === "g4")) {
        $("#schallschutz_stufe01").css('display', 'block');
        $("#schallschutz_stufe01_h3").css('display', 'block');
        $('#s1').removeClass(' collapse ');
        $("#schallschutz_stufe02").css('display', 'block');
        $("#schallschutz_stufe02_h3").css('display', 'block');
        $('#s2').removeClass(' collapse ');
        $("#schallschutz_stufe03").css('display', 'block');
        $("#schallschutz_stufe03_h3").css('display', 'block');
        $('#s3').removeClass(' collapse ');
        $("#schallschutz_stufe04").css('display', 'block');
        $("#schallschutz_stufe04_h3").css('display', 'block');
        $('#s4').removeClass(' collapse ');
        $("#schallschutz_stufe05").css('display', 'block');
        $("#schallschutz_stufe05_h3").css('display', 'block');
        $('#s5').removeClass(' collapse ');
    }
    if(obj_konfig.profil==='p1' || obj_konfig.profil==='p100' ||
        obj_konfig.profil==='p2' ||
        obj_konfig.profil==='p5'
    ){
        if(obj_konfig.glas==='g1' || obj_konfig.glas==='g2'){
            $("#schallschutz_stufe05").css('display', 'none');
            $("#schallschutz_stufe05_h3").css('display', 'none');
            $('#s5').addClass(' collapse ');
        }
        if(obj_konfig.glas==='g3' || obj_konfig.glas==='g4'){
            $("#schallschutz_stufe02").css('display', 'none');
            $("#schallschutz_stufe02_h3").css('display', 'none');
            $('#s2').addClass(' collapse ');
            $("#schallschutz_stufe04").css('display', 'none');
            $("#schallschutz_stufe04_h3").css('display', 'none');
            $('#s4').addClass(' collapse ');
            $("#schallschutz_stufe05").css('display', 'none');
            $("#schallschutz_stufe05_h3").css('display', 'none');
            $('#s5').addClass(' collapse ');
        }

    }
    if(obj_konfig.profil==='p3' ||
        obj_konfig.profil==='p4'
    ){
        if(obj_konfig.glas==='g1' || obj_konfig.glas==='g2'){
            $("#schallschutz_stufe02").css('display', 'none');
            $("#schallschutz_stufe02_h3").css('display', 'none');
            $('#s2').addClass(' collapse ');
            $("#schallschutz_stufe04").css('display', 'none');
            $("#schallschutz_stufe04_h3").css('display', 'none');
            $('#s4').addClass(' collapse ');
        }
        if(obj_konfig.glas==='g3' || obj_konfig.glas==='g4'){
            $("#schallschutz_stufe02").css('display', 'none');
            $("#schallschutz_stufe02_h3").css('display', 'none');
            $('#s2').addClass(' collapse ');
        }
    }

}

function sicherheits_glas_stumm(obj_konfig) {
    $("#sicherheitsverglasung_1").prop("disabled", false);
    $("#message_sicherheit").addClass(" collapse ");
    $("#_sicherheit_2").css('display', 'none');
    $("#_sicherheit_3").css('display', 'none');
    if (/*obj_konfig.schallschutz_db == "schallschutz_stufe03" ||*/ obj_konfig.schallschutz_db == "schallschutz_stufe04") {
        /*
        $("#sicherheitsverglasung_0").prop("checked", true);
        $("#sicherheitsverglasung_1").prop("disabled", true);
        $("#message_sicherheit").removeClass(" collapse ");
        obj_konfig.sicherheitsverglasung = "sicherheitsverglasung_0";
        obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_2_1";
        if (obj_konfig.glas == "g1" || obj_konfig.glas == "g2") {
            obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_2_1";
            if ($("#verglasung_typ_2_1").length > 0) {
                var obj = getHTMLObjectById(obj_konfig.sicherheitsverglasung_typ);
                setBorder(obj.name, obj.id);
            }
        }
        if (obj_konfig.glas == "g3" || obj_konfig.glas == "g4") {
            obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_3_1";
            if ($("#verglasung_typ_3_1").length > 0) {
                var obj = getHTMLObjectById(obj_konfig.sicherheitsverglasung_typ);
                setBorder(obj.name, obj.id);
            }
        }
        */
        if (obj_konfig.glas == "g5") {
            obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_1_1";
        }
    } else {
        if ((obj_konfig.glas == "g1" || obj_konfig.glas == "g2")
            && obj_konfig.sicherheitsverglasung == "sicherheitsverglasung_1") {
            $("#_sicherheit_2").css('display', 'block');
            $("#sicherheitsverglasung_1").prop("checked", true);
        }
        if ((obj_konfig.glas == "g3" || obj_konfig.glas == "g4")
            && obj_konfig.sicherheitsverglasung == "sicherheitsverglasung_1") {
            $("#_sicherheit_3").css('display', 'block');
            $("#sicherheitsverglasung_1").prop("checked", true);
        }
    }
}

function rules_view_sicherheit(obj_konfig) {
    if (obj_konfig.sicherheitsverglasung == "sicherheitsverglasung_0") {
        $("#_sicherheit_2").css('display', 'none');
        $("#_sicherheit_3").css('display', 'none');
    }
    if (obj_konfig.sicherheitsverglasung == "sicherheitsverglasung_1"
        && (obj_konfig.glas == "g1" || obj_konfig.glas == "g2")) {
        $("#_sicherheit_2").css('display', 'block');
    }
    if (obj_konfig.sicherheitsverglasung == "sicherheitsverglasung_1"
        && (obj_konfig.glas == "g3" || obj_konfig.glas == "g4")) {
        $("#_sicherheit_3").css('display', 'block');
    }
}

function rules_set_sicherheit_default(obj_konfig) {
    if (obj_konfig.glas == "g1" || obj_konfig.glas == "g2") {
        obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_2_1";
    }
    if (obj_konfig.glas == "g3" || obj_konfig.glas == "g4") {
        obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_3_1";
    }
    if (obj_konfig.glas == "g5") {
        obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_1_1";
    }
    var obj = getHTMLObjectById(obj_konfig.sicherheitsverglasung_typ);
    setBorder(obj.name, obj.id);
}

function rules_special_view_sicherheit(obj_konfig) {
    $('#s2_7').removeClass(' collapse ');
    $('#s2_8').removeClass(' collapse ');
    $('#s3_7').removeClass(' collapse ');
    if (obj_konfig.schallschutz == "schallschutz_ja"
        && obj_konfig.schallschutz_db == "schallschutz_stufe01") {
        $('#s2_7').addClass(' collapse ');
        $('#s2_8').addClass(' collapse ');
        if (obj_konfig.sicherheitsverglasung_typ == "verglasung_typ_2_8"
            || obj_konfig.sicherheitsverglasung_typ == "verglasung_typ_2_7") {
            obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_2_1";
            var obj = getHTMLObjectById(obj_konfig.sicherheitsverglasung_typ);
            setBorder(obj.name, obj.id);
        }
    }
    if (obj_konfig.schallschutz == "schallschutz_ja"
        && obj_konfig.schallschutz_db == "schallschutz_stufe01") {
        $('#s3_7').addClass(' collapse ');
        if (obj_konfig.sicherheitsverglasung_typ == "verglasung_typ_3_7") {
            obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_3_1";
            var obj = getHTMLObjectById(obj_konfig.sicherheitsverglasung_typ);
            setBorder(obj.name, obj.id);
        }
    }
}

function rules_ornamentSicherheit(obj_konfig) {
    if ((obj_konfig.glas === 'g1' || obj_konfig.glas === 'g2') && obj_konfig.ornament === 'ornament_1') {
        //console.log('rule ornament 1')
        $('.sicherheitsverglasung_typ').each(function () {
            $(this).parent().addClass('disabled');
            $(this).removeAttr('onclick');
        })
        $('#verglasung_typ_2_1').parent().removeClass('disabled');
        $('#verglasung_typ_2_1').attr('onclick', 'sicherheit_typ(this)');
        $('#verglasung_typ_2_4').parent().removeClass('disabled');
        $('#verglasung_typ_2_4').attr('onclick', 'sicherheit_typ(this)');
        $('#verglasung_typ_2_7').parent().removeClass('disabled');
        $('#verglasung_typ_2_7').attr('onclick', 'sicherheit_typ(this)');
        if (obj_konfig.sicherheitsverglasung_typ !== 'verglasung_typ_2_1' &&
            obj_konfig.sicherheitsverglasung_typ !== 'verglasung_typ_2_4' &&
            obj_konfig.sicherheitsverglasung_typ !== 'verglasung_typ_2_7'
        ) {
            //console.log('rule ornament def')
            obj_konfig.sicherheitsverglasung_typ = 'verglasung_typ_2_1';
            setBorder('sicherheitsverglasung_typ', 'verglasung_typ_2_1');
        }
    } else {
        //console.log('rule ornament 2')
        $('.sicherheitsverglasung_typ').each(function () {
            $(this).parent().removeClass('disabled');
            $(this).attr('onclick', 'sicherheit_typ(this)');
        })
    }
}


function rule_35Fest(){
    /* wenn ein element/flügel/ol/ul > 3,5qm dann
    * schallschutz nein
    * ornament nein
    * sicherheitsverglasung ja -> nur verglasung_typ_3_7 bzw 2_8 (Außen: ESG 6mm + Innen: ESG 6mm (Einscheibensicherheitsglas))
    *
    * */
    let setrule=false;
    let a_main=(parseFloat(obj_konfig.breite)*parseFloat(obj_konfig.hoehe))/1000000;
    let a_ol=(parseFloat(obj_konfig.breite)*parseFloat(obj_konfig.hoehe_ol))/1000000;
    let a_ul=(parseFloat(obj_konfig.breite)*parseFloat(obj_konfig.hoehe_ul))/1000000;
    let teil_ol=obj_konfig.typ.split('o')[1];
    let teil_ul=obj_konfig.typ.split('u')[1];
    let a_max=3.5;
    let threshold=0;
    //console.log('35fest',a_main);
    if(obj_konfig.typ.indexOf('typ1')>-1){
        threshold=a_main
    }
    if(obj_konfig.typ.indexOf('typ2')>-1){
        threshold=a_main / 2;
    }
    if(obj_konfig.typ.indexOf('typ3')>-1){
        threshold=a_main / 3;
    }
    if (threshold > a_max) {
        setrule = true;
    }
    threshold=a_main
    ////console.log('35 threshold', threshold, obj_konfig.typ)


    if (obj_konfig.typ === 'typ1o1' || obj_konfig.typ === 'typ1o2' || obj_konfig.typ === 'typ1o3' ||
        obj_konfig.typ === 'typ2o1' || obj_konfig.typ === 'typ2o2' || obj_konfig.typ === 'typ2o3' ||
        obj_konfig.typ === 'typ3o1' || obj_konfig.typ === 'typ3o2' || obj_konfig.typ === 'typ3o3'
    ) {
        //console.log('a_ol', a_ol, 'tile_ol', teil_ol)
        threshold = a_ol / teil_ol;
        //console.log('35 threshold ol', threshold)
        if (threshold > a_max) {
            console.log('a_ol', a_ol, 'tile_ol', teil_ol, 'true')
            setrule = true;
        }
    }

    if (obj_konfig.typ === 'typ1u1' || obj_konfig.typ === 'typ1u2' || obj_konfig.typ === 'typ1u3' ||
        obj_konfig.typ === 'typ2u1' || obj_konfig.typ === 'typ2u2' || obj_konfig.typ === 'typ2u3' ||
        obj_konfig.typ === 'typ3u1' || obj_konfig.typ === 'typ3u2' || obj_konfig.typ === 'typ3u3'
    ) {
        threshold = a_ul / teil_ul;
        //console.log('35 threshold ul', threshold)
        if (threshold > a_max) {
            setrule = true;
        }
    }

    if(setrule===true) {
        //console.log('apply 3.5 Rule')
        if (obj_konfig.glas === 'g1' || obj_konfig.glas === 'g2' || obj_konfig.glas === 'g3' || obj_konfig.glas === 'g4') {
            if(obj_konfig.sicherheitsverglasung==='sicherheitsverglasung_0'){
                $('#sicherheitsverglasung_1').trigger('click')
            }

            obj_konfig.sicherheitsverglasung= 'sicherheitsverglasung_1';
            $('.sicherheitsverglasung_typ').each(function () {
                imageOnOff($(this).attr('id'), 'off', '')
            })
            if (obj_konfig.glas === 'g1' || obj_konfig.glas === 'g2') {
                imageOnOff('verglasung_typ_2_8', 'on', 'sicherheit(this)')
                obj_konfig.sicherheitsverglasung_typ = 'verglasung_typ_2_8';
                setBorder('sicherheitsverglasung_typ', 'verglasung_typ_2_8');
            }
            if (obj_konfig.glas === 'g3' || obj_konfig.glas === 'g4') {
                imageOnOff('verglasung_typ_3_7', 'on', 'sicherheit(this)')
                obj_konfig.sicherheitsverglasung_typ = 'verglasung_typ_3_7';
                setBorder('sicherheitsverglasung_typ', 'verglasung_typ_3_7');
            }
            $('#sicherheitsverglasung_0').attr('disabled', true)
            $('#sicherheitsverglasung_1').attr('checked', true)

            obj_konfig.schallschutz = 'schallschutz_nein';
            $('#schallschutz_nein').attr('checked', true)
            $('#schallschutz_ja').attr('disabled', true)
            obj_konfig.ornament = 'ornament_0';
            $('#ornament_0').attr('checked', true)
            $('#ornament_1').attr('disabled', true)
        }
    }
}

function flaeche_breiter_8(obj_konfig) {
    //var a = (parseFloat(obj_konfig.breite) * parseFloat(obj_konfig.hoehe))/1000000;
    // aktuelle Sicherheitsglas ab Breite von 8m
    var a = parseFloat(obj_konfig.breite);
    if (a >= 8000) {
        $("#_sicherheit_2").css('display', 'none');
        //immer 3fach Verglasung
        if (obj_konfig.glas == "g1" || obj_konfig.glas == "g2") {
            obj_konfig.glas = "g3";
        }
        $("#message_glas").css('display', 'block');
        var obj = getHTMLObjectById(obj_konfig.glas);
        setBorder(obj.name, obj.id);
        obj_konfig.schallschutz = "schallschutz_nein";
        obj_konfig.schallschutz_db = "schallschutz_stufe01";
        $("#schallschutz_ja").prop("disabled", true);
        $("#schallschutz_nein").prop("checked", true);
        $("#_schalschutz_").css('display', 'none');
        obj_konfig.sicherheitsverglasung = "sicherheitsverglasung_1";
        obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_3_7";
        var obj = getHTMLObjectById(obj_konfig.sicherheitsverglasung_typ);
        setBorder(obj.name, obj.id);
        $("#sicherheitsverglasung_0").prop("disabled", true);
        $("#sicherheitsverglasung_1").prop("checked", true);
        $('#s3_1').addClass(' collapse ');
        $('#s3_2').addClass(' collapse ');
        $('#s3_3').addClass(' collapse ');
        $('#s3_4').addClass(' collapse ');
        $('#s3_5').addClass(' collapse ');
        $('#s3_6').addClass(' collapse ');
        $('#s3_7').removeClass(' collapse ');
        $("#_sicherheit_3").css('display', 'block');
        //ornament noch festlegen
        $("#ornament_1").prop("disabled", true);
        $("#ornament_0").prop("checked", true);
        $("#_ornament_typ").css('display', 'none');
        obj_konfig.ornament = "ornament_0";
        obj_konfig.ornament_typ = "ornament_typ_1";
        var obj = getHTMLObjectById(obj_konfig.ornament_typ);
        setBorder(obj.name, obj.id);
    }
    if (a < 8000) {
        $("#message_glas").css('display', 'none');
        $('#s3_1').removeClass(' collapse ');
        $('#s3_2').removeClass(' collapse ');
        $('#s3_3').removeClass(' collapse ');
        $('#s3_4').removeClass(' collapse ');
        $('#s3_5').removeClass(' collapse ');
        $('#s3_6').removeClass(' collapse ');
        //schallschutz wieder freigeben
        $("#schallschutz_ja").prop("disabled", false);
        $("#sicherheitsverglasung_0").prop("disabled", false);
        //ornament wieder freigeben
        $("#ornament_1").prop("disabled", false);
    }
    rule_35Fest()
}

function rules_ornament_view(obj_konfig) {
    if (obj_konfig.ornament == "ornament_1") {
        $("#_ornament_typ").css('display', 'block');
    }
    if (obj_konfig.ornament == "ornament_0") {
        $("#_ornament_typ").css('display', 'none');
    }
}

function rules_ornament_default(obj_konfig) {
    $("#_ornament_typ").css('display', 'none');
    obj_konfig.ornament_typ = "ornament_typ_1";
    var obj = getHTMLObjectById(obj_konfig.ornament_typ);
    setBorder(obj.name, obj.id);
}

function check_ohne_glas(obj_konfig) {
    if (obj_konfig.glas == "g7" || obj_konfig.glas == "g8") {
        // setze Schallschutz default
        $("#_schalschutz_").css('display', 'none');
        obj_konfig.schallschutz = "schallschutz_nein";
        obj_konfig.schallschutz_db = "schallschutz_stufe01";
        var obj = getHTMLObjectById(obj_konfig.schallschutz_db);
        setBorder("schallschutz_db", "schallschutz_stufe01");
        $("#schallschutz_nein").prop("checked", true);
        $("#schallschutz_ja").prop("disabled", true);
        $("#message_sicherheit").addClass(" collapse ");
        $("#sicherheitsverglasung_0").prop("checked", true);
        $("#sicherheitsverglasung_1").prop("disabled", true);
        obj_konfig.sicherheitsverglasung = "sicherheitsverglasung_0";
        obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_2_1";
        $("#_ornament_typ").css('display', 'none');
        $("#ornament_0").prop("checked", true);
        $("#ornament_1").prop("disabled", true);
        obj_konfig.ornament = "ornament_0";
        obj_konfig.ornament_typ = "ornament_typ_1";
        $("#drv_0").prop("checked", true);
        $("#drv_1").prop("disabled", true);
        obj_konfig.drv = "drv_0";
    }
}

//Sprossen
function rules_sprossen() {
    if (obj_konfig.sprossen_breite == 'sprossen_breite_8') {
        $("#innenliegende_sprossen_farbe_8mm").css('display', 'block');
        $("#innenliegende_sprossen_farbe_18mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_26mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_45mm").css('display', 'none');
    }
    if (obj_konfig.sprossen_breite == 'sprossen_breite_18') {
        $("#innenliegende_sprossen_farbe_8mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_18mm").css('display', 'block');
        $("#innenliegende_sprossen_farbe_26mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_45mm").css('display', 'none');
    }
    if (obj_konfig.sprossen_breite == 'sprossen_breite_26') {
        $("#innenliegende_sprossen_farbe_8mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_18mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_26mm").css('display', 'block');
        $("#innenliegende_sprossen_farbe_45mm").css('display', 'none');
    }
    if (obj_konfig.sprossen_breite == 'sprossen_breite_45i') {
        $("#innenliegende_sprossen_farbe_8mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_18mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_26mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_45mm").css('display', 'block');
    }
}

function rules_setdefault_sprossen_art(obj_konfig) {
    if (obj_konfig.sprossen == 'sprossen_0') {
        $("#innenliegende_sprossen").css('display', 'none');
        $("#innenliegende_sprossen_farbe_8mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_18mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_26mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_45mm").css('display', 'none');
        $("#sprossenvorlage").css('display', 'none');
        $("#aufliegende_sprossen").css('display', 'none');
        obj_konfig.sprossen_breite = "sprossen_breite_8";
        setBorder("sprossen_breite", "sprossen_breite_8");
        obj_konfig.sprossen_farbe = "sprossen_farbe_8_1";
        setBorder("sprossen_farbe", "sprossen_farbe_8_1");
        obj_konfig.sprossen_vorlage = "sprossen_vorlage_1";
        setBorder("sprossen_vorlage", "sprossen_vorlage_1");
    }
    if (obj_konfig.sprossen == 'sprossen_1') {
        $("#innenliegende_sprossen").css('display', 'block');
        $("#innenliegende_sprossen_farbe_8mm").css('display', 'block');
        $("#innenliegende_sprossen_farbe_18mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_26mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_45mm").css('display', 'none');
        $("#sprossenvorlage").css('display', 'block');
        $("#aufliegende_sprossen").css('display', 'none');
        setBorder("sprossen_breite", "sprossen_breite_8");
        obj_konfig.sprossen_breite = "sprossen_breite_8";
        setBorder("sprossen_farbe", "sprossen_farbe_8_1");
        obj_konfig.sprossen_farbe = "sprossen_farbe_8_1";
    }
    if (obj_konfig.sprossen == 'sprossen_2') {
        $("#innenliegende_sprossen_farbe_8mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_18mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_26mm").css('display', 'none');
        $("#innenliegende_sprossen_farbe_45mm").css('display', 'none');
        $("#innenliegende_sprossen").css('display', 'none');
        $("#sprossenvorlage").css('display', 'block');
        $("#aufliegende_sprossen").css('display', 'block');
        setBorder("sprossen_breite", "sprossen_breite_27a");
        obj_konfig.sprossen_breite = "sprossen_breite_27a";
        setBorder("sprossen_farbe", "sprossen_farbe_a_01");
        obj_konfig.sprossen_farbe = "sprossen_farbe_a_01";
    }
}

function rules_set_sprossen_breite(obj_konfig) {
    if (obj_konfig.sprossen_breite == 'sprossen_breite_8') {
        obj_konfig.sprossen_farbe = "sprossen_farbe_8_1";
        setBorder("sprossen_farbe", "sprossen_farbe_8_1");
    }
    if (obj_konfig.sprossen_breite == 'sprossen_breite_18') {
        obj_konfig.sprossen_farbe = "sprossen_farbe_18_1";
        setBorder("sprossen_farbe", "sprossen_farbe_18_1");
    }
    if (obj_konfig.sprossen_breite == 'sprossen_breite_26') {
        obj_konfig.sprossen_farbe = "sprossen_farbe_26_1";
        setBorder("sprossen_farbe", "sprossen_farbe_26_1");
    }
    if (obj_konfig.sprossen_breite == 'sprossen_breite_45i') {
        obj_konfig.sprossen_farbe = "sprossen_farbe_45_1";
        setBorder("sprossen_farbe", "sprossen_farbe_45_1");
    }
}

//Sonstiges
function rules_rahmenverbreiterung_view(obj_konfig) {
    if (obj_konfig.rahmenverbreiterung == "rahmenverbreiterung_1") {
        $("#_rahmenverbreiterung").css("display", 'block');
    } else {
        $("#_rahmenverbreiterung").css("display", 'block');
    }
}

function rules_rahmenverbreiterung_setdefault(obj_konfig) {
    $("#_rahmenverbreiterung").css("display", 'none');
    $("#rahmenverbreiterung_0").prop("checked", true);
    obj_konfig.unten = "unten_0";
    $("#unten_0").prop("checked", true);
    obj_konfig.oben = "oben_0";
    $("#oben_0").prop("checked", true);
    obj_konfig.links = "links_0";
    $("#links_0").prop("checked", true);
    obj_konfig.rechts = "rechts_0";
    $("#rechts_0").prop("checked", true);
}

function rules_fenstergriffe(obj_konfig) {
    if (obj_konfig.fenstergriffe == 'fenstergriffe_0') {
        $("#griff_standard").css('display', 'none');
        $("#griff_druck").css('display', 'none');
        $("#griff_schliess").css('display', 'none');
    }
    if (obj_konfig.fenstergriffe == 'fenstergriffe_1') {
        $("#griff_standard").css('display', 'block');
        $("#griff_druck").css('display', 'none');
        $("#griff_schliess").css('display', 'none');
    }
    if (obj_konfig.fenstergriffe == 'fenstergriffe_2') {
        $("#griff_standard").css('display', 'none');
        $("#griff_druck").css('display', 'block');
        $("#griff_schliess").css('display', 'none');
    }
    if (obj_konfig.fenstergriffe == 'fenstergriffe_3') {
        $("#griff_standard").css('display', 'none');
        $("#griff_druck").css('display', 'none');
        $("#griff_schliess").css('display', 'block');
    }
}

function rules_fenstergriffe_default(obj_konfig) {
    if (obj_konfig.fenstergriffe == 'fenstergriffe_1') {
        setBorder("fenstergriffart", "fenstergriffart_1_1");
        obj_konfig.fenstergriffart = "fenstergriffart_1_1";
    }
    if (obj_konfig.fenstergriffe == 'fenstergriffe_2') {
        setBorder("fenstergriffart", "fenstergriffart_2_1");
        obj_konfig.fenstergriffart = "fenstergriffart_2_1";
    }
    if (obj_konfig.fenstergriffe == 'fenstergriffe_3') {
        setBorder("fenstergriffart", "fenstergriffart_3_1");
        obj_konfig.fenstergriffart = "fenstergriffart_3_1";
    }
}

function main_kippgriffe(obj_konfig) {
    if (obj_konfig.oer == 'fn_1_kipp') {
        $('#main_handleside').removeClass('hidden');
        $("#" + obj_konfig.main_handleside).prop("checked", true);
        /*if (obj_konfig.main_handleside != 'main_handleside_0') {
            $('#' + obj_konfig.main_handleside + '').trigger('click');
        } else {
            $('#main_handleside_0').trigger('click');
        }*/
    } else {
        //$('#main_handleside_0').trigger('click');
        $("#main_handleside_0").prop("checked", true);
        obj_konfig.main_handleside = "main_handleside_0";
        $('#main_handleside').addClass('hidden');
    }
}

function ol_kippgriffe(obj_konfig) {
    if (obj_konfig.oer_oben == 'fn_1_oberlicht_kipp') {
        $('#ol_handleside').removeClass('hidden');
        $("#" + obj_konfig.ol_handleside).prop("checked", true);
        /*if (obj_konfig.ol_handleside != 'ol_handleside_0') {
            $('#' + obj_konfig.ol_handleside + '').trigger('click');
        } else {
            $('#ol_handleside_0').trigger('click');
        }*/
    } else {
        //$('#ol_handleside_0').trigger('click');
        $("#ol_handleside_0").prop("checked", true);
        obj_konfig.ol_handleside = "ol_handleside_0";
        $('#ol_handleside').addClass('hidden');
    }
}

function ul_kippgriffe(obj_konfig) {
    if (obj_konfig.oer_unten == 'fn_1_unterlicht_kipp') {
        $('#ul_handleside').removeClass('hidden');
        $("#" + obj_konfig.ul_handleside).prop("checked", true);
        /*if (obj_konfig.ul_handleside != 'ul_handleside_0') {
            $('#' + obj_konfig.ul_handleside + '').trigger('click');
        } else {
            $('#ul_handleside_0').trigger('click');
        }*/
    } else {
        //$('#ul_handleside_0').trigger('click');
        $("#ul_handleside_0").prop("checked", true);
        obj_konfig.ul_handleside = "ul_handleside_0";
        $('#ul_handleside').addClass('hidden');
    }
}

function check_griffhoehe(obj_konfig) {
    obj_konfig.griffhoehe_value = "0 mm";
    getGriffHoehen(obj_konfig);
    if (obj_konfig.fenstergriffe === "fenstergriffe_0") {
        $("#griffhoehen_div").addClass("hidden");
        obj_konfig.griffhoehe = "griffhoehe_0";
        setBorder("griffhoehe", "griffhoehe_0");
        getGriffHoehen(obj_konfig);
    } else {
        $("#griffhoehen_div").removeClass("hidden");
    }
}

function getGriffHoehen(obj_konfig) {
    if (parseFloat(obj_konfig.hoehe) >= 391 && parseFloat(obj_konfig.hoehe) <= 546) {
        obj_konfig.griffhoehe_value = "183 mm";
    }
    if (parseFloat(obj_konfig.hoehe) >= 547 && parseFloat(obj_konfig.hoehe) <= 766) {
        obj_konfig.griffhoehe_value = "248 mm";
    }
    if (parseFloat(obj_konfig.hoehe) >= 767 && parseFloat(obj_konfig.hoehe) <= 956) {
        obj_konfig.griffhoehe_value = "358 mm";
    }
    if (parseFloat(obj_konfig.hoehe) >= 957 && parseFloat(obj_konfig.hoehe) <= 1206) {
        obj_konfig.griffhoehe_value = "458 mm";
    }
    if (parseFloat(obj_konfig.hoehe) >= 1207 && parseFloat(obj_konfig.hoehe) <= 1456) {
        obj_konfig.griffhoehe_value = "558 mm";
    }
    if (parseFloat(obj_konfig.hoehe) >= 1457 && parseFloat(obj_konfig.hoehe) <= 1706) {
        obj_konfig.griffhoehe_value = "658 mm";
    }
    if (parseFloat(obj_konfig.hoehe) >= 1708 && parseFloat(obj_konfig.hoehe) <= 1866) {
        obj_konfig.griffhoehe_value = "758 mm";
    }
    if (parseFloat(obj_konfig.hoehe) >= 1867 && parseFloat(obj_konfig.hoehe) <= 2566) {
        obj_konfig.griffhoehe_value = "1108 mm";
    }
    if (obj_konfig.griffhoehe == "griffhoehe_1") {
        let tmp = parseFloat(obj_konfig.hoehe) / 2;
        obj_konfig.griffhoehe_value = tmp.toString().replace(".", ",") + " mm";
    }
}

function rules_view_sicherheitsbeschlaege(obj_konfig) {
    $("#_sicherheitsbeschlaege").css('display', 'none');
    if (obj_konfig.sicherheitsbeschlaege == 'sicherheitsbeschlaege_1') {
        $("#_sicherheitsbeschlaege").css('display', 'block');
    }
}

function rules_set_sicherheitsbeschlaege_default(obj_konfig) {
    if (obj_konfig.sicherheitsbeschlaege == 'sicherheitsbeschlaege_0') {
        obj_konfig.sicherheitsbeschlaegeart = "sicherheitsbeschlaege_art_1_1";
        var obj = getHTMLObjectById("sicherheitsbeschlaege_art_1_1");
        setBorder(obj.name, obj.id);
    }
}

function rules_check_view_luefter(obj_konfig) {
    $("#_fensterfalzluefter").css('display', 'none');
    if (obj_konfig.fensterfalzluefter == 'fensterfalzluefter_1') {
        $("#_fensterfalzluefter").css('display', 'block');
        if(obj_konfig.breite<600){
            $('#fensterfalzluefter_art_3').parent().addClass('disabled')
            $('#fensterfalzluefter_art_3').removeAttr('onclick');
            $('#fensterfalzluefter_art_4').parent().addClass('disabled')
            $('#fensterfalzluefter_art_4').removeAttr('onclick');
            if(obj_konfig.fensterfalzluefter_art=='fensterfalzluefter_art_3' ||
                obj_konfig.fensterfalzluefter_art=='fensterfalzluefter_art_4' ){
                obj_konfig.fensterfalzluefter_art = "fensterfalzluefter_art_1";
            }

        }else{
            $('#fensterfalzluefter_art_3').parent().removeClass('disabled')
            $('#fensterfalzluefter_art_3').attr('onclick','_fensterfalzluefter_art(this)');
            $('#fensterfalzluefter_art_4').parent().removeClass('disabled')
            $('#fensterfalzluefter_art_4').attr('onclick','_fensterfalzluefter_art(this)');
        }
    }
    if (obj_konfig.profil === "p7") { //iglo ext nach aussen
        imageOnOff("fensterfalzluefter_art_1", 'off')
        imageOnOff("fensterfalzluefter_art_2", 'off')
        if (obj_konfig.fensterfalzluefter === 'fensterfalzluefter_1') {
            if (obj_konfig.fensterfalzluefter_art === 'fensterfalzluefter_art_1' || obj_konfig.fensterfalzluefter_art === 'fensterfalzluefter_art_2') {
                obj_konfig.fensterfalzluefter_art = 'fensterfalzluefter_art_3';
            }
        }
    }
}

function rules_set_luefter_default(obj_konfig) {
    if (obj_konfig.fensterfalzluefter == 'fensterfalzluefter_0') {
        obj_konfig.fensterfalzluefter_art = "fensterfalzluefter_art_1";
        var obj = getHTMLObjectById("fensterfalzluefter_art_1");
        setBorder(obj.name, obj.id);
    }
}

function rules_check_3glas_mb45(obj_konfig) {
    $("#message_glas_mb45").css("display", "none");
    $("#schallschutz_ja").prop("disabled", false);
    $("#sicherheitsverglasung_1").prop("disabled", false);
    $("#ornament_1").prop("disabled", false);
    $("#drv_1").prop("disabled", false);
    if (obj_konfig.profil == 'p1' && (obj_konfig.glas == "g3" || obj_konfig.glas == "g4" || obj_konfig.glas == "g5")) {
        $("#schallschutz_ja").prop("disabled", true);
        $("#schallschutz_nein").prop("checked", true);
        obj_konfig.schallschutz = "schallschutz_nein";
        obj_konfig.schallschutz_db = "schallschutz_stufe01";
        $("#_schalschutz_").css('display', 'none');
        $("#sicherheitsverglasung_1").prop("disabled", true);
        $("#sicherheitsverglasung_0").prop("checked", true);
        obj_konfig.sicherheitsverglasung = "sicherheitsverglasung_0";
        /*obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_3_1";
        if ( obj_konfig.glas == "g5"  ){
            obj_konfig.sicherheitsverglasung_typ = "verglasung_typ_1_1";
        }*/
        $("#_sicherheit_2").css('display', 'none');
        $("#_sicherheit_3").css('display', 'none');
        $("#ornament_1").prop("disabled", true);
        $("#ornament_0").prop("checked", true);
        obj_konfig.ornament = "ornament_0";
        obj_konfig.ornament_typ = "ornament_typ_1";
        $("#_ornament_typ").css('display', 'none');
        $("#message_glas_mb45").css("display", "block");
    }
}

function rules_check_sonstiges_sicherheitsbeschlaege(obj_konfig) {
    if (obj_konfig.breite <= 687 || obj_konfig.hoehe <= 687) {
        // Radio-Button inaktiv setzen
        $("#verdeckt_beschlaege_0").prop("checked", true);
        $("#verdeckt_beschlaege_1").prop("disabled", true);
        obj_konfig.verdeckt_beschlaege = "verdeckt_beschlaege_0";
    } else {
        $("#verdeckt_beschlaege_1").prop("disabled", false);
    }
	rules_sonstiges_rc2(obj_konfig);
}


function rules_sonstiges_rc2(obj_konfig){
        let minh=550;
        let minb=440;
        let minb_olul=440;
        let minh_olul=550;
        let hasOL=false;
        let hasUL=false
        let t=obj_konfig.typ;
        let count_olul=0;
        let count_mains=parseInt(t.split('typ')[1])
        if(t.indexOf('o')>-1){
            hasOL=true;
            count_olul=parseInt(t.split('o')[1]);
        }
        if(t.indexOf('u')>-1){
            hasUL=true;
            count_olul=parseInt(t.split('u')[1]);
        }
        minb*=count_mains;
        minb_olul*=count_olul;

    //console.log(obj_konfig);
    //console.log('minb',minb, 'minh',minh, 'minbolul',minb_olul, 'minholul',minh_olul)
	let rc2error = false;
	if (obj_konfig.breite < minb || obj_konfig.hoehe < minh) {
        //console.log('rule 1')
		rc2error = true;
	}
	if (hasOL) {
		if(obj_konfig.hoehe_ol < minh_olul || obj_konfig.breite < minb_olul){
            //console.log('rule 2')
		    rc2error = true;
        }
	}
	if (hasUL > 0) {
        if(obj_konfig.hoehe_ul < minh_olul || obj_konfig.breite < minb_olul){
            //console.log('rule 3')
            rc2error = true;
        }
	}

    let ele=$('#sicherheitsbeschlaege_art_1_3');
	if (rc2error) {
        ele.parent().addClass('disabled')
        ele.removeAttr('onclick');
		if (obj_konfig.sicherheitsbeschlaegeart === 'sicherheitsbeschlaege_art_1_3') {
			obj_konfig.sicherheitsbeschlaegeart = 'sicherheitsbeschlaege_art_1_2';
			setBorder('sicherheitsbeschlaegeart', 'sicherheitsbeschlaege_art_1_2');
		}
	} else {
        ele.parent().removeClass('disabled')
        ele.attr('onclick', '_sicherheitsbeschlaege_art(this)');
	}
}


function rules_check_sonstiges_dsd(obj_konfig) {
    if (obj_konfig.profil === 'p3' || // Iglo energy classic
        obj_konfig.profil === 'p4' // Iglo Energy
    ) {
        // Radio-Button inaktiv setzen
        $("#dsd_0").prop("disabled", true);
        $("#dsd_1").prop("checked", true);
        obj_konfig.dsd = "dsd_1";
    } else {
        $("#dsd_1").prop("disabled", false);
    }
}

function rules_view_1fach_glas(obj_konfig) {
    $("#1_fach_glas").css("display", "none");
    if (obj_konfig.glas == "g5") {
        $("#1_fach_glas").css("display", "block");
    }
}

function check_sicherheitsbeschlaege_stahl(obj_konfig) {
    $("#sicherheitsbeschlaege_stahl").addClass('collapse');
    if (obj_konfig.sicherheitsbeschlaegeart != "sicherheitsbeschlaege_art_1_1") {
        $("#sicherheitsbeschlaege_stahl").removeClass('collapse');
    }
}

//Rollladen MinMax Maße
//var roll_minmax = new Array();
function rules_rollladen_set_default(obj_konfig) {
    ////console.log("rules_rollladen_set_default");
    if (obj_konfig.profil === "p6") {
        $("#message_rollladen_3").removeClass(" hidden ");
    }
    var hoehe_sum = 0;
    hoehe_sum = parseFloat(obj_konfig.hoehe) + parseFloat(obj_konfig.hoehe_ol) + parseFloat(obj_konfig.hoehe_ul);
    var breite = parseFloat(obj_konfig.breite);
    if (breite < 750 || hoehe_sum < 500) {
        $("#message_rollladen").removeClass(" hidden ");
    }
    if (hoehe_sum > 2700 && (obj_konfig.roll_model === "roll_model_3" || obj_konfig.roll_model === "roll_model_4") && obj_konfig.roll_kh == "roll_kh_215") {
        $("#message_rollladen_1").removeClass(" hidden ");
    }
    if (hoehe_sum > 2900 && (obj_konfig.roll_model === "roll_model_1" || obj_konfig.roll_model === "roll_model_2") && obj_konfig.roll_kh == "roll_kh_215") {
        $("#message_rollladen_1").removeClass(" hidden ");
    }
    if (hoehe_sum > 1700 && (obj_konfig.roll_model === "roll_model_1" || obj_konfig.roll_model === "roll_model_2") && obj_konfig.roll_kh == "roll_kh_175") {
        $("#message_rollladen_2").removeClass(" hidden ");
    }
    if (hoehe_sum > 1500 && (obj_konfig.roll_model === "roll_model_3" || obj_konfig.roll_model === "roll_model_4") && obj_konfig.roll_kh == "roll_kh_175") {
        $("#message_rollladen_2").removeClass(" hidden ");
    }
    $("#view_rollladen").css("display", "none");
    $("#roll_0").prop("checked", true);
    obj_konfig.roll = "roll_0";
    obj_konfig.roll_model = "roll_model_1";
    obj_konfig.roll_kh = "roll_kh_215";
    $("#div_roll_model_4").removeClass("hidden");
    if ($("#roll_model_1").length > 0) {
        var obj = getHTMLObjectById("roll_model_1");
        setBorder(obj.name, obj.id);
    }
    obj_konfig.roll_teil = "roll_teil_1";
    if ($("#roll_teil_1").length > 0) {
        $("#roll_teil_1").prop("checked", true);
    }
    //Farbe Kasten und Führungsschienen
    obj_konfig.roll_fk = "roll_fk_0";
    if ($("#roll_fk_0").length > 0) {
        $("#roll_fk_0").prop("checked", true);
    }
    obj_konfig.dekofarbe_fb = "fk1_01";
    if ($("#fk1_01").length > 0) {
        var obj = getHTMLObjectById("fk1_01");
        setBorder(obj.name, obj.id);
        $("#_farbe_kasten").css('display', 'none');
    }
    //Farbe Endleiste und Panzer
    obj_konfig.roll_panzer = "roll_panzer_1";
    if ($("#roll_panzer_1").length > 0) {
        var obj = getHTMLObjectById("roll_panzer_1");
        setBorder(obj.name, obj.id);
    }
    //Antriebsart
    obj_konfig.roll_antriebart = "roll_antriebart_1";
    if ($("#roll_antriebart_1").length > 0) {
        var obj = getHTMLObjectById("roll_antriebart_1");
        setBorder(obj.name, obj.id);
    }
    //Antriebsseite
    obj_konfig.roll_as = "roll_as_l";
    if ($("#roll_as_l").length > 0) {
        $("#roll_as_l").prop("checked", true);
    }
    //Putzträger und Putzleiste
    obj_konfig.roll_pt = "roll_pt_0";
    if ($("#roll_pt_0").length > 0) {
        $("#roll_pt_0").prop("checked", true);
    }
}

function rules_roll_fs_verlangerung(obj_konfig) {
    //console.log('-',obj_konfig.roll_fs_verlaengerung)
    if (parseInt(obj_konfig.roll_fs_verlaengerung) > 30) {
        //console.log('rule 1')
        obj_konfig.roll_vm = 'roll_vm_0';
        $('#roll_vm_0').prop("checked", true);
        $('#roll_vm_1').prop("disabled", true);
        $('#message_roll_fs_31').removeClass('hidden');
    } else {
        $('#roll_vm_1').prop("disabled", false);
        $('#message_roll_fs_31').addClass('hidden');
        //console.log('rule 2')
    }
    if (obj_konfig.roll_art === 'roll_art_2') {
        obj_konfig.roll_vm = 'roll_vm_0';
        $('#roll_vm_0').prop("checked", true);
        $('#roll_vm_1').prop("disabled", true);
        //$('#message_roll_fs_31').removeClass('hidden');
    }
}
function rules_revisionSeite(obj_konfig){
    if(obj_konfig.roll_model==='roll_model_2' || obj_konfig.roll_model==='roll_model_4'){
        //console.log(obj_konfig.roll_model)
        $('#roll_pt_2').parent().addClass('disabled')
        $('#roll_pt_3').parent().addClass('disabled')
        $('#roll_pt_2').removeAttr('onclick');
        $('#roll_pt_3').removeAttr('onclick');
        if(obj_konfig.roll_pt==='roll_pt_2' || obj_konfig.roll_pt==='roll_pt_3'){
            $('#roll_pt_0').trigger('click');
            //$('#roll_pt_0').prop('checked', true)
            obj_konfig.roll_pt='roll_pt_0';
        }
    }else{
        $('#roll_pt_2').parent().removeClass('disabled')
        $('#roll_pt_3').parent().removeClass('disabled')
        $('#roll_pt_2').attr('onclick','_rollladen_putz(this)');
        $('#roll_pt_3').attr('onclick','_rollladen_putz(this)');
        $('#roll_pt_2').attr('disabled', false)
        $('#roll_pt_3').attr('disabled', false)
    }
}

function rules_check_masse_rollladen(obj_konfig) {
    ////console.log('rules_check_masse_rollladen');
    return false;
}

function check_roll_teil_2(obj_konfig) {
    ////console.log('check_roll_teil_2', obj_konfig.oer);
    if (
        /* obj_konfig.oer === "fn_1_fest_ohne_fluegel" || */
        obj_konfig.oer === "fn_2_drehkipp_fest" ||
        obj_konfig.oer === "fn_2_fest_drehkipp" ||
        obj_konfig.oer === "fn_2_drehkipp_dreh_pfosten" ||
        obj_konfig.oer === "fn_2_dreh_drehkipp_pfosten" ||
        obj_konfig.oer === "fn_2_drehkipp_drehkipp_pfosten" ||
        obj_konfig.oer === "fn_2_fest_fest" ||
        obj_konfig.oer === "fn_2_festfluegel_festfluegel" ||
        obj_konfig.oer === "fn_2_kipp_kipp"
    ) {
        return true;
    }
    return false;
}

function check_roll_teil_3(obj_konfig) {
    ////console.log('check_roll_teil_3', obj_konfig.oer);
    if (obj_konfig.oer === "fn_3_drehkipp_drehlinks_drehkipp_stulp") {
        return true;
    }
    return false;
}

function check_roll_teil_4(obj_konfig) {
    ////console.log('check_roll_teil_4', obj_konfig.oer);
    if (obj_konfig.oer === "fn_3_drehkipp_drehrechts_drehkipp_stulp") {
        return true;
    }
    return false;
}

function check_roll_teil_5(obj_konfig) {
    ////console.log('check_roll_teil_5', obj_konfig.oer);
    if (obj_konfig.oer === "fn_3_drehkipp_drehlinks_drehkipp_stulp" ||
        obj_konfig.oer === "fn_3_drehkipp_drehrechts_drehkipp_stulp") {
        return false;
    }
    if (obj_konfig.oer === "fn_3_drehkipp_fest_drehkipp" ||
        obj_konfig.oer === "fn_3_drehkipp_drehlinks_drehkipp_pfosten" ||
        obj_konfig.oer === "fn_3_drehkipp_drehrechts_drehkipp_pfosten" ||
        obj_konfig.oer === "fn_3_drehkipp_drehlinks_drehkipp_stulp" ||
        obj_konfig.oer === "fn_3_kipp_kipp_kipp" ||
        obj_konfig.oer === "fn_3_fest_fest_fest" ||
        obj_konfig.oer === "fn_3_festfluegel_fesfluegel_festfluegel"
    ) {
        return true;
    }
    return false;
}

function rules_rollladen_styro_maxbreite(obj_konfig){
    let rollteil=1;
    switch(obj_konfig.roll_teil){
        case 'roll_teil_1':
            rollteil=1;
            break;
        case 'roll_teil_2':
            rollteil=2;
            break;
        case 'roll_teil_3':
            rollteil=2;
            break;
        case 'roll_teil_4':
            rollteil=2;
            break;
        case 'roll_teil_5':
            rollteil=3;
            break;
    }
    let rollbreite=obj_konfig.breite;
    //console.log(rollteil, rollbreite);
    if(rollteil * obj_konfig.roll_teil >2400){
        $('#roll_art_2').parent().addClass('disabled');
        $('#roll_art_2').removeAttr('onclick')
        if(obj_konfig.roll_art==='roll_art_2'){
            setBorder('roll_art', 'roll_art_1');
        }
    }else{
        $('#roll_art_2').parent().removeClass('disabled');
        $('#roll_art_2').attr('onclick','_roll_art(this)')
    }

    if(rollbreite>1600 && obj_konfig.roll_art==="roll_art_2"){
        $('#roll_model_7').addClass('disabled');
        $('#roll_model_7').removeAttr('onclick');
        $('#roll_model_8').addClass('disabled');
        $('#roll_model_8').removeAttr('onclick');
        if(obj_konfig.roll_model==='roll_model_7' || obj_konfig.roll_model==='roll_model_8' ){
            obj_konfig.roll_model='roll_model_5'
            setBorder('roll_model', 'roll_model_5')
        }
    }else{
        $('#roll_model_7').removeClass('disabled');
        $('#roll_model_7').attr('onclick', '_rollladen_model(this)');
        $('#roll_model_8').removeClass('disabled');
        $('#roll_model_8').attr('onclick', '_rollladen_model(this)');
    }
}

function check_model_by_konfig(obj_konfig, model) {
    rules_rollladen_styro_maxbreite(obj_konfig)

    //MinMax Masse holen
    var roll_minmax = getMinMaxRollladen(obj_konfig, model);
    //console.log( roll_minmax );
    var min_breite = parseFloat(roll_minmax.data[0].min_breite);
    var max_breite = parseFloat(roll_minmax.data[0].max_breite);
    var min_hoehe = parseFloat(roll_minmax.data[0].min_hoehe);
    var max_hoehe = parseFloat(roll_minmax.data[0].max_hoehe);
    var arr_teilung = new Object();
    arr_teilung.roll_teil_1 = false;
    arr_teilung.roll_teil_2 = false;
    arr_teilung.roll_teil_3 = false;
    arr_teilung.roll_teil_4 = false;
    arr_teilung.roll_teil_5 = false;
    arr_teilung.min_breite = parseFloat(roll_minmax.data[0].min_breite);
    arr_teilung.max_breite = parseFloat(roll_minmax.data[0].max_breite);
    arr_teilung.min_hoehe = parseFloat(roll_minmax.data[0].min_hoehe);
    arr_teilung.max_hoehe = parseFloat(roll_minmax.data[0].max_hoehe);

    var breite = parseFloat(obj_konfig.breite);
    if (breite <= max_breite && breite >= min_breite) {
        arr_teilung.roll_teil_1 = true;
    }
    if (breite / 2 >= min_breite && breite / 2 <= max_breite) {
        arr_teilung.roll_teil_2 = check_roll_teil_2(obj_konfig);
    }
    var tmp_3 = breite / 3;
    if (tmp_3 >= min_breite && tmp_3 * 2 <= max_breite
    ) {
        arr_teilung.roll_teil_3 = check_roll_teil_3(obj_konfig);
        arr_teilung.roll_teil_4 = check_roll_teil_4(obj_konfig);
    }
    if (breite / 3 >= min_breite && breite / 3 <= max_breite && obj_konfig.typ == "typ3") {
        arr_teilung.roll_teil_5 = check_roll_teil_5(obj_konfig);
    }
    ////console.log(arr_teilung.roll_teil_1, arr_teilung.roll_teil_2, arr_teilung.roll_teil_3, arr_teilung.roll_teil_4, arr_teilung.roll_teil_5);
    if (model == "roll_model_1") {
        if (arr_teilung.roll_teil_1 == false
            && arr_teilung.roll_teil_2 == false
            && arr_teilung.roll_teil_3 == false
            && arr_teilung.roll_teil_4 == false
            && arr_teilung.roll_teil_5 == false) {
            arr_teilung.roll_model_1 = false;
        } else {
            arr_teilung.roll_model_1 = true;
        }
    }
    if (model == "roll_model_2") {
        if (arr_teilung.roll_teil_1 == false
            && arr_teilung.roll_teil_2 == false
            && arr_teilung.roll_teil_3 == false
            && arr_teilung.roll_teil_4 == false
            && arr_teilung.roll_teil_5 == false) {
            arr_teilung.roll_model_2 = false;
        } else {
            arr_teilung.roll_model_2 = true;
        }
    }
    if (model == "roll_model_3") {
        if (arr_teilung.roll_teil_1 == false
            && arr_teilung.roll_teil_2 == false
            && arr_teilung.roll_teil_3 == false
            && arr_teilung.roll_teil_4 == false
            && arr_teilung.roll_teil_5 == false) {
            arr_teilung.roll_model_3 = false;
        } else {
            arr_teilung.roll_model_3 = true;
        }
    }
    if (model == "roll_model_4") {
        if (arr_teilung.roll_teil_1 == false
            && arr_teilung.roll_teil_2 == false
            && arr_teilung.roll_teil_3 == false
            && arr_teilung.roll_teil_4 == false
            && arr_teilung.roll_teil_5 == false) {
            arr_teilung.roll_model_4 = false;
        } else {
            arr_teilung.roll_model_4 = true;
        }
    }
    if (obj_konfig.roll_kh === 'roll_kh_225' || obj_konfig.roll_kh === 'roll_kh_215') {
        $("#roll_ssm_1").attr("disabled", false);
        $("#roll_sk_1").attr("disabled", false);
    } else {
        obj_konfig.roll_ssm = 'roll_ssm_0';
        obj_konfig.roll_sk = 'roll_sk_0';
        if ($("#roll_ssm_0").length > 0) {
            $("#roll_ssm_0").prop("checked", true);
            $("#roll_ssm_1").attr("disabled", true);
        }
        if ($("#roll_sk_0").length > 0) {
            $("#roll_sk_0").prop("checked", true);
            $("#roll_sk_1").attr("disabled", true);
        }
    }
    if (obj_konfig.roll_art === 'roll_art_2') { // Styro Antriebe 1-5 ausblenden
        //console.log('disable 1-4 ')
        $('#roll_antriebart_1').parent().addClass('hidden')
        $('#roll_antriebart_2').parent().addClass('hidden')
        $('#roll_antriebart_10').parent().addClass('hidden')
        $('#roll_antriebart_3').parent().addClass('hidden')
        $('#roll_antriebart_4').parent().addClass('hidden')
        if (
            obj_konfig.roll_antriebart === 'roll_antriebart_1' ||
            obj_konfig.roll_antriebart === 'roll_antriebart_2' ||
            obj_konfig.roll_antriebart === 'roll_antriebart_10' ||
            obj_konfig.roll_antriebart === 'roll_antriebart_3' ||
            obj_konfig.roll_antriebart === 'roll_antriebart_4'
        ) {
            obj_konfig.roll_antriebart = 'roll_antriebart_11';
            setBorder("roll_antriebart", "roll_antriebart_11");
        }
    } else {
        $('#roll_antriebart_1').parent().removeClass('hidden')
        $('#roll_antriebart_2').parent().removeClass('hidden')
        $('#roll_antriebart_10').parent().removeClass('hidden')
        $('#roll_antriebart_3').parent().removeClass('hidden')
        $('#roll_antriebart_4').parent().removeClass('hidden')
    }
    if (obj_konfig.roll_art === 'roll_art_2') { // Styro keine vormontage möglich
        $("#roll_vm_0").prop("checked", true);
        $("#roll_vm_1").attr('disabled', true)
        obj_konfig.roll_vm = 'roll_vm_0';
    } else {
        $("#roll_vm_1").attr('disabled', false)
        rules_roll_fs_verlangerung(obj_konfig)
    }

    let rollteil=1;
    switch(obj_konfig.roll_teil){
        case 'roll_teil_1':
            rollteil=1;
            break;
        case 'roll_teil_2':
            rollteil=2;
            break;
        case 'roll_teil_3':
            rollteil=2;
            break;
        case 'roll_teil_4':
            rollteil=2;
            break;
        case 'roll_teil_5':
            rollteil=3;
            break;
    }
    //console.log(rollteil);
    if(obj_konfig.breite / rollteil > max_breite){
      //  console.log('too big')
        //return false;
    }
    /* console.log('1', arr_teilung.roll_teil_1)
    console.log('2', arr_teilung.roll_teil_2)
    console.log('3', arr_teilung.roll_teil_3)
    console.log('4', arr_teilung.roll_teil_4)
    console.log('5', arr_teilung.roll_teil_5) */

    if (arr_teilung.roll_teil_1 === false &&
        arr_teilung.roll_teil_2 === false &&
        arr_teilung.roll_teil_3 === false &&
        arr_teilung.roll_teil_4 === false &&
        arr_teilung.roll_teil_5 === false) {
        $("#message_rollladen_2").removeClass('hidden');
        $("#roll_1").prop('disabled', true);
        rules_rollladen_set_default(obj_konfig);
    }else{
        $("#message_rollladen_2").addClass('hidden');
        $("#roll_1").prop('disabled', false);
    }


    return arr_teilung;
}

//Einsprungpunkt für Rollladen
function set_masse_rollladen(obj_konfig) {
    ////console.log('set_masse_rollladen');
    $("#roll_teil_1").prop('disabled', false);
    $("#roll_teil_2").prop('disabled', false);
    $("#roll_teil_3").prop('disabled', false);
    $("#roll_teil_4").prop('disabled', false);
    $("#roll_teil_5").prop('disabled', false);
    $("#message_rollladen").addClass('hidden');
    $("#message_rollladen_1").addClass('hidden');
    $("#message_rollladen_2").addClass('hidden');
    $("#message_rollladen_3").addClass('hidden');
    $("#div_roll_model_1").removeClass("hidden");
    $("#div_roll_model_2").removeClass("hidden");
    $("#div_roll_model_3").removeClass("hidden");
    $("#div_roll_model_4").removeClass("hidden");
    $("#roll_1").prop('disabled', false);
    var model_1 = false;
    model_1 = check_model_by_konfig(obj_konfig, "roll_model_1");
    var model_2 = false;
    model_2 = check_model_by_konfig(obj_konfig, "roll_model_2");
    var model_3 = false;
    model_3 = check_model_by_konfig(obj_konfig, "roll_model_3");
    var model_4 = false;
    model_4 = check_model_by_konfig(obj_konfig, "roll_model_4");
    var model_5 = false;
    model_5 = check_model_by_konfig(obj_konfig, "roll_model_5");
    var model_6 = false;
    model_6 = check_model_by_konfig(obj_konfig, "roll_model_6");
    var model_7 = false;
    model_7 = check_model_by_konfig(obj_konfig, "roll_model_7");
    var model_8 = false;
    model_8 = check_model_by_konfig(obj_konfig, "roll_model_8");
    // Ansicht prüfen
    if (model_4.roll_model_4 === false) {
        $("#div_roll_model_4").addClass("hidden");
        obj_konfig.roll_model = "roll_model_1";
        if ($("#roll_model_1").length > 0) {
            var obj = getHTMLObjectById("roll_model_1");
            setBorder(obj.name, obj.id);
        }
    }
    if (model_3.roll_model_3 === false) {
        $("#div_roll_model_3").addClass("hidden");
        obj_konfig.roll_model = "roll_model_1";
        if ($("#roll_model_1").length > 0) {
            var obj = getHTMLObjectById("roll_model_1");
            setBorder(obj.name, obj.id);
        }
    }
    ////console.log(model_4);
    if (model_1.roll_model_2 === false) {
        $("#div_roll_model_1").addClass("hidden");
    }
    if (model_2.roll_model_2 === false) {
        $("#div_roll_model_2").addClass("hidden");
    }
    ////console.log(model_2);
    if (model_1.roll_model_1 == false && model_2.roll_model_2 == false && model_3.roll_model_3 == false && model_4.roll_model_4 == false && model_5.roll_model_5 == false) {
        $("#message_rollladen_2").removeClass('hidden');
        //$("#roll_1").prop('disabled', true);
        rules_rollladen_set_default(obj_konfig);
        return false;
    }
    //aktuelle auswahl uebergeben
    var obj_model = "";
    if (obj_konfig.roll_model == "roll_model_1") {
        obj_model = model_1;
    }
    if (obj_konfig.roll_model == "roll_model_2") {
        obj_model = model_2;
    }
    if (obj_konfig.roll_model == "roll_model_3") {
        obj_model = model_3;
    }
    if (obj_konfig.roll_model == "roll_model_4") {
        obj_model = model_4;
    }
    if (obj_konfig.roll_model == "roll_model_5") {
        obj_model = model_5;
    }
    if (obj_konfig.roll_model == "roll_model_6") {
        obj_model = model_6;
    }
    if (obj_konfig.roll_model == "roll_model_7") {
        obj_model = model_7;
    }
    if (obj_konfig.roll_model == "roll_model_8") {
        obj_model = model_8;
    }
    ////console.log(obj_konfig.roll_model);
    var breite = parseFloat(obj_konfig.breite);
    $("#roll_breite_sum").html("Gesamtbreite: " + breite + " mm");
    var kh = parseFloat(obj_konfig.roll_kh.substr(-3));
    if (obj_konfig.roll_kh == "roll_kh_300" || obj_konfig.roll_kh == "roll_kh_365") {
        kh = 308;
    }
    var hoehe_sum = parseFloat(obj_konfig.hoehe) + parseFloat(obj_konfig.hoehe_ol) + parseFloat(obj_konfig.hoehe_ul) + kh;
    $("#roll_hoehe_sum").html("Gesamthöhe: " + hoehe_sum + " mm");
    $('#roll_min_max_breite').html('zulässiger Bereich von ' + obj_model.min_breite + ' bis ' + obj_model.max_breite + ' mm pro Teilung ');
    $('#roll_min_max_hoehe').html('zulässiger Bereich von ' + obj_model.min_hoehe + ' bis ' + obj_model.max_hoehe + ' mm');
    //Teilung setzen
    var teil=obj_konfig.roll_teil;
    var isset=false;
    if(obj_model[teil]===true){
        isset=true;
    }
    for (var item in obj_model) {
        //console.log(item, obj_model[item]);
        if (obj_model[item] === true) {
            if (item.indexOf("roll_model") !== -1) {
                $("#" + item).prop('checked', true);
                $("#" + item).prop('disabled', false);
            }
            if (item.indexOf("roll_teil") !== -1) {
                if (isset === false) {
                    obj_konfig.roll_teil = item;
                }
            }
        } else {
            $("#" + item).prop('disabled', true);
        }
    }
    return false;
}

function rules_rollladen_view_fk(obj_konfig) {
    if (obj_konfig.roll_fk != "roll_fk_0") {
        $("#_farbe_kasten").css('display', 'block');
    }
    if (obj_konfig.roll_fk == "roll_fk_0") {
        $("#_farbe_kasten").css('display', 'none');
    }
}

//rollladen Einsprungspunkt
function check_view_rollladen(obj_konfig) {
    ////console.log('check_view_rollladen', obj_konfig.roll_model);
    var hoehe_sum = 0;
    hoehe_sum = parseFloat(obj_konfig.hoehe) + parseFloat(obj_konfig.hoehe_ol) + parseFloat(obj_konfig.hoehe_ul);
    var breite = parseFloat(obj_konfig.breite);
    if (breite < 750 || hoehe_sum < 500) {
        rules_rollladen_set_default(obj_konfig);
        return false;
    }
    if (hoehe_sum > 1700 && (obj_konfig.roll_model === "roll_model_1" || obj_konfig.roll_model === "roll_model_2") && obj_konfig.roll_kh == "roll_kh_175") {
        obj_konfig.roll_kh = "roll_kh_215";
        $("#roll_kh_215").prop('checked', true);
        //rules_rollladen_set_default (obj_konfig);
        //return false;
    }
    if (hoehe_sum > 2900 && (obj_konfig.roll_model === "roll_model_1" || obj_konfig.roll_model === "roll_model_2") && obj_konfig.roll_kh == "roll_kh_215") {
        rules_rollladen_set_default(obj_konfig);
        return false;
    }
    if (hoehe_sum > 1500 && (obj_konfig.roll_model === "roll_model_3" || obj_konfig.roll_model === "roll_model_4") && obj_konfig.roll_kh == "roll_kh_175") {
        obj_konfig.roll_kh = "roll_kh_215";
        $("#roll_kh_215").prop('checked', true);
        //rules_rollladen_set_default (obj_konfig);
        //return false;
    }
    if (hoehe_sum > 2700 && (obj_konfig.roll_model === "roll_model_3" || obj_konfig.roll_model === "roll_model_4") && obj_konfig.roll_kh == "roll_kh_215") {
        rules_rollladen_set_default(obj_konfig);
        return false;
    }
    if (obj_konfig.roll == "roll_1") {
        $("#view_rollladen").css('display', 'block');
        // Check Min und Max Maße
        set_masse_rollladen(obj_konfig);
    } else {
        $("#view_rollladen").css('display', 'none');
        //bei ausblenden Rollladen auf default Werte setzen
        rules_rollladen_set_default(obj_konfig);
    }
    if(obj_konfig.profil==='p7'){
        $("#view_rollladen").css('display', 'none');
        rules_rollladen_set_default(obj_konfig);
    }
}

function check_range_input_fields(name) {
    var obj = getHTMLObjectById(name);
    ////console.log(name, obj);
    if (obj !== null) {
        if (parseFloat($("#" + obj.id).val()) > parseFloat($("#" + obj.id).attr('max')) ||
            parseFloat($("#" + obj.id).val()) < parseFloat($("#" + obj.id).attr('min'))) {
            $("#range_message").removeClass("hidden");
            $("#" + obj.id).addClass('border border-danger');
            $("#" + obj.id).val(parseFloat($("#" + obj.id).attr('min')));
            obj_konfig[obj.id] = parseFloat($("#" + obj.id).attr('min'));
        }
    }
}

function check_roll_art(obj_konfig) {
    ////console.log(obj_konfig.roll_art);
    $("#view_roll_model_1").addClass("collapse");
    $("#view_roll_model_2").addClass("collapse");
    $("#view_roll_model_3").addClass("collapse");
    $("#view_roll_kh_1").addClass("collapse");
    $("#view_roll_kh_2").addClass("collapse");
    $("#view_roll_kh_3").addClass("collapse");
    if (obj_konfig.roll_art == "roll_art_1") {
        $("#view_roll_model_1").removeClass("collapse");
        $("#view_roll_kh_1").removeClass("collapse");
    }
    if (obj_konfig.roll_art == "roll_art_2") {
        $("#view_roll_model_2").removeClass("collapse");
        $("#view_roll_kh_2").removeClass("collapse");
    }
    if (obj_konfig.roll_art == "roll_art_3") {
        $("#view_roll_model_3").removeClass("collapse");
        $("#view_roll_kh_3").removeClass("collapse");
    }
    //check_putztraeger (obj_konfig);
    //check_kastenhoehe_by_modelart ( obj_konfig );
}

function check_vorsatzrollladen_kh(obj_konfig) {
    /*if (obj_konfig.roll_model == "roll_model_9" || obj_konfig.roll_model == "roll_model_10" || obj_konfig.roll_model == "roll_model_11") {
        $("#roll_kh_137").prop("disabled", false);
        $("#roll_kh_137").prop("checked", true);
        obj_konfig.roll_kh = "roll_kh_137";
    }*/
    $("#roll_kh_137").prop("disabled", false);
    if ((obj_konfig.roll_model == "roll_model_12" || obj_konfig.roll_model == "roll_model_13" || obj_konfig.roll_model == "roll_model_14") && obj_konfig.roll_kh == "roll_kh_137") {
        $("#roll_kh_137").prop("disabled", true);
        $("#roll_kh_165").prop("checked", true);
        obj_konfig.roll_kh = "roll_kh_165";
    } else {
        $("#roll_kh_137").prop("disabled", false);
    }
    if ((obj_konfig.roll_model == "roll_model_12" || obj_konfig.roll_model == "roll_model_13" || obj_konfig.roll_model == "roll_model_14")) {
        $("#roll_kh_137").prop("disabled", true);
    }
}

function rules_rollladen_schraege(obj_konfig){
    /* Rolladenschräge nur bei 215 kasten*/
    if(obj_konfig.roll_kh=='roll_kh_175'){
        obj_konfig.roll_fs_schraege="roll_fs_schraege_0";
        $('#roll_fs_schraege_0').prop("checked", true)
        $('#roll_fs_schraege_5').attr('disabled',true);
        $('#roll_fs_schraege_7').attr('disabled',true);
    }else{

        $('#roll_fs_schraege_5').attr('disabled',false);
        $('#roll_fs_schraege_7').attr('disabled',false);
    }
}


function _ratio(obj_konfig) {
    rule_35Fest()

    var breite = parseInt($("#breite").val());
    var hoehe = parseInt($("#hoehe").val());
    var hoehe_oben = parseInt($("#hoehe_ol").val());
    var hoehe_unten = parseInt($("#hoehe_ul").val());
    if(!breite){
        breite=obj_konfig.breite;
    }
    if(!hoehe){
        hoehe=obj_konfig.hoehe;
    }
    var ratio = 100;
    var mr = .5;
    var res=true;

    /* TYP 1 */
    var typ = obj_konfig.typ
    var oer = obj_konfig.oer
    var oer_oben = obj_konfig.oer_oben
    var oer_unten = obj_konfig.oer_unten
    //console.log('check ratio', typ, oer)
    if (typ == 'typ1' && (oer == 'fn_1_drehlinks' || oer == 'fn_1_drehrechts' || oer == 'fn_1_drehkipp_links' || oer == 'fn_1_drehkipp_rechts')) {
        mr = .5;
        ratio = hoehe / breite;
        //console.log('Fenster Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioError();
            //return false;
            //checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
        }
    }
    if (typ == 'typ1o1' && (oer_oben == 'fn_1_oberlicht_dl' || oer_oben == 'fn_1_oberlicht_dr' || oer_oben == 'fn_1_oberlicht_dkl' || oer_oben == 'fn_1_oberlicht_dkr')) {
        mr = .5;
        ratio = hoehe_oben / breite;
        //console.log('Oberlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioOberlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ1o2' && oer_oben !== 'ob_f_f' && oer_oben !== 'ob_ff_ff' && oer_oben !== 'ob_k_k') {
        mr = .5 / 2;
        ratio = hoehe_oben / (breite);
        //console.log('Oberlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioOberlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ1o3' && oer_oben !== 'ob_f_f_f' && oer_oben !== 'ob_ff_ff_ff' && oer_oben !== 'ob_k_k_k') {
        mr = .5 / 3;
        ratio = hoehe_oben / (breite / 3);
        //console.log('Oberlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioOberlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ1u1' && (oer_unten == 'fn_1_unterlicht_dl' || oer_unten == 'fn_1_unterlicht_dr' || oer_unten == 'fn_1_unterlicht_dkl' || oer_unten == 'fn_1_unterlicht_dkr')) {
        mr = .5;
        ratio = hoehe_unten / breite;
        //console.log('Unterlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioUnterlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ1u2' && oer_unten !== 'ub_f_f' && oer_unten !== 'ub_ff_ff' && oer_unten !== 'ub_k_k') {
        mr = .5 / 2;
        ratio = hoehe_unten / (breite);
        //console.log('Unterlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioUnterlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ1u3' && oer_unten !== 'ub_f_f_f' && oer_unten !== 'ub_ff_ff_ff' && oer_unten !== 'ub_k_k_k') {
        mr = .5 / 3;
        ratio = hoehe_unten / (breite);
        //console.log('Unterlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioUnterlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    /* TYP 2 */
    if (typ == 'typ2' && (oer == 'fn_2_drehkipp_fest' || oer == 'fn_2_fest_drehkipp' || oer == 'fn_2_drehkipp_dreh_pfosten' || oer == 'fn_2_dreh_drehkipp_pfosten' || oer == 'fn_2_drehkipp_drehkipp_pfosten'
    	|| oer == 'fn_2_drehkipp_dreh_stulp' || oer == 'fn_2_dreh_drehkipp_stulp')) { //
        mr = .5 / 2;
        ratio = hoehe / breite;
        //console.log('Fenster Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioError();
            //return false;
            //checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
        }
    }
    
    if (typ == 'typ2o1' && (oer_oben == 'fn_1_oberlicht_dl' || oer_oben == 'fn_1_oberlicht_dr' || oer_oben == 'fn_1_oberlicht_dkl' || oer_oben == 'fn_1_oberlicht_dkr')) {
        mr = .5;
        ratio = hoehe_oben / breite;
        //console.log('Oberlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioOberlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ2o2' && oer_oben !== 'ob_f_f' && oer_oben !== 'ob_ff_ff' && oer_oben !== 'ob_k_k') {
        mr = .5 / 2;
        ratio = hoehe_oben / (breite);
        //console.log('Oberlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioOberlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ2o3' && oer_oben !== 'ob_f_f_f' && oer_oben !== 'ob_ff_ff_ff' && oer_oben !== 'ob_k_k_k') {
        mr = .5 / 3;
        ratio = hoehe_oben / (breite);
        //console.log('Oberlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioOberlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ2u1' && (oer_unten == 'fn_1_unterlicht_dl' || oer_unten == 'fn_1_unterlicht_dr' || oer_unten == 'fn_1_unterlicht_dkl' || oer_unten == 'fn_1_unterlicht_dkr')) {
        mr = .5;
        ratio = hoehe_unten / breite;
        //console.log('x Unterlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioUnterlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }


    /* TYP 3 */

    if (typ == 'typ3' && oer !== 'fn_3_fest_fest_fest' && oer !== 'fn_3_festfluegel_fesfluegel_festfluegel') {
        mr = .5 / 3;
        ratio = hoehe / breite;
        //console.log('Fenster Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioError();
            //return false;
            //checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
        }
    }


    if (typ == 'typ3u2' && oer_unten !== 'ub_f_f' && oer_unten !== 'ub_ff_ff' && oer_unten !== 'ub_k_k') {
        mr = .5 / 2;
        ratio = hoehe_unten / (breite);
        //console.log('Unterlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioUnterlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }

    if (typ == 'typ3u3' && oer_unten !== 'ub_f_f_f' && oer_unten !== 'ub_ff_ff_ff' && oer_unten !== 'ub_k_k_k') {
        mr = .5 / 3;
        ratio = hoehe_unten / (breite);
        //console.log('Unterlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioUnterlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ3o1' && (oer_oben == 'fn_1_oberlicht_dl' || oer_oben == 'fn_1_oberlicht_dr' || oer_oben == 'fn_1_oberlicht_dkl' || oer_oben == 'fn_1_oberlicht_dkr')) {
        mr = .5;
        ratio = hoehe_oben / breite;
        //console.log('Oberlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioOberlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ3o2' && oer_oben !== 'ob_f_f' && oer_oben !== 'ob_ff_ff' && oer_oben !== 'ob_k_k') {
        mr = .5 / 2;
        ratio = hoehe_oben / (breite);
        //console.log('Oberlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioOberlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ3o3' && oer_oben !== 'ob_f_f_f' && oer_oben !== 'ob_ff_ff_ff' && oer_oben !== 'ob_k_k_k') {
        mr = .5 / 3;
        ratio = hoehe_oben / (breite);
        //console.log('Oberlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioOberlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ3u1' && (oer_unten == 'fn_1_unterlicht_dl' || oer_unten == 'fn_1_unterlicht_dr' || oer_unten == 'fn_1_unterlicht_dkl' || oer_unten == 'fn_1_unterlicht_dkr')) {
        mr = .5;
        ratio = hoehe_unten / breite;
        ////console.log('Unterlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioUnterlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ3u2' && oer_unten !== 'ub_f_f' && oer_unten !== 'ub_ff_ff' && oer_unten !== 'ub_k_k') {
        mr = .5 / 2;
        ratio = hoehe_unten / (breite);
        //console.log('Unterlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioUnterlichtError();
            //return false;
//checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    if (typ == 'typ3u3' && oer_unten !== 'ub_f_f_f' && oer_unten !== 'ub_ff_ff_ff' && oer_unten !== 'ub_k_k_k') {
        mr = .5 / 3;
        ratio = hoehe_unten / (breite);
        //console.log('Unterlicht Ratio: ' + ratio)
        if (ratio <= mr) {
            showRatioUnterlichtError();
            //return false;
            //checkMinMaxMasse( obj_konfig, true );
            res = false;
        } else {
            hideRatioError();
            hideRatioUnterlichtError();
            hideRatioOberlichtError();
        }
    }
    return res;
}

function showRatioError() {
    if(!$('.nav-link[href="masse"]').hasClass('active')){
        window.location.href='masse';
    }
    $('#ratioError').removeClass('hidden');
    $('#btn_profil').attr('disabled', 'disabled');
    $('.cartbutton').attr('disabled', 'disabled');
    $('#btn_sonstiges').attr('disabled', 'disabled');

}

function hideRatioError() {
    $('#ratioError').addClass('hidden');
    $('#btn_profil').attr('disabled', false);
    $('.cartbutton').attr('disabled', false);
    $('#btn_sonstiges').attr('disabled', false);
}

function showRatioOberlichtError() {
    $('#ratioOberlichtError').removeClass('hidden');
    $('.cartbutton').addClass('hidden');
    $('#btn_profil').attr('disabled', 'disabled');
    $('#btn_sonstiges').attr('disabled', true);
}

function hideRatioOberlichtError() {
    $('#ratioOberlichtError').addClass('hidden');
    $('.cartbutton').removeClass('hidden');
    $('#btn_profil').attr('disabled', false);
    $('#btn_sonstiges').attr('disabled', false);
}

function showRatioUnterlichtError() {
    $('#ratioUnterlichtError').removeClass('hidden');
    $('.cartbutton').addClass('hidden');
    $('#btn_profil').attr('disabled', 'disabled');
    $('#btn_sonstiges').attr('disabled', true);
}

function hideRatioUnterlichtError() {
    $('#ratioUnterlichtError').addClass('hidden');
    $('.cartbutton').removeClass('hidden');
    $('#btn_profil').attr('disabled', false);
    $('#btn_sonstiges').attr('disabled', false);
}

function rules_iglo_ext_p7(obj_konfig){
    //console.log('p7 check')
    if(obj_konfig.profil==='p7') {
        obj_konfig.aufbohrschutz="aufbohrschutz_0";
        $('#view_aufbohrschutz').remove();
        obj_konfig.verdeckt_beschlaege='verdeckt_beschlaege_0';
        $('#view_verdeckt_beschlaege').remove();

        $('#fenstergriffe_2').attr('disabled', true);
        $('#fenstergriffe_3').attr('disabled', true);
        $('[name="fenstergriffart"]').parent().css('display', 'none');
        $('#fenstergriffart_1_1').parent().css('display', 'block');
        $('#fenstergriffart_1_3').parent().css('display', 'block');
        if(obj_konfig.fenstergriffart !== 'fenstergriffart_1_1' && obj_konfig.fenstergriffart !=='fenstergriffart_1_3'){
            obj_konfig.fenstergriffart = "fenstergriffart_1_1";
            setBorder('fenstergriffart','fenstergriffart_1_1');
        }


        //console.log('p7 do')
        $("#oer").css('display', 'block');
        $("#oer_oben").css('display', 'none');
        $("#oer_unten").css('display', 'none');

        //$('#oer h6').first().html('Öffnungsrichtung (Ansicht von <strong class="txt-red">außen</strong>)')


        if(obj_konfig.typ !== "typ1" && obj_konfig.typ !== "typ2" && obj_konfig.typ !== "typ3"){
        obj_konfig.typ = "typ1";
        setBorder('typ','typ1');
        }
        $('.typ').parent().css({'display':'none'})
        $('#typ1').parent().css({'display':'block'})
        $('#typ2').parent().css({'display':'block'})
        $('#typ3').parent().css({'display':'block'})

        if(obj_konfig.typ==='typ1'){
                if(obj_konfig.oer!=='fn_1_drehrechts_a' && obj_konfig.oer!=='fn_1_drehlinks_a'){
                obj_konfig.oer='fn_1_drehlinks_a';
                setBorder('oer','fn_1_drehlinks_a');
            }
        }
        if(obj_konfig.typ==='typ2'){
            if(obj_konfig.oer!=='fn_2_drehlinks_pfosten_drehlinks_a' && obj_konfig.oer!=='fn_2_drehrechts_drehlinks_stulp_l_a' && obj_konfig.oer!=='fn_2_drehrechts_drehlinks_stulp_r_a'){
                obj_konfig.oer='fn_2_drehlinks_pfosten_drehlinks_a';
                setBorder('oer','fn_2_drehlinks_pfosten_drehlinks_a');
            }
        }
        if(obj_konfig.typ==='typ3'){
            if(obj_konfig.oer!=='fn_3_drehrechts_stulp_drehlinks_pfosten_drehlinks_a' && obj_konfig.oer!=='fn_3_drehrechts_pfosten_drehrechts_stulp_drehlinks_a'){
                obj_konfig.oer='fn_3_drehrechts_stulp_drehlinks_pfosten_drehlinks_a';
                setBorder('oer','fn_3_drehrechts_stulp_drehlinks_pfosten_drehlinks_a');
            }
        }

        $('.oer').parent().css({'display':'none'})
        $('.p7ext').parent().removeClass('hidden')
        $('.p7ext').parent().css({'display':'block'})

        obj_konfig.roll='roll_0';
        $('#roll_1').attr('disabled', true);
        $('#message_rollladen_7').removeClass(" hidden ");
    }
}

function rules_iglo_ext_p7_reset(obj){
    //console.log('p7 reset')
    $('#a1').trigger('click')

    obj_konfig.profil = obj.id;
    setBorder('art','a1');
    obj_konfig.art = "art";
    setBorder('art','a1');
    obj_konfig.typ = "typ1";
    setBorder('typ','typ1');
    obj_konfig.oer='fn_1_fest_ohne_fluegel';
    setBorder('oer','fn_1_fest_ohne_fluegel');

    $('.p7ext').parent().addClass('hidden')
    $('.p7ext').parent().css({'display':'none'})

    $('.oer').parent().css({'display':'block'})
    $('.typ').parent().css({'display':'block'})
    fktBerechnen(obj_konfig);

}


function setPlentyBasketImg() {
    let p = obj_konfig.images_path + '/h1/profil/';
    switch (obj_konfig.typ) {
        case 'typ1':
            obj_konfig.basket_img_plenty = p + 'typ_einflueglig.svg';
            break;
        case 'typ1o1':
            obj_konfig.basket_img_plenty = p + 'typ_einflueglig_oberlicht_einteilung.svg';
            break;
        case 'typ1o2':
            obj_konfig.basket_img_plenty = p + 'typ_einflueglig_oberlicht_zweiteilung.svg';
            break;
        case 'typ1o3':
            obj_konfig.basket_img_plenty = p + 'typ_einflueglig_oberlicht_dreiteilung.svg';
            break;
        case 'typ1u1':
            obj_konfig.basket_img_plenty = p + 'typ_einflueglig_unterlicht_einteilung.svg';
            break;
        case 'typ1u2':
            obj_konfig.basket_img_plenty = p + 'typ_einflueglig_unterlicht_zweiteilung.svg';
            break;
        case 'typ1u3':
            obj_konfig.basket_img_plenty = p + 'typ_einflueglig_unterlicht_dreiteilung.svg';
            break;
        case 'typ2':
            obj_konfig.basket_img_plenty = p + 'typ_zweiflueglig.svg';
            break;
        case 'typ2o1':
            obj_konfig.basket_img_plenty = p + 'typ_zweiflueglig_oberlicht_einteilung.svg';
            break;
        case 'typ2o2':
            obj_konfig.basket_img_plenty = p + 'typ_zweiflueglig_oberlicht_zweiteilung.svg';
            break;
        case 'typ2o3':
            obj_konfig.basket_img_plenty = p + 'typ_zweiflueglig_oberlicht_dreiteilung.svg';
            break;
        case 'typ2u1':
            obj_konfig.basket_img_plenty = p + 'typ_zweiflueglig_unterlicht_einteilung.svg';
            break;
        case 'typ2u2':
            obj_konfig.basket_img_plenty = p + 'typ_zweiflueglig_unterlicht_zweiteilung.svg';
            break;
        case 'typ2u3':
            obj_konfig.basket_img_plenty = p + 'typ_zweiflueglig_unterlicht_dreiteilung.svg';
            break;
        case 'typ3':
            obj_konfig.basket_img_plenty = p + 'typ_dreiflueglig.svg';
            break;
        case 'typ3o1':
            obj_konfig.basket_img_plenty = p + 'typ_dreiflueglig_oberlicht_einteilung.svg';
            break;
        case 'typ3o2':
            obj_konfig.basket_img_plenty = p + 'typ_dreiflueglig_oberlicht_zweiteilung.svg';
            break;
        case 'typ3o3':
            obj_konfig.basket_img_plenty = p + 'typ_dreiflueglig_oberlicht_dreiteilung.svg';
            break;
        case 'typ3u1':
            obj_konfig.basket_img_plenty = p + 'typ_dreiflueglig_unterlicht_einteilung.svg';
            break;
        case 'typ3u2':
            obj_konfig.basket_img_plenty = p + 'typ_dreiflueglig_unterlicht_zweiteilung.svg';
            break;
        case 'typ3u3':
            obj_konfig.basket_img_plenty = p + 'typ_dreiflueglig_unterlicht_dreiteilung.svg';
            break;
    }
}

function rules_kaempferOLUL(obj_konfig) {
    obj_konfig.kaempfer_ol = 'kaempfer_ol_0';
    obj_konfig.kaempfer_ul = 'kaempfer_ul_0';
    if (obj_konfig.breite >= 2000) {
        if (obj_konfig.typ === 'typ1o1' || obj_konfig.typ === 'typ2o1' || obj_konfig.typ === 'typ3o1') {
            if (obj_konfig.oer_oben === 'fn_1_oberlicht_f' || obj_konfig.oer_oben === 'fn_1_oberlicht_ff') {
                $('#kaempfer_ol_message').removeClass('hidden');
                obj_konfig.kaempfer_ol = 'kaempfer_ol_1';
            } else {
                obj_konfig.kaempfer_ol = 'kaempfer_ol_0';
                $('#kaempfer_ol_message').addClass('hidden');
            }
        }
        if (obj_konfig.typ === 'typ1u1' || obj_konfig.typ === 'typ2u1' || obj_konfig.typ === 'typ3u1') {
            if (obj_konfig.oer_unten === 'fn_1_unterlicht_f' || obj_konfig.oer_unten === 'fn_1_unterlicht_ff') {
                $('#kaempfer_ul_message').removeClass('hidden');
                obj_konfig.kaempfer_ul = 'kaempfer_ul_1';
            } else {
                obj_konfig.kaempfer_ul = 'kaempfer_ul_0';
                $('#kaempfer_ul_message').addClass('hidden');
            }
        }
    }
}

function setGriffeDefault (obj_konfig) {
	console.log('setGriffeDefault');
	obj_konfig.fenstergriffe = "fenstergriffe_0";
	obj_konfig.fenstergriffart = "fenstergriffart_1_1";
}














