function defer(method) {
    if (window.jQuery) {
        method();
    } else {
        setTimeout(function () {
            defer(method);
        }, 450);
    }
}

defer(methodI);

var $optMunicipios = "";

function methodI() {

    try {
        $(document).ready(function () {
            $("#divMensaje")
                .empty()
                .hide();
            var strContenido = $("#divAlmacenes").text();
            if (strContenido == "") {
                var rptJson = $.getJSON(
                    "https://raw.githubusercontent.com/alejandrovillegasdev/exito/master/comprayrecoje/data.json",
                    function (data) {
                        if (data != null && data.departamento.length != 0) {
                            $("#ddlDepartamento").empty();
                            $("#ddlMunicipio").empty();
                            $("#ddlDepartamento").append(
                                new Option("Seleccionar una opción", 0, false, true)
                            );
                            $("#ddlMunicipio").append(
                                new Option("Seleccionar una opción", 0, false, true)
                            );

                            var arrDepartamento = data.departamento;
                            for (var i = 0; i < arrDepartamento.length; i++) {
                                var divDepto = $("<div />")
                                    .attr({
                                        id: "depto" + i,
                                        class: "divDepartamento row"
                                    })
                                    .appendTo("#divAlmacenes");

                                $('<h2 class="col-xs-12 col-md-12" />')
                                    .html(arrDepartamento[i].nombreDep)
                                    .appendTo(divDepto);

                                $("#ddlDepartamento").append(
                                    new Option(
                                        arrDepartamento[i].nombreDep,
                                        "depto" + i,
                                        false,
                                        false
                                    )
                                );
                                var arrMunicipios = arrDepartamento[i].municipios;
                                for (var j = 0; j < arrMunicipios.length; j++) {
                                    var divMun = $("<div />")
                                        .attr({
                                            id: "depto" + i + "-mun" + j,
                                            class: "row divMunicipio col-xs-12 col-md-12"
                                        })
                                        .appendTo(divDepto);
                                    $(
                                        '<h3 class="mun-divider col-xs-12 col-md-12">' +
                                        arrMunicipios[j].nombreMun +
                                        "</h3>"
                                    ).appendTo(divMun);

                                    $("#ddlMunicipio").append(new Option(arrMunicipios[j].nombreMun, "depto" + i + "-mun" + j, false, false));


                                    for (var k = 0; k < arrMunicipios[j].almacenes.length; k++) {
                                        $(pintarAlmacen(arrMunicipios[j].almacenes[k])).appendTo(
                                            divMun
                                        );
                                    }
                                }
                            }
                        }
                        $optMunicipios = $("#ddlMunicipio").children("option");
                        opcionesFormato();

                        // hide all deparments (for compra y recoje purposes)
                        $(".divDepartamento").hide();
                        $(".divMunicipio").hide();
                        $(".divAlmacen").hide();

                    }
                );
                rptJson.error(function () {
                    alert("Existe un error cargando el archivo");
                });
            }
        });

        function pintarAlmacen(almacen) {
            var divAlmacen = $("<div />").attr({
                class: "divAlmacen " + almacen.tipo + " col-xs-12 col-sm-6 col-md-3"
            });
            $("<h4 />")
                .html(almacen.nombre.toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '))
                .appendTo(divAlmacen);
            $("<div />")
                .attr({
                    class: "almacen-divider"
                }).appendTo(divAlmacen);
            $("<p />")
                .attr("class", "almacen-direccion")
                .html(almacen.direccion)
                .appendTo(divAlmacen);

            // var horario = "";
            // for (var j = 0; j < almacen.horarios.length; j++) {
            //     $("<p />")
            //         .attr("class", "almacen-horario")
            //         .html(almacen.horarios[j])
            //         .appendTo(divAlmacen);
            // }
            $("<p />")
                .attr("class", "pFormato")
                .html(almacen.tipo)
                .appendTo(divAlmacen);
            const claseTel = almacen.tipo === 'EXPRESS' ? 'almacen-tel' : 'almacen-cel'
            $("<p />")
                .attr("class", claseTel)
                .html(almacen.telefonos)
                .appendTo(divAlmacen);

            // var tel = "";
            //     for (var i = 0; i < almacen.telefonos.length; i++) {
            //         if (i == 0) {
            //             tel = almacen.telefonos[i];
            //         } else {
            //             tel = tel + " - " + almacen.telefonos[i];
            //         }
            //     }
            //     if (tel != "") {
            //         $("<p />")
            //             .attr("class", "almacen-tel")
            //             .html(tel)
            //             .appendTo(divAlmacen);
            //     }
            return divAlmacen;
        }

        /* +++++ FILTROS +++++++++++++++++++++++++++++++++++++++++++ */
        $("#ddlDepartamento").change(function () {
            $("#ddlMunicipio").val(0);
            consultaFiltros(
                $("#ddlDepartamento option:selected").val(),
                $("#ddlMunicipio option:selected").val(),
                $("#ddlFormato option:selected").val()
            );
        });

        $("#ddlMunicipio").change(function () {
            consultaFiltros(
                $("#ddlDepartamento option:selected").val(),
                $("#ddlMunicipio option:selected").val(),
                $("#ddlFormato option:selected").val()
            );
        });

        $("#ddlFormato").change(function () {
            consultaFiltros(
                $("#ddlDepartamento option:selected").val(),
                $("#ddlMunicipio option:selected").val(),
                $("#ddlFormato option:selected").val()
            );
        });

        function consultaFiltros(opcionDep, opcionMun, opcionFor) {
            if (opcionDep == 0 && opcionMun == 0 && opcionFor == 0) {
                $("#ddlDepartamento").val(0);
                $("#ddlMunicipio")
                    .empty()
                    .append($optMunicipios)
                    .val(0);
                aplicarFiltros(opcionDep, opcionMun, opcionFor);
            } else if (opcionDep != 0 && opcionMun == 0 && opcionFor == 0) {
                $("#ddlMunicipio")
                    .empty()
                    .append(
                        $optMunicipios.filter('[value^="0"],[value^="' + opcionDep + '"]')
                    )
                    .val(0);
                aplicarFiltros(opcionDep, opcionMun, opcionFor);
            } else if (opcionDep == 0 && opcionMun != 0 && opcionFor == 0) {
                opcionDep = opcionMun.split("-")[0];
                $("#ddlMunicipio")
                    .empty()
                    .append(
                        $optMunicipios.filter('[value^="0"],[value^="' + opcionDep + '"]')
                    )
                    .val(opcionMun);
                $("#ddlDepartamento").val(opcionDep);
                aplicarFiltros(opcionDep, opcionMun, opcionFor);
            } else if (opcionDep != 0 && opcionMun != 0 && opcionFor == 0) {
                $("#ddlMunicipio")
                    .empty()
                    .append(
                        $optMunicipios.filter('[value^="0"],[value^="' + opcionDep + '"]')
                    );
                $("#ddlMunicipio").val(opcionMun);
                $("#ddlDepartamento").val(opcionDep);
                aplicarFiltros(opcionDep, opcionMun, opcionFor);
            } else if (opcionDep == 0 && opcionMun == 0 && opcionFor != 0) {
                aplicarFiltros(opcionDep, opcionMun, opcionFor);
                $("#ddlFormato").val(opcionFor);
            } else if (opcionDep == 0 && opcionMun != 0 && opcionFor != 0) {
                opcionDep = opcionMun.split("-")[0];
                $("#ddlMunicipio")
                    .empty()
                    .append(
                        $optMunicipios.filter('[value^="0"],[value^="' + opcionDep + '"]')
                    )
                    .val(opcionMun);
                aplicarFiltros(opcionDep, opcionMun, opcionFor);
                $("#ddlFormato").val(opcionFor);
            } else if (opcionDep != 0 && opcionMun == 0 && opcionFor != 0) {
                $("#ddlMunicipio")
                    .empty()
                    .append(
                        $optMunicipios.filter('[value^="0"],[value^="' + opcionDep + '"]')
                    )
                    .val(0);
                aplicarFiltros(opcionDep, opcionMun, opcionFor);
                $("#ddlFormato").val(opcionFor);
            } else if (opcionDep != 0 && opcionMun != 0 && opcionFor != 0) {
                aplicarFiltros(opcionDep, opcionMun, opcionFor);
                $("#ddlFormato").val(opcionFor);
            }
        }

        function aplicarFiltros(opcionDep, opcionMun, opcionFor) {
            $("#divMensaje")
                .empty()
                .hide();
            $(".divDepartamento").hide();
            $(".divMunicipio").hide();
            $(".divAlmacen").hide();

            var arrFormatosAlma = [];

            var idDep = ".divDepartamento";
            var idMun = ".divMunicipio";
            var idAlm = "divAlmacen";
            if (opcionDep != 0) {
                idDep = "#" + opcionDep;
            }
            if (opcionMun != 0) {
                idMun = "#" + opcionMun;
            }
            if (opcionFor != 0) {
                idAlm = opcionFor;
            }

            $(idDep).each(function () {
                var tieneAlma = 0;
                var divDep = $(this);
                divDep.children(idMun).each(function () {
                    var divMun = $(this);
                    $(divMun)
                        .children(".divAlmacen")
                        .each(function () {
                            var divAlma = $(this);
                            if ($(this).hasClass(idAlm)) {
                                divAlma.show();
                            }
                            if (divAlma.css("display") == "block") {
                                var strFormatoAlma = divAlma.children(".pFormato").html();
                                var control = 0;
                                for (var i = 0; i < arrFormatosAlma.length; i++) {
                                    if (strFormatoAlma == arrFormatosAlma[i]) {
                                        control = 1;
                                        break;
                                    }
                                }
                                if (control == 0) {
                                    arrFormatosAlma.push(strFormatoAlma);
                                }
                                tieneAlma++;
                            }
                        });
                    if (tieneAlma != 0) {
                        divMun.show();
                    }
                });
                if (tieneAlma != 0) {
                    divDep.show();
                }
            });

            if ($("#divAlmacenes div:visible").length == 0) {
                $("<h2 />")
                    .text("No se ha encontrado información relacionada...")
                    .appendTo("#divMensaje");
                $("<h3 />")
                    .text("Te invitamos a realizar una nueva consulta.")
                    .appendTo("#divMensaje");
                $("#divMensaje").show();
            }

            strOpcionFormato = '[value^="0"]';
            for (var i = 0; i < arrFormatosAlma.length; i++) {
                strOpcionFormato =
                    strOpcionFormato + ', [value^="' + arrFormatosAlma[i] + '"]';
            }
        }

        function opcionesFormato() {
            // $("#ddlFormato").append(
            //     new Option("Seleccionar una opción", 0, false, true)
            // );
            var arrFormatosAlma = [];
            $(".divDepartamento")
                .children(".divMunicipio")
                .children(".divAlmacen")
                .each(function () {
                    var strFormatoAlma = $(this)
                        .children(".pFormato")
                        .html();
                    var control = 0;
                    $("#ddlFormato option").each(function () {
                        if (strFormatoAlma == $(this).val()) {
                            control = 1;
                        }
                    });
                    if (control == 0) {
                        arrFormatosAlma.push(strFormatoAlma);
                        $("#ddlFormato").append(
                            new Option(strFormatoAlma, strFormatoAlma, false, false)
                        );
                    }
                });
        }
    } catch (error) {
        console.log("Error en centro de ayuda almacenes.");
        console.error(error);
    }
}
