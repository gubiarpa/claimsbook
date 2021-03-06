﻿ 
/* Document Loaded */
$(document).ready(() => {
    
    /* Document Types */
    $.ajax({
        type: 'GET',
        url: buildEndpoint('Claims/GetDocumentTypes'),
        success(array) {
            let options = printOptionInSelect(null, 'Tipo de Documento');
            for (let elem of array) {
                options += printOptionInSelect(elem.id, elem.description);
            }
            $('[data-id="documentType"]').html(options).removeAttr('disabled');
        }
    });

    $('[data-id="documentType"]').change(function () {
        let triggerControl = $(this).attr('id');
        let affectedControls = $(this).attr('data-for').split(',');
        let affectedLengthControls = $(this).attr('data-length').split(',');
        enableControls(triggerControl, affectedControls);
        changeInputByDocumentType(triggerControl, affectedLengthControls);
        enablePersonalInfoForm();
    });

    /* Text input remove danger */
    $([
        '#textDocumentNumber',
        '#textClaimerName',
        '#textSurnameFather',
        '#textSurnameMother',
        '#textTelephone',
        '#textMail',
        '#textAddress',
        '#textGuardDocumentNumber',
        '#textGuardClaimerName',
        '#textGuardSurnameFather',
        '#textGuardSurnameMother',
        '#textClaimedAmount'
    ].join(',')).change(function () {
        $(this).removeClass('border-danger');
    });

    /* Select remove danger */
    $([
        '#selectDepartment',
        '#selectProvince',
        '#selectDistrict',
        '#selectGuardDepartment',
        '#selectGuardProvince',
        '#selectGuardDistrict'
    ].join(',')).change(function () {
        $(this).removeClass('border-danger');
    });

    /* Answer Types */
    $.ajax({
        type: 'GET',
        url: buildEndpoint('Claims/GetAnswerTypes'),
        success(array) {
            let options = printOptionInSelect(null, 'Tipo de Respuesta');
            for (let elem of array) {
                options += printOptionInSelect(elem.id, elem.description);
            }
            $('[data-id="answerType"]').html(options);
            $('#selectAnswerType').removeAttr('disabled');
        }
    });

    $('[data-id="answerType"]').change(function () {
        $('#selectGuardAnswerType').val($(this).val());
        let triggerControl = $(this).attr('id');
        let affectedControls = $(this).attr('data-for').split(',');
        enableControls(triggerControl, affectedControls);
        enablePersonalInfoForm();
    });

    /* Departments */
    $.ajax({
        type: 'GET',
        url: buildEndpoint('Claims/GetDepartments'),
        success(array) {
            let options = printOptionInSelect(null, 'Departamento');
            for (let elem of array) {
                options += printOptionInSelect(elem.code, elem.department);
            }
            $('#selectDepartment').html(options);
            $('#selectGuardDepartment').html(options);
        }
    });

    $.ajax({
        type: 'GET',
        url: buildEndpoint('Claims/GetCompanyInfo'),
        success(result) {
            $('#companyName').html(result.name);
            $('#companyDocumentNumber').html(result.documentNumber);
            $('#companyAddress').html(result.address);
            $('[name="WebSiteKey"]').html(result.WebSiteKey);
        }
    });

    /* Only Digits with conditions */
    $([
        '#textDocumentNumber',
        '#textGuardDocumentNumber'
    ].join(',')).keydown(function (e) {
        if (!((/^[0-9]*$/).test(e.key) || [8, 9, 13, 16, 35, 36, 37, 39, 46].indexOf(e.keyCode) >= 0 || (e.originalEvent.ctrlKey))) {
            let documentNumberId = $(this).attr('id');
            let documentTypeValue = $(`[data-length="${documentNumberId}"] option:selected`).text();
            if (documentTypeValue == 'DNI') {
                e.preventDefault();
            }
        }
    });

    /* Only Digits */
    $([
        '#textTelephone',
        '#textGuardTelephone'
    ].join(',')).keydown(function (e) {
        if (! ( (/^[0-9]*$/).test(e.key) || [8, 9, 13, 16, 35, 36, 37, 39, 46].indexOf(e.keyCode) >= 0 || ( e.originalEvent.ctrlKey ) ) ) {
            e.preventDefault();
        }
    });

    /* No digits */
    $([
        '#textClaimerName',
        '#textSurnameFather',
        '#textSurnameMother',
        '#textGuardClaimerName',
        '#textGuardSurnameFather',
        '#textGuardSurnameMother'
    ].join(',')).keydown(function (e) {
        if ((/^[0-9]*$/).test(e.key)) {
            e.preventDefault();
        }
    });

    $('#selectDepartment').change(function () {
        changeGeoZone({
            selectSubzone: 'selectDistrict',
            subZoneDefault: 'Distrito',
            ajaxMethod: 'GET',
            url: buildEndpoint('Claims/GetProvinces'),
            body: $(this).val(),
            zoneDefault: 'Provincia',
            selectZone: 'selectProvince'
        }, function (elem) {
            return printOptionInSelect(elem.code, elem.province);
        }, { code: null, province: 'Provincia' }, { code: null, province: 'Distrito' })
    });

    $('#selectGuardDepartment').change(function () {
        changeGeoZone({
            selectSubzone: 'selectGuardDistrict',
            subZoneDefault: 'Distrito',
            ajaxMethod: 'GET',
            url: buildEndpoint('Claims/GetProvinces'),
            body: $(this).val(),
            zoneDefault: 'Provincia',
            selectZone: 'selectGuardProvince'
        }, function (elem) {
            return printOptionInSelect(elem.code, elem.province);
        }, { code: null, province: 'Provincia' }, { code: null, province: 'Distrito' }
        )
    });

    /* Provinces */
    $('#selectProvince').change(function () {
        changeGeoZone({
            selectSubzone: 'selectDistrict',
            subZoneDefault: null,
            ajaxMethod: 'GET',
            url: buildEndpoint('Claims/GetDistricts'),
            body: $(this).val(),
            zoneDefault: 'Distrito',
            selectZone: 'selectDistrict'
        }, function (elem) {
            return printOptionInSelect(elem.code, elem.district);
        }, { code: null, district: 'Distrito' }, { code: null, district: null })
    });

    $('#selectGuardProvince').change(function () {
        changeGeoZone({
            selectSubzone: 'selectGuardDistrict',
            subZoneDefault: null,
            ajaxMethod: 'GET',
            url: buildEndpoint('Claims/GetDistricts'),
            body: $(this).val(),
            zoneDefault: 'Distrito',
            selectZone: 'selectGuardDistrict'
        }, function (elem) {
            return printOptionInSelect(elem.code, elem.district);
        }, { code: null, district: 'Distrito' }, { code: null, district: null })
    });

    /* Districts */
    $('#selectDistrict').change(function () {

    });

    /* Claimed Amount, Good Description */
    $('#textClaimedAmount,#textDescription').keyup(function (event) {
        enableContractedGoodForm();
    });

    $('#checkIsProduct,#checkIsService,#textClaimedAmount,#textDescription').change(function () {
        enableContractedGoodForm();
    });

    /* Claim Detail */
    $('#textClaimDetail,#textOrderDetail').keyup(function (event) {
        enableClaimDetailForm();
    });

    $('#checkIsClaim,#checkIsComplaint,#textClaimDetail,#textOrderDetail').change(function () {
        enableClaimDetailForm();
    })

    /* Younger */
    $('#checkIsYounger').change(function () {
        let guardForm = $('#guardForm');
        setTimeout(() => {
            guardForm.toggleClass('not-display');
            guardForm.toggleClass('invisible');
            guardForm.addClass('animate__fadeIn');
        }, 200);
        $("html, body").animate({ scrollTop: $(document).height() }, 700);
        enablePersonalInfoForm();
    });

    /* Continue */
    $('[name="btnContinue"]').click(function () {

        let parentFormName = $(this).attr('data-parentForm');
        let nextFormName = $(this).attr('data-nextForm');

        let validationResult = validateForm(parentFormName);

        if (validationResult.length == 0) {
            /// (i) Cambio de formulario
            $(`#${parentFormName}`).toggleClass('not-display');
            $(`#${nextFormName}`).toggleClass('not-display animate__animated animate__fadeIn');

            /// (ii) Línea de progreso
            let selectorStr = `[data-type="lineProgress"][data-form="${nextFormName}"]`;
            $(selectorStr).removeClass('inactive');
        }


        /// (iii) Actualización de Resumen Final
        updateSummary();
    });

    /* Check Agree */
    $('[name="checkAgree"]').change(function () {
        let agreeList = $('[name="checkAgree"]');
        let isEnabled = agreeList[0].checked;
        let btnSend = $('#btnSend');
        if (isEnabled) {
            btnSend.removeAttr('disabled');
        }
        else {
            btnSend.attr('disabled', 'disabled');
        }
    });

    /* Send */
    $('#btnSend').click(sendForm);

    $('#btnPdfGenerator').click(openPdf);

/* Window resize */
    windowSetSize();
    $(window).resize(windowSetSize);
});

/* Change Department */
const changeGeoZone = (obj, printerMethod, defaultElem, defaultSubElem) => {

    $(`#${obj.selectSubzone} option`).remove();
    $(`#${obj.selectSubzone}`).attr('disabled', 'disabled');
    $(`#${obj.selectSubzone}`).html(printerMethod(defaultSubElem));
    $.ajax({
        type: obj.ajaxMethod,
        url: obj.url,
        data: { geoCode: obj.body },
        success(array) {
            let options = printerMethod(defaultElem);
            for (let elem of array) {
                options += printerMethod(elem)
            }
            $(`#${obj.selectZone}`).html(options).removeAttr('disabled');
        }
    });
}

/* Catch Form */
const getDataForm = (nameForm) => {
    switch (nameForm) {
        case 'personalInfoForm':
            return {
                mainClaimer: {
                    document: {
                        type: $('#selectDocumentType option:selected'),
                        number: $('#textDocumentNumber')
                    },
                    name: $('#textClaimerName'),
                    paternalSurname: $('#textSurnameFather'),
                    maternalSurname: $('#textSurnameMother'),
                    telephone: $('#textTelephone'),
                    mail: $('#textMail'),
                    address: $('#textAddress'),
                    geoZone: {
                        department: $('#selectDepartment option:selected'),
                        province: $('#selectProvince option:selected'),
                        district: $('#selectDistrict option:selected')
                    },
                    isAdult: !$('#checkIsYounger')[0].checked
                },
                guardClaimer: {
                    document: {
                        type: $('#selectGuardDocumentType option:selected'),
                        number: $('#textGuardDocumentNumber')
                    },
                    name: $('#textGuardClaimerName'),
                    paternalSurname: $('#textGuardSurnameFather'),
                    maternalSurname: $('#textGuardSurnameMother'),
                    telephone: $('#textGuardTelephone'),
                    mail: $('#textGuardMail'),
                    address: $('#textGuardAddress'),
                    geoZone: {
                        department: $('#selectGuardDepartment option:selected'),
                        province: $('#selectGuardProvince option:selected'),
                        district: $('#selectGuardDistrict option:selected')
                    }
                }
            };
        case 'contractedGoodForm':
            return {
                type: {
                    isProduct: $('#checkIsProduct')[0].checked,
                    isService: $('#checkIsService')[0].checked
                },
                claimedAmount: $('#textClaimedAmount'),
                description: $('#textDescription')
            };
        case 'claimDetailForm':
            return {
                type: {
                    isClaim: $('#checkIsClaim')[0].checked,
                    isComplaint: $('#checkIsComplaint')[0].checked
                },
                claimDetail: $('#textClaimDetail'),
                orderDetail: $('#textOrderDetail')
            };
        default:
            return null;
    }
}

/* Validation */
const validateForm = (nameForm) => {

    let errors = [];

    switch (nameForm) {
        case 'personalInfoForm':
            let personalInfoform = getDataForm(nameForm);
            /// Document Number
            if ((personalInfoform.mainClaimer.document.number.val() == '') ||
                ((personalInfoform.mainClaimer.document.type.text() == 'DNI') && (personalInfoform.mainClaimer.document.number.val().length != 8)) ) {
                personalInfoform.mainClaimer.document.number.addClass('border-danger');
                errors.push({ title: 'DNI', message: 'El DNI debe ser numérico y de 8 dígitos' });
            }
            /// Name
            if (personalInfoform.mainClaimer.name.val() == '') {
                personalInfoform.mainClaimer.name.addClass('border-danger');
                errors.push({ title: 'Nombre', message: 'Debe ingresar su nombre' });
            }
            /// Paternal Surname
            if (personalInfoform.mainClaimer.paternalSurname.val() == '') {
                personalInfoform.mainClaimer.paternalSurname.addClass('border-danger');
                errors.push({ title: 'Apellido Paterno', message: 'Debe ingresar su apellido paterno' });
            }
            /// Maternal Surname
            if (personalInfoform.mainClaimer.maternalSurname.val() == '') {
                personalInfoform.mainClaimer.maternalSurname.addClass('border-danger');
                errors.push({ title: 'Apellido Materno', message: 'Debe ingresar su apellido materno' });
            }
            /// Telephone
            if (personalInfoform.mainClaimer.telephone.val().length != 9) {
                personalInfoform.mainClaimer.telephone.addClass('border-danger');
                errors.push({ title: 'Teléfono', message: 'Debe ingresar un número de contacto' });
            }
            /// EMail
            if (!validateEmail(personalInfoform.mainClaimer.mail.val())) {
                personalInfoform.mainClaimer.mail.addClass('border-danger');
                errors.push({ title: 'Correo Electrónico', message: 'Debe ingresar un email correcto' });
            }
            /// Address
            if (personalInfoform.mainClaimer.address.val() == 0) {
                personalInfoform.mainClaimer.address.addClass('border-danger');
                errors.push({ title: 'Dirección', message: 'Debe ingresar una dirección' });
            }
            /// Department
            if (personalInfoform.mainClaimer.geoZone.department.text() == 'Departamento') {
                personalInfoform.mainClaimer.geoZone.department.parent().addClass('border-danger');
                errors.push({ title: 'Departamento', message: 'Debe seleccionar un departamento' });
            }
            else {
                /// Province
                if (personalInfoform.mainClaimer.geoZone.province.text() == 'Provincia') {
                    personalInfoform.mainClaimer.geoZone.province.parent().addClass('border-danger');
                    errors.push({ title: 'Provincia', message: 'Debe seleccionar una provincia' });
                }
                else {
                    /// District
                    if (personalInfoform.mainClaimer.geoZone.district.text() == 'Distrito') {
                        personalInfoform.mainClaimer.geoZone.district.parent().addClass('border-danger');
                        errors.push({ title: 'Distrito', message: 'Debe seleccionar un distrito' });
                    }
                }
            }
            
            if (!personalInfoform.mainClaimer.isAdult) {
                /// Document Number (Guard)
                if ((personalInfoform.guardClaimer.document.number.val() == '') ||
                    ((personalInfoform.guardClaimer.document.type.text() == 'DNI') && (personalInfoform.guardClaimer.document.number.val().length != 8))) {
                    personalInfoform.guardClaimer.document.number.addClass('border-danger');
                    errors.push({ title: 'DNI', message: 'El DNI del apoderado debe ser numérico y de 8 dígitos' });
                }
                /// Name (Guard)
                if (personalInfoform.guardClaimer.name.val() == '') {
                    personalInfoform.guardClaimer.name.addClass('border-danger');
                    errors.push({ title: 'Nombre', message: 'Debe ingresar su nombre' });
                }
                /// Paternal Surname (Guard)
                if (personalInfoform.guardClaimer.paternalSurname.val() == '') {
                    personalInfoform.guardClaimer.paternalSurname.addClass('border-danger');
                    errors.push({ title: 'Apellido Paterno', message: 'Debe ingresar su apellido paterno' });
                }
                /// Maternal Surname (Guard)
                if (personalInfoform.guardClaimer.maternalSurname.val() == '') {
                    personalInfoform.guardClaimer.maternalSurname.addClass('border-danger');
                    errors.push({ title: 'Apellido Materno', message: 'Debe ingresar su apellido materno' });
                }
                /// Telephone (Guard)
                if (personalInfoform.guardClaimer.telephone.val() == '') {
                    personalInfoform.guardClaimer.telephone.addClass('border-danger');
                    errors.push({ title: 'Teléfono', message: 'Debe ingresarse el número de teléfono' });
                }
                /// Answer Type (Guard)
                if (personalInfoform.guardClaimer.address.val() == 0) {
                    personalInfoform.guardClaimer.address.addClass('border-danger');
                    errors.push({ title: 'Dirección', message: 'Debe ingresar una dirección' });
                }
                /// Department
                if (personalInfoform.guardClaimer.geoZone.department.text() == 'Departamento') {
                    personalInfoform.guardClaimer.geoZone.department.parent().addClass('border-danger');
                    errors.push({ title: 'Departamento', message: 'Debe seleccionar un departamento' });
                }
                else {
                    /// Province
                    if (personalInfoform.guardClaimer.geoZone.province.text() == 'Provincia') {
                        personalInfoform.guardClaimer.geoZone.province.parent().addClass('border-danger');
                        errors.push({ title: 'Provincia', message: 'Debe seleccionar una provincia' });
                    }
                    else {
                        /// District
                        if (personalInfoform.guardClaimer.geoZone.district.text() == 'Distrito') {
                            personalInfoform.guardClaimer.geoZone.district.parent().addClass('border-danger');
                            errors.push({ title: 'Distrito', message: 'Debe seleccionar un distrito' });
                        }
                    }
                }
            }
            errors.forEach(e => console.log(e));
            break;
        case 'contractedGoodForm':
            let contractedGoodForm = getDataForm(nameForm);
            /// Validar que es un número (entero o decimal)
            if (!validateDecimal(contractedGoodForm.claimedAmount.val())) {
                contractedGoodForm.claimedAmount.addClass('border-danger');
                errors.push({ title: 'Monto reclamado', message: 'Debe ingresar un monto numérico' })
            }
            break;
        case 'claimDetailForm':
            break;
        case 'finalSummaryForm':
            break;
        default:
            break;
    }

    return errors;
}

/* Summary Update */
const updateSummary = () => {

    /// (i) Información del Consumidor Reclamante
    let sumDocument = `${$('#selectDocumentType option:selected').text()} ${$('#textDocumentNumber').val()}`;
    let sumFullName = `${$('#textClaimerName').val()} ${$('#textSurnameFather').val()} ${$('#textSurnameMother').val()}`;
    let sumPhoneNumber = `${$('#textTelephone').val()}`;
    let sumAnswerType = `${$('#selectAnswerType option:selected').text()}`;
    let sumEMail = `${$('#textMail').val()}`;
    let sumFullAddress = `${$('#textAddress').val()} ${$('#selectDistrict option:selected').text()}, ${$('#selectProvince option:selected').text()}, ${$('#selectDepartment option:selected').text()}`;
    let sumIsAdult = `${$('#checkIsYounger')[0].checked ? 'No' : 'Sí'}`;

    /// (ii) Información del Apoderado
    let sumGuardDocument = `${$('#selectGuardDocumentType option:selected').text()} ${$('#textGuardDocumentNumber').val()}`;
    let sumGuardFullName = `${$('#textGuardClaimerName').val()} ${$('#textGuardSurnameFather').val()} ${$('#textGuardSurnameMother').val()}`;
    let sumGuardPhoneNumber = `${$('#textGuardTelephone').val()}`;
    let sumGuardEmail = `${$('#textGuardMail').val()}`;
    let sumGuardFullAddress = `${$('#textGuardAddress').val()} ${$('#selectGuardDistrict option:selected').text()}, ${$('#selectGuardProvince option:selected').text()}, ${$('#selectGuardDepartment option:selected').text()}`;

    /// (iii) Información del Bien Contratado
    let sumGoodType = `${$('#checkIsProduct')[0].checked ? 'Producto' : 'Servicio'}`;
    let sumClaimedAmount = `S/ ${$('#textClaimedAmount').val()}`;
    let sumDescription = `${$('#textDescription').val()}`;

    /// (iv) Detalle del Reclamo
    let sumClaimType = $('#checkIsClaim')[0].checked ? 'Reclamo' : 'Queja';
    let sumClaimDetail = $('#textClaimDetail').val();
    let sumOrderDetail = $('#textOrderDetail').val();

    /// [Impresión de valores]
    $('#sumDocument').html(sumDocument);
    $('[name="sumFullName"]').html(sumFullName); // modal
    $('[name="ClaimOrComplaint"]').html(sumClaimType); // modal
    $('#sumPhoneNumber').html(sumPhoneNumber);
    $('[name="sumAnswerType"]').html(sumAnswerType); // same value for main and guard
    $('#sumEMail').html(sumEMail);
    $('#sumFullAddress').html(sumFullAddress);
    $('#sumIsAdult').html(sumIsAdult);

    if (sumIsAdult == 'Sí') { // Hide/Show Section
        $('#block-isNotAdult').addClass('not-display');
    }

    $('#sumGoodType').html(sumGoodType);
    $('#sumClaimedAmount').html(sumClaimedAmount);
    $('#sumDescription').html(sumDescription);

    $('#sumClaimType').html(sumClaimType);
    $('#sumClaimDetail').html(sumClaimDetail);
    $('#sumOrderDetail').html(sumOrderDetail);

    $('#sumGuardDocument').html(sumGuardDocument);
    $('#sumGuardFullName').html(sumGuardFullName);
    $('#sumGuardPhoneNumber').html(sumGuardPhoneNumber);
    $('#sumGuardEmail').html(sumGuardEmail);
    $('#sumGuardFullAddress').html(sumGuardFullAddress);
};

/* Sending */
const sendForm = () => {

    /// (i) Personal Info
    let mainClaimer = {
        documentType: $('#selectDocumentType').val(),
        documentNumber: $('#textDocumentNumber').val(),
        names: $('#textClaimerName').val(),
        paternalSurname: $('#textSurnameFather').val(),
        maternalSurname: $('#textSurnameMother').val(),
        phoneNumber: $('#textTelephone').val(),
        answerType: $('#selectAnswerType option:selected').val(),
        eMail: $('#textMail').val(),
        address: $('#textAddress').val(),
        geoZone: $('#selectDistrict').val()
    };
    let isAdult = !$('#checkIsYounger')[0].checked;
    let guardClaimer = {
        documentType: $('#selectGuardDocumentType').val(),
        documentNumber: $('#textGuardDocumentNumber').val(),
        names: $('#textGuardClaimerName').val(),
        paternalSurname: $('#textGuardSurnameFather').val(),
        maternalSurname: $('#textGuardSurnameMother').val(),
        phoneNumber: $('#textGuardTelephone').val(),
        answerType: $('#selectAnswerType option:selected').val(),
        eMail: $('#textGuardMail').val(),
        address: $('#textGuardAddress').val(),
        geoZone: $('#selectGuardDistrict').val()
    };

    /// (ii) Contracted Good
    let contractedGood = {
        isAProduct: $('#checkIsProduct')[0].checked, // or a service
        claimedAmount: $('#textClaimedAmount').val(),
        goodDescription: $('#textDescription').val()
    };

    /// (iii) Claim Detail
    let claimDetail = {
        isAClaim: $('#checkIsClaim')[0].checked, // or a complaint (queja)
        claimDetail: $('#textClaimDetail').val(),
        orderDetail: $('#textOrderDetail').val()
    };

    /// (iv) Token
    let token = $('#googleCatpchaToken').val();

    /// (v) Group Information
    let claim = {
        isAdult,
        mainClaimer,
        guardClaimer,
        contractedGood,
        claimDetail,
        token
    };

    /// (vi) Consuming API
    $.ajax({
        type: 'POST',
        url: buildEndpoint('Claims/SaveClaim'),
        data: claim,
        success(result) {
            if (result.isValidKey) {
                $('[name="checkAgree"]').attr('disabled', 'disabled');
                $('#btnSend').attr('disabled', 'disabled');
                $('[name="claimSheetNumber"]').html(`${result.yearNumber}-${zeroPad(result.serialNumber, 4)}`);
                $('#exampleModalLongTitle').html('Hoja de reclamación enviada');
                $('#btnPdfGenerator').attr('data-value', result.id).html('Imprimir').removeAttr('disabled');
            } else {
                $('[name="checkAgree"]').removeAttr('disabled');
                $('#btnSend').removeAttr('disabled');
                $('#exampleModalLongTitle').html('Error de envío');
                let i = 3;
                setInterval(() => { $('#btnPdfGenerator').html(`Cargando en ${i--}`) }, 1000);
                setTimeout(() => { location.reload(true); }, 4000);
            }
        },
        error(xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });

};

/* Open PDF */
const openPdf = () => {
    let id = $('#btnPdfGenerator').attr('data-value');
    window.open(buildEndpoint('Claims/GenerateClaimPdf/') + id, '_blank');
}

/* Event Resizing (and loading) */
const windowSetSize = () => {
    
    let limit = 768,
        position1 = 0.07, position2 = 0.27, position3 = 0.47, position4 = 0.67;

    if (window.innerWidth < limit) {
        /// Padding Left
        $('svg').css('padding-left', window.innerWidth * 0.05);
        /// Circle
        $('#svgCircle1').attr('cx', window.innerWidth * position1);
        $('#svgCircle2').attr('cx', window.innerWidth * position2);
        $('#svgCircle3').attr('cx', window.innerWidth * position3);
        $('#svgCircle4').attr('cx', window.innerWidth * position4);
        /// Line
        $('#svgLine2').attr('x', window.innerWidth * position1).attr('width', window.innerWidth * (position2 - position1));
        $('#svgLine3').attr('x', window.innerWidth * position2).attr('width', window.innerWidth * (position3 - position2));
        $('#svgLine4').attr('x', window.innerWidth * position3).attr('width', window.innerWidth * (position4 - position3));
    } else {
        /// Text
        $('#svgText1').attr('x', limit * position1 - 50);
        $('#svgText2').attr('x', limit * position2 - 20);
        $('#svgText3').attr('x', limit * position3 - 20);
        $('#svgText4').attr('x', limit * position4 + 10);
    }
}
