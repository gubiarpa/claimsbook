﻿/*
 * HELPERS
 */
/**
 * Construye una etiqueta <option> en texto
 * dataValue : Valor para el atributo value
 * displayValue : Valor visualizado por el usuario
 */
function printOptionInSelect(dataValue, displayValue) {
    return `<option ${ dataValue == null ? 'disabled selected' : ''} value=${quoteNull(dataValue)}>${displayValue}</option>`;
}

function enableControls(triggerControl, affectedControls) {
    let _triggerControl = $(`#${triggerControl}`);
    if (_triggerControl != null) {
        for (var affectedControl of affectedControls) {
            $(`#${affectedControl}`).removeAttr('disabled');
        }
    }
}

/*
 * AUXILIAR
 */
function quoteNull(value) {
    return value == null ? null : `'${value}'`;
}

function buildEndpoint(methodname) {
    return `${window.location.href}${window.location.href.substr(window.location.href.length - 1, 1) == '/' ? '' : '/'}${methodname}`;
}

/* Validate Mail */
function validateEmail(mail) {
    return (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/).test(mail);
}
